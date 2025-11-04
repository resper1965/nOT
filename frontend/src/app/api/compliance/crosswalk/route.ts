// Control Crosswalk API Route
// GET /api/compliance/crosswalk
// POST /api/compliance/crosswalk

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';

/**
 * GET /api/compliance/crosswalk
 * Lista mapeamentos de crosswalk entre frameworks
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
    const sourceFrameworkId = searchParams.get('source_framework_id');
    const targetFrameworkId = searchParams.get('target_framework_id');
    const sourceControlId = searchParams.get('source_control_id');
    const mappingType = searchParams.get('mapping_type');

    // Construir query
    let query = supabase
      .from('control_crosswalk')
      .select('*')
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (sourceFrameworkId) {
      query = query.eq('source_framework_id', sourceFrameworkId);
    }
    if (targetFrameworkId) {
      query = query.eq('target_framework_id', targetFrameworkId);
    }
    if (sourceControlId) {
      query = query.eq('source_control_id', sourceControlId);
    }
    if (mappingType) {
      query = query.eq('mapping_type', mappingType);
    }

    const { data: crosswalks, error } = await query;

    if (error) {
      console.error('Error fetching crosswalk mappings:', error);
      throw error;
    }

    // Obter estatísticas
    const { count: total } = await supabase
      .from('control_crosswalk')
      .select('*', { count: 'exact', head: true });

    const { count: exact } = await supabase
      .from('control_crosswalk')
      .select('*', { count: 'exact', head: true })
      .eq('mapping_type', 'exact');

    const { count: partial } = await supabase
      .from('control_crosswalk')
      .select('*', { count: 'exact', head: true })
      .eq('mapping_type', 'partial');

    return NextResponse.json({
      crosswalks: crosswalks || [],
      statistics: {
        total: total || 0,
        exact: exact || 0,
        partial: partial || 0,
        related: (total || 0) - (exact || 0) - (partial || 0),
      },
    });
  } catch (error: any) {
    console.error('Error fetching crosswalk mappings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crosswalk mappings', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/compliance/crosswalk
 * Cria um novo mapeamento de crosswalk
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      source_framework_id, 
      source_control_id, 
      target_framework_id, 
      target_control_id,
      mapping_type,
      confidence,
      evidence_event_ids,
      metadata 
    } = body;

    // Validações
    if (!source_framework_id || !source_control_id) {
      return NextResponse.json(
        { error: 'source_framework_id and source_control_id are required' },
        { status: 400 }
      );
    }

    if (!target_framework_id || !target_control_id) {
      return NextResponse.json(
        { error: 'target_framework_id and target_control_id are required' },
        { status: 400 }
      );
    }

    if (source_framework_id === target_framework_id && source_control_id === target_control_id) {
      return NextResponse.json(
        { error: 'Source and target cannot be the same' },
        { status: 400 }
      );
    }

    if (mapping_type && !['exact', 'partial', 'related'].includes(mapping_type)) {
      return NextResponse.json(
        { error: 'Invalid mapping_type. Must be: exact, partial, or related' },
        { status: 400 }
      );
    }

    // Obter tenant_id (pode ser do usuário ou do cliente)
    // Por enquanto, vamos usar null ou obter do contexto
    const tenantId = null; // TODO: Obter do contexto do usuário

    // Criar mapeamento
    const { data: crosswalk, error: createError } = await supabase
      .from('control_crosswalk')
      .insert({
        tenant_id: tenantId,
        source_framework_id: source_framework_id,
        source_control_id: source_control_id,
        target_framework_id: target_framework_id,
        target_control_id: target_control_id,
        mapping_type: mapping_type || 'related',
        confidence: confidence || 1.0,
        evidence_event_ids: evidence_event_ids || [],
        metadata: metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating crosswalk mapping:', createError);
      throw createError;
    }

    return NextResponse.json({
      crosswalk: crosswalk,
      message: 'Crosswalk mapping created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating crosswalk mapping:', error);
    return NextResponse.json(
      { error: 'Failed to create crosswalk mapping', message: error.message },
      { status: 500 }
    );
  }
}

