// Evidence Package Workflow API Route
// POST /api/compliance/evidence-packages/[id]/workflow
// Ações: submit, review, approve, reject, lock

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';

/**
 * POST /api/compliance/evidence-packages/[id]/workflow
 * Executa ações do workflow: submit, review, approve, reject, lock
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

    const { id: packageId } = await context.params;
    const body = await request.json();
    const { action, rejection_reason, notes } = body;

    if (!action || !['submit', 'review', 'approve', 'reject', 'lock'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be: submit, review, approve, reject, or lock' },
        { status: 400 }
      );
    }

    // Verificar se o pacote existe
    const { data: evidencePackage, error: fetchError } = await supabase
      .from('evidence_packages')
      .select('*')
      .eq('id', packageId)
      .single();

    if (fetchError || !evidencePackage) {
      return NextResponse.json(
        { error: 'Evidence package not found' },
        { status: 404 }
      );
    }

    // Verificar se há artefatos antes de submeter
    if (action === 'submit') {
      const { count } = await supabase
        .from('evidence_artifacts')
        .select('*', { count: 'exact', head: true })
        .eq('package_id', packageId);

      if (!count || count === 0) {
        return NextResponse.json(
          { error: 'Cannot submit package without artifacts' },
          { status: 400 }
        );
      }
    }

    // Executar ação baseada no status atual
    let updateData: any = {
      updated_at: new Date().toISOString(),
    };

    switch (action) {
      case 'submit':
        if (evidencePackage.status !== 'draft') {
          return NextResponse.json(
            { error: 'Only draft packages can be submitted' },
            { status: 400 }
          );
        }
        updateData.status = 'submitted';
        updateData.submitted_at = new Date().toISOString();
        updateData.submitted_by = user.id;
        break;

      case 'review':
        if (evidencePackage.status !== 'submitted') {
          return NextResponse.json(
            { error: 'Only submitted packages can be reviewed' },
            { status: 400 }
          );
        }
        // Review não muda o status, apenas registra a revisão
        updateData.reviewed_at = new Date().toISOString();
        updateData.reviewed_by = user.id;
        updateData.status = 'reviewed';
        break;

      case 'approve':
        if (evidencePackage.status !== 'reviewed') {
          return NextResponse.json(
            { error: 'Only reviewed packages can be approved' },
            { status: 400 }
          );
        }
        updateData.status = 'approved';
        updateData.approved_at = new Date().toISOString();
        updateData.approved_by = user.id;
        updateData.rejection_reason = null;
        break;

      case 'reject':
        if (!['submitted', 'reviewed'].includes(evidencePackage.status)) {
          return NextResponse.json(
            { error: 'Only submitted or reviewed packages can be rejected' },
            { status: 400 }
          );
        }
        if (!rejection_reason || rejection_reason.trim().length === 0) {
          return NextResponse.json(
            { error: 'Rejection reason is required' },
            { status: 400 }
          );
        }
        updateData.status = 'draft';
        updateData.rejection_reason = rejection_reason.trim();
        updateData.reviewed_at = new Date().toISOString();
        updateData.reviewed_by = user.id;
        break;

      case 'lock':
        if (evidencePackage.status !== 'approved') {
          return NextResponse.json(
            { error: 'Only approved packages can be locked' },
            { status: 400 }
          );
        }
        updateData.status = 'locked';
        updateData.locked_at = new Date().toISOString();
        break;
    }

    // Adicionar notas ao metadata se fornecidas
    if (notes) {
      const currentMetadata = evidencePackage.metadata || {};
      updateData.metadata = {
        ...currentMetadata,
        workflow_notes: [
          ...(currentMetadata.workflow_notes || []),
          {
            action,
            notes,
            user_id: user.id,
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }

    // Atualizar pacote
    const { data: updatedPackage, error: updateError } = await supabase
      .from('evidence_packages')
      .update(updateData)
      .eq('id', packageId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating evidence package:', updateError);
      throw updateError;
    }

    return NextResponse.json({
      package: updatedPackage,
      message: `Package ${action}ed successfully`,
    });
  } catch (error: any) {
    console.error('Error executing workflow action:', error);
    return NextResponse.json(
      { error: 'Failed to execute workflow action', message: error.message },
      { status: 500 }
    );
  }
}

