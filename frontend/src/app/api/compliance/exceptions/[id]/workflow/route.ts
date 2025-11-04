// Control Exception Workflow API Route
// POST /api/compliance/exceptions/[id]/workflow
// Ações: approve, reject

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';

/**
 * POST /api/compliance/exceptions/[id]/workflow
 * Executa ações do workflow: approve, reject
 */
export async function POST(
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

    const { id: exceptionId } = params;
    const body = await request.json();
    const { action, rejection_reason } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be: approve or reject' },
        { status: 400 }
      );
    }

    // Verificar se a exceção existe
    const { data: exception, error: fetchError } = await supabase
      .from('control_exceptions')
      .select('*')
      .eq('id', exceptionId)
      .single();

    if (fetchError || !exception) {
      return NextResponse.json(
        { error: 'Control exception not found' },
        { status: 404 }
      );
    }

    // Verificar se está pendente
    if (exception.status !== 'pending') {
      return NextResponse.json(
        { error: 'Only pending exceptions can be processed' },
        { status: 400 }
      );
    }

    // Executar ação baseada no status atual
    let updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (action === 'approve') {
      updateData.status = 'approved';
      updateData.approved_at = new Date().toISOString();
      updateData.approved_by = user.id;
      updateData.rejection_reason = null;
    } else if (action === 'reject') {
      if (!rejection_reason || rejection_reason.trim().length === 0) {
        return NextResponse.json(
          { error: 'Rejection reason is required' },
          { status: 400 }
        );
      }
      updateData.status = 'rejected';
      updateData.rejection_reason = rejection_reason.trim();
    }

    // Atualizar exceção
    const { data: updatedException, error: updateError } = await supabase
      .from('control_exceptions')
      .update(updateData)
      .eq('id', exceptionId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating control exception:', updateError);
      throw updateError;
    }

    return NextResponse.json({
      exception: updatedException,
      message: `Exception ${action}ed successfully`,
    });
  } catch (error: any) {
    console.error('Error executing workflow action:', error);
    return NextResponse.json(
      { error: 'Failed to execute workflow action', message: error.message },
      { status: 500 }
    );
  }
}

