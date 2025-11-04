// Evidence Package Detail API Route
// GET /api/compliance/evidence-packages/[id]
// PUT /api/compliance/evidence-packages/[id]
// DELETE /api/compliance/evidence-packages/[id]

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';

/**
 * GET /api/compliance/evidence-packages/[id]
 * Obtém detalhes de um pacote de evidência
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

    // Obter pacote
    const { data: evidencePackage, error } = await supabase
      .from('evidence_packages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching evidence package:', error);
      throw error;
    }

    if (!evidencePackage) {
      return NextResponse.json(
        { error: 'Evidence package not found' },
        { status: 404 }
      );
    }

    // Obter artefatos separadamente
    const { data: artifacts, error: artifactsError } = await supabase
      .from('evidence_artifacts')
      .select('*')
      .eq('package_id', id)
      .order('uploaded_at', { ascending: false });

    // Obter informações do controle e avaliação se disponíveis
    let control = null;
    let assessment = null;

    if (evidencePackage.control_id) {
      const { data: controlData } = await supabase
        .from('controls')
        .select('id, control_code, control_title, framework_id')
        .eq('id', evidencePackage.control_id)
        .single();
      control = controlData;
    }

    if (evidencePackage.assessment_id) {
      const { data: assessmentData } = await supabase
        .from('assessments')
        .select('id, assessment_date, status, framework_id')
        .eq('id', evidencePackage.assessment_id)
        .single();
      assessment = assessmentData;
    }

    // Combinar dados
    const result = {
      ...evidencePackage,
      control,
      assessment,
      artifacts: artifacts || [],
    };

    return NextResponse.json({
      package: result,
    });
  } catch (error: any) {
    console.error('Error fetching evidence package:', error);
    return NextResponse.json(
      { error: 'Failed to fetch evidence package', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/compliance/evidence-packages/[id]
 * Atualiza um pacote de evidência
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
    const { package_name, description, metadata } = body;

    // Verificar se o pacote existe e está em draft
    const { data: existingPackage, error: fetchError } = await supabase
      .from('evidence_packages')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError || !existingPackage) {
      return NextResponse.json(
        { error: 'Evidence package not found' },
        { status: 404 }
      );
    }

    // Só permite atualizar se estiver em draft
    if (existingPackage.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft packages can be updated' },
        { status: 400 }
      );
    }

    // Preparar dados de atualização
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (package_name !== undefined) {
      updateData.package_name = package_name.trim();
    }
    if (description !== undefined) {
      updateData.description = description || null;
    }
    if (metadata !== undefined) {
      updateData.metadata = metadata;
    }

    // Atualizar pacote
    const { data: updatedPackage, error: updateError } = await supabase
      .from('evidence_packages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating evidence package:', updateError);
      throw updateError;
    }

    return NextResponse.json({
      package: updatedPackage,
      message: 'Evidence package updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating evidence package:', error);
    return NextResponse.json(
      { error: 'Failed to update evidence package', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/compliance/evidence-packages/[id]
 * Deleta um pacote de evidência (apenas se estiver em draft)
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

    // Verificar se o pacote existe e está em draft
    const { data: existingPackage, error: fetchError } = await supabase
      .from('evidence_packages')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError || !existingPackage) {
      return NextResponse.json(
        { error: 'Evidence package not found' },
        { status: 404 }
      );
    }

    // Só permite deletar se estiver em draft
    if (existingPackage.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft packages can be deleted' },
        { status: 400 }
      );
    }

    // Deletar pacote (cascade deleta artifacts)
    const { error: deleteError } = await supabase
      .from('evidence_packages')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting evidence package:', deleteError);
      throw deleteError;
    }

    return NextResponse.json({
      message: 'Evidence package deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting evidence package:', error);
    return NextResponse.json(
      { error: 'Failed to delete evidence package', message: error.message },
      { status: 500 }
    );
  }
}

