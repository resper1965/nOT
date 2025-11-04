// Control Crosswalk Suggest API Route
// GET /api/compliance/crosswalk/suggest
// Sugere mapeamentos de crosswalk baseado em controles similares

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';

/**
 * GET /api/compliance/crosswalk/suggest
 * Sugere mapeamentos de crosswalk para um controle específico
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Obter parâmetros de query
    const searchParams = request.nextUrl.searchParams;
    const sourceControlId = searchParams.get('source_control_id');
    const targetFrameworkId = searchParams.get('target_framework_id');

    if (!sourceControlId) {
      return NextResponse.json(
        { error: 'source_control_id is required' },
        { status: 400 }
      );
    }

    // Obter informações do controle de origem
    const { data: sourceControl, error: controlError } = await supabase
      .from('controls')
      .select('id, control_code, control_title, description, framework_id')
      .eq('id', sourceControlId)
      .single();

    if (controlError || !sourceControl) {
      return NextResponse.json(
        { error: 'Source control not found' },
        { status: 404 }
      );
    }

    // Buscar controles similares no framework de destino
    let targetControlsQuery = supabase
      .from('controls')
      .select('id, control_code, control_title, description, framework_id')
      .neq('framework_id', sourceControl.framework_id);

    if (targetFrameworkId) {
      targetControlsQuery = targetControlsQuery.eq('framework_id', targetFrameworkId);
    }

    const { data: targetControls, error: targetsError } = await targetControlsQuery;

    if (targetsError) {
      console.error('Error fetching target controls:', targetsError);
      throw targetsError;
    }

    // Verificar mapeamentos existentes
    const { data: existingMappings, error: mappingsError } = await supabase
      .from('control_crosswalk')
      .select('target_control_id')
      .eq('source_control_id', sourceControlId);

    const existingTargetIds = existingMappings?.map(m => m.target_control_id) || [];

    // Filtrar controles já mapeados
    const availableTargets = (targetControls || []).filter(
      tc => !existingTargetIds.includes(tc.id)
    );

    // Simular sugestões baseadas em similaridade (em produção, usar IA)
    // Por enquanto, retornar todos os controles disponíveis
    const suggestions = availableTargets.map((target, index) => ({
      target_control: target,
      similarity_score: 0.5 + (Math.random() * 0.4), // Simulado: 0.5-0.9
      confidence: 'medium',
      reasoning: `Controle similar encontrado no framework de destino`,
    }));

    // Ordenar por score de similaridade
    suggestions.sort((a, b) => b.similarity_score - a.similarity_score);

    return NextResponse.json({
      source_control: sourceControl,
      suggestions: suggestions.slice(0, 10), // Top 10 sugestões
      total_available: availableTargets.length,
    });
  } catch (error: any) {
    console.error('Error suggesting crosswalk mappings:', error);
    return NextResponse.json(
      { error: 'Failed to suggest crosswalk mappings', message: error.message },
      { status: 500 }
    );
  }
}

