// Control Crosswalk Detail API Route
// GET /api/compliance/crosswalk/[id]
// PUT /api/compliance/crosswalk/[id]
// DELETE /api/compliance/crosswalk/[id]

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';

/**
 * GET /api/compliance/crosswalk/[id]
 * Obtém detalhes de um mapeamento de crosswalk
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await getServerSupabaseClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Obter crosswalk com informações dos frameworks e controles
    const { data: crosswalk, error } = await supabase
      .from('control_crosswalk')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching crosswalk:', error);
      throw error;
    }

    if (!crosswalk) {
      return NextResponse.json(
        { error: 'Crosswalk mapping not found' },
        { status: 404 }
      );
    }

    // Obter informações do framework e controle de origem
    let sourceFramework = null;
    let sourceControl = null;
    let targetFramework = null;
    let targetControl = null;

    if (crosswalk.source_framework_id) {
      const { data: frameworkData } = await supabase
        .from('frameworks')
        .select('id, framework_name, framework_code')
        .eq('id', crosswalk.source_framework_id)
        .single();
      sourceFramework = frameworkData;
    }

    if (crosswalk.source_control_id) {
      const { data: controlData } = await supabase
        .from('controls')
        .select('id, control_code, control_title, framework_id')
        .eq('id', crosswalk.source_control_id)
        .single();
      sourceControl = controlData;
    }

    if (crosswalk.target_framework_id) {
      const { data: frameworkData } = await supabase
        .from('frameworks')
        .select('id, framework_name, framework_code')
        .eq('id', crosswalk.target_framework_id)
        .single();
      targetFramework = frameworkData;
    }

    if (crosswalk.target_control_id) {
      const { data: controlData } = await supabase
        .from('controls')
        .select('id, control_code, control_title, framework_id')
        .eq('id', crosswalk.target_control_id)
        .single();
      targetControl = controlData;
    }

    // Combinar dados
    const result = {
      ...crosswalk,
      source_framework: sourceFramework,
      source_control: sourceControl,
      target_framework: targetFramework,
      target_control: targetControl,
    };

    return NextResponse.json({
      crosswalk: result,
    });
  } catch (error: any) {
    console.error('Error fetching crosswalk:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crosswalk', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/compliance/crosswalk/[id]
 * Atualiza um mapeamento de crosswalk
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await getServerSupabaseClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { mapping_type, confidence, evidence_event_ids, metadata } = body;

    // Verificar se o crosswalk existe
    const { data: existingCrosswalk, error: fetchError } = await supabase
      .from('control_crosswalk')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existingCrosswalk) {
      return NextResponse.json(
        { error: 'Crosswalk mapping not found' },
        { status: 404 }
      );
    }

    // Preparar dados de atualização
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (mapping_type !== undefined) {
      if (!['exact', 'partial', 'related'].includes(mapping_type)) {
        return NextResponse.json(
          { error: 'Invalid mapping_type. Must be: exact, partial, or related' },
          { status: 400 }
        );
      }
      updateData.mapping_type = mapping_type;
    }

    if (confidence !== undefined) {
      if (confidence < 0 || confidence > 1) {
        return NextResponse.json(
          { error: 'Confidence must be between 0 and 1' },
          { status: 400 }
        );
      }
      updateData.confidence = confidence;
    }

    if (evidence_event_ids !== undefined) {
      updateData.evidence_event_ids = evidence_event_ids;
    }

    if (metadata !== undefined) {
      updateData.metadata = metadata;
    }

    // Atualizar crosswalk
    const { data: updatedCrosswalk, error: updateError } = await supabase
      .from('control_crosswalk')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating crosswalk:', updateError);
      throw updateError;
    }

    return NextResponse.json({
      crosswalk: updatedCrosswalk,
      message: 'Crosswalk mapping updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating crosswalk:', error);
    return NextResponse.json(
      { error: 'Failed to update crosswalk mapping', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/compliance/crosswalk/[id]
 * Deleta um mapeamento de crosswalk
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await getServerSupabaseClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Verificar se o crosswalk existe
    const { data: existingCrosswalk, error: fetchError } = await supabase
      .from('control_crosswalk')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existingCrosswalk) {
      return NextResponse.json(
        { error: 'Crosswalk mapping not found' },
        { status: 404 }
      );
    }

    // Deletar crosswalk
    const { error: deleteError } = await supabase
      .from('control_crosswalk')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting crosswalk:', deleteError);
      throw deleteError;
    }

    return NextResponse.json({
      message: 'Crosswalk mapping deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting crosswalk:', error);
    return NextResponse.json(
      { error: 'Failed to delete crosswalk mapping', message: error.message },
      { status: 500 }
    );
  }
}

