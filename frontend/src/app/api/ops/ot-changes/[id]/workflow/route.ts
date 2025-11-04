// OT Change Workflow API Route
// POST /api/ops/ot-changes/[id]/workflow
// Ações: risk_assess, approve, schedule, execute, verify, reject, cancel

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';

/**
 * POST /api/ops/ot-changes/[id]/workflow
 * Executa ações do workflow: risk_assess, approve, schedule, execute, verify, reject, cancel
 */
export async function POST(
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

    const { id: changeId } = await context.params;
    const body = await request.json();
    const { 
      action, 
      risk_cyber_assessment,
      scheduled_window_start,
      scheduled_window_end,
      verification_notes,
      ons_checklist 
    } = body;

    if (!action || !['risk_assess', 'approve', 'schedule', 'execute', 'verify', 'reject', 'cancel'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be: risk_assess, approve, schedule, execute, verify, reject, or cancel' },
        { status: 400 }
      );
    }

    // Verificar se a mudança existe
    const { data: change, error: fetchError } = await supabase
      .from('ot_changes')
      .select('*')
      .eq('id', changeId)
      .single();

    if (fetchError || !change) {
      return NextResponse.json(
        { error: 'OT change not found' },
        { status: 404 }
      );
    }

    // Executar ação baseada no status atual
    let updateData: any = {
      updated_at: new Date().toISOString(),
    };

    switch (action) {
      case 'risk_assess':
        if (change.status !== 'requested') {
          return NextResponse.json(
            { error: 'Only requested changes can undergo risk assessment' },
            { status: 400 }
          );
        }
        if (!risk_cyber_assessment) {
          return NextResponse.json(
            { error: 'risk_cyber_assessment is required' },
            { status: 400 }
          );
        }
        updateData.status = 'risk_assessment';
        updateData.risk_cyber_assessment = risk_cyber_assessment;
        break;

      case 'approve':
        if (!['risk_assessment', 'requested'].includes(change.status)) {
          return NextResponse.json(
            { error: 'Only requested or risk_assessed changes can be approved' },
            { status: 400 }
          );
        }
        updateData.status = 'approved';
        updateData.risk_cyber_approved_by = user.id;
        updateData.risk_cyber_approved_at = new Date().toISOString();
        break;

      case 'schedule':
        if (change.status !== 'approved') {
          return NextResponse.json(
            { error: 'Only approved changes can be scheduled' },
            { status: 400 }
          );
        }
        if (!scheduled_window_start || !scheduled_window_end) {
          return NextResponse.json(
            { error: 'scheduled_window_start and scheduled_window_end are required' },
            { status: 400 }
          );
        }
        updateData.status = 'scheduled';
        updateData.scheduled_window_start = scheduled_window_start;
        updateData.scheduled_window_end = scheduled_window_end;
        if (ons_checklist) {
          updateData.ons_checklist = ons_checklist;
        }
        break;

      case 'execute':
        if (change.status !== 'scheduled') {
          return NextResponse.json(
            { error: 'Only scheduled changes can be executed' },
            { status: 400 }
          );
        }
        updateData.status = 'in_progress';
        updateData.executed_at = new Date().toISOString();
        break;

      case 'verify':
        if (change.status !== 'in_progress') {
          return NextResponse.json(
            { error: 'Only in_progress changes can be verified' },
            { status: 400 }
          );
        }
        updateData.status = 'completed';
        updateData.verified_at = new Date().toISOString();
        updateData.verified_by = user.id;
        if (verification_notes) {
          updateData.verification_notes = verification_notes;
        }
        break;

      case 'reject':
        if (!['requested', 'risk_assessment'].includes(change.status)) {
          return NextResponse.json(
            { error: 'Only requested or risk_assessed changes can be rejected' },
            { status: 400 }
          );
        }
        updateData.status = 'rejected';
        break;

      case 'cancel':
        if (['completed', 'rejected'].includes(change.status)) {
          return NextResponse.json(
            { error: 'Completed or rejected changes cannot be cancelled' },
            { status: 400 }
          );
        }
        updateData.status = 'cancelled';
        break;
    }

    // Atualizar mudança
    const { data: updatedChange, error: updateError } = await supabase
      .from('ot_changes')
      .update(updateData)
      .eq('id', changeId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating OT change:', updateError);
      throw updateError;
    }

    return NextResponse.json({
      change: updatedChange,
      message: `Change ${action}ed successfully`,
    });
  } catch (error: any) {
    console.error('Error executing workflow action:', error);
    return NextResponse.json(
      { error: 'Failed to execute workflow action', message: error.message },
      { status: 500 }
    );
  }
}

