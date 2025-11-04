// OT Change Detail API Route
// GET /api/ops/ot-changes/[id]
// PUT /api/ops/ot-changes/[id]
// DELETE /api/ops/ot-changes/[id]

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';

/**
 * GET /api/ops/ot-changes/[id]
 * Obtém detalhes de uma mudança OT
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await getServerSupabaseClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Obter mudança com informações do asset
    const { data: change, error } = await supabase
      .from('ot_changes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching OT change:', error);
      throw error;
    }

    if (!change) {
      return NextResponse.json(
        { error: 'OT change not found' },
        { status: 404 }
      );
    }

    // Obter informações do asset
    let asset = null;
    if (change.asset_id) {
      const { data: assetData } = await supabase
        .from('assets')
        .select('id, asset_name, asset_type, ip_address')
        .eq('id', change.asset_id)
        .single();
      asset = assetData;
    }

    // Combinar dados
    const result = {
      ...change,
      asset,
    };

    return NextResponse.json({
      change: result,
    });
  } catch (error: any) {
    console.error('Error fetching OT change:', error);
    return NextResponse.json(
      { error: 'Failed to fetch OT change', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/ops/ot-changes/[id]
 * Atualiza uma mudança OT
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await getServerSupabaseClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { 
      change_title,
      description,
      asset_id,
      change_type,
      priority,
      status,
      scheduled_window_start,
      scheduled_window_end,
      risk_cyber_assessment,
      ons_checklist,
      metadata 
    } = body;

    // Verificar se a mudança existe
    const { data: existingChange, error: fetchError } = await supabase
      .from('ot_changes')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError || !existingChange) {
      return NextResponse.json(
        { error: 'OT change not found' },
        { status: 404 }
      );
    }

    // Preparar dados de atualização
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (change_title !== undefined) {
      updateData.change_title = change_title.trim();
    }
    if (description !== undefined) {
      updateData.description = description || null;
    }
    if (asset_id !== undefined) {
      updateData.asset_id = asset_id || null;
    }
    if (change_type !== undefined) {
      updateData.change_type = change_type || null;
    }
    if (priority !== undefined) {
      updateData.priority = priority;
    }
    if (status !== undefined) {
      updateData.status = status;
    }
    if (scheduled_window_start !== undefined) {
      updateData.scheduled_window_start = scheduled_window_start || null;
    }
    if (scheduled_window_end !== undefined) {
      updateData.scheduled_window_end = scheduled_window_end || null;
    }
    if (risk_cyber_assessment !== undefined) {
      updateData.risk_cyber_assessment = risk_cyber_assessment;
    }
    if (ons_checklist !== undefined) {
      updateData.ons_checklist = ons_checklist;
    }
    if (metadata !== undefined) {
      updateData.metadata = metadata;
    }

    // Atualizar mudança
    const { data: updatedChange, error: updateError } = await supabase
      .from('ot_changes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating OT change:', updateError);
      throw updateError;
    }

    return NextResponse.json({
      change: updatedChange,
      message: 'OT change updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating OT change:', error);
    return NextResponse.json(
      { error: 'Failed to update OT change', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ops/ot-changes/[id]
 * Deleta uma mudança OT (apenas se estiver em requested ou cancelled)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await getServerSupabaseClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Verificar se a mudança existe e pode ser deletada
    const { data: existingChange, error: fetchError } = await supabase
      .from('ot_changes')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError || !existingChange) {
      return NextResponse.json(
        { error: 'OT change not found' },
        { status: 404 }
      );
    }

    // Só permite deletar se estiver em requested ou cancelled
    if (!['requested', 'cancelled'].includes(existingChange.status)) {
      return NextResponse.json(
        { error: 'Only requested or cancelled changes can be deleted' },
        { status: 400 }
      );
    }

    // Deletar mudança
    const { error: deleteError } = await supabase
      .from('ot_changes')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting OT change:', deleteError);
      throw deleteError;
    }

    return NextResponse.json({
      message: 'OT change deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting OT change:', error);
    return NextResponse.json(
      { error: 'Failed to delete OT change', message: error.message },
      { status: 500 }
    );
  }
}

