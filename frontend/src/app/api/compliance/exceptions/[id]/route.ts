// Control Exception Detail API Route
// GET /api/compliance/exceptions/[id]
// PUT /api/compliance/exceptions/[id]
// DELETE /api/compliance/exceptions/[id]

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';

/**
 * GET /api/compliance/exceptions/[id]
 * Obtém detalhes de uma exceção de controle
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

    // Obter exceção com informações do controle e framework
    const { data: exception, error } = await supabase
      .from('control_exceptions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching control exception:', error);
      throw error;
    }

    if (!exception) {
      return NextResponse.json(
        { error: 'Control exception not found' },
        { status: 404 }
      );
    }

    // Obter informações do controle
    let control = null;
    if (exception.control_id) {
      const { data: controlData } = await supabase
        .from('controls')
        .select('id, control_code, control_title, framework_id')
        .eq('id', exception.control_id)
        .single();
      control = controlData;
    }

    // Obter informações do framework
    let framework = null;
    if (exception.framework_id) {
      const { data: frameworkData } = await supabase
        .from('frameworks')
        .select('id, framework_name, framework_code')
        .eq('id', exception.framework_id)
        .single();
      framework = frameworkData;
    }

    // Combinar dados
    const result = {
      ...exception,
      control,
      framework,
    };

    return NextResponse.json({
      exception: result,
    });
  } catch (error: any) {
    console.error('Error fetching control exception:', error);
    return NextResponse.json(
      { error: 'Failed to fetch control exception', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/compliance/exceptions/[id]
 * Atualiza uma exceção de controle
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
    const { exception_reason, justification, expires_at, risk_residual, metadata } = body;

    // Verificar se a exceção existe e está pendente
    const { data: existingException, error: fetchError } = await supabase
      .from('control_exceptions')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError || !existingException) {
      return NextResponse.json(
        { error: 'Control exception not found' },
        { status: 404 }
      );
    }

    // Só permite atualizar se estiver pendente
    if (existingException.status !== 'pending') {
      return NextResponse.json(
        { error: 'Only pending exceptions can be updated' },
        { status: 400 }
      );
    }

    // Preparar dados de atualização
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (exception_reason !== undefined) {
      updateData.exception_reason = exception_reason.trim();
    }
    if (justification !== undefined) {
      updateData.justification = justification.trim();
    }
    if (expires_at !== undefined) {
      updateData.expires_at = expires_at || null;
    }
    if (risk_residual !== undefined) {
      if (risk_residual && !['low', 'medium', 'high', 'critical'].includes(risk_residual)) {
        return NextResponse.json(
          { error: 'Invalid risk_residual. Must be: low, medium, high, or critical' },
          { status: 400 }
        );
      }
      updateData.risk_residual = risk_residual || null;
    }
    if (metadata !== undefined) {
      updateData.metadata = metadata;
    }

    // Atualizar exceção
    const { data: updatedException, error: updateError } = await supabase
      .from('control_exceptions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating control exception:', updateError);
      throw updateError;
    }

    return NextResponse.json({
      exception: updatedException,
      message: 'Control exception updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating control exception:', error);
    return NextResponse.json(
      { error: 'Failed to update control exception', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/compliance/exceptions/[id]
 * Deleta uma exceção de controle (apenas se estiver pendente)
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

    // Verificar se a exceção existe e está pendente
    const { data: existingException, error: fetchError } = await supabase
      .from('control_exceptions')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError || !existingException) {
      return NextResponse.json(
        { error: 'Control exception not found' },
        { status: 404 }
      );
    }

    // Só permite deletar se estiver pendente
    if (existingException.status !== 'pending') {
      return NextResponse.json(
        { error: 'Only pending exceptions can be deleted' },
        { status: 400 }
      );
    }

    // Deletar exceção
    const { error: deleteError } = await supabase
      .from('control_exceptions')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting control exception:', deleteError);
      throw deleteError;
    }

    return NextResponse.json({
      message: 'Control exception deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting control exception:', error);
    return NextResponse.json(
      { error: 'Failed to delete control exception', message: error.message },
      { status: 500 }
    );
  }
}

