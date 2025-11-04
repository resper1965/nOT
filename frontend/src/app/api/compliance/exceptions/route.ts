// Control Exceptions API Route
// GET /api/compliance/exceptions
// POST /api/compliance/exceptions

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';

/**
 * GET /api/compliance/exceptions
 * Lista todas as exceções de controles
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
    const controlId = searchParams.get('control_id');
    const frameworkId = searchParams.get('framework_id');
    const status = searchParams.get('status');

    // Construir query
    let query = supabase
      .from('control_exceptions')
      .select('*')
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (controlId) {
      query = query.eq('control_id', controlId);
    }
    if (frameworkId) {
      query = query.eq('framework_id', frameworkId);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data: exceptions, error } = await query;

    if (error) {
      console.error('Error fetching control exceptions:', error);
      throw error;
    }

    // Verificar exceções expiradas e atualizar status
    const now = new Date().toISOString();
    for (const exception of exceptions || []) {
      if (exception.status === 'approved' && exception.expires_at && new Date(exception.expires_at) < new Date(now)) {
        await supabase
          .from('control_exceptions')
          .update({ status: 'expired' })
          .eq('id', exception.id);
      }
    }

    // Recarregar exceções após atualizações
    const { data: updatedExceptions } = await query;

    // Obter estatísticas
    const { count: total } = await supabase
      .from('control_exceptions')
      .select('*', { count: 'exact', head: true });

    const { count: pending } = await supabase
      .from('control_exceptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: approved } = await supabase
      .from('control_exceptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    const { count: expired } = await supabase
      .from('control_exceptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'expired');

    return NextResponse.json({
      exceptions: updatedExceptions || [],
      statistics: {
        total: total || 0,
        pending: pending || 0,
        approved: approved || 0,
        expired: expired || 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching control exceptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch control exceptions', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/compliance/exceptions
 * Cria uma nova exceção de controle
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
      control_id,
      framework_id,
      exception_reason,
      justification,
      expires_at,
      risk_residual,
      metadata 
    } = body;

    // Validações
    if (!control_id || !framework_id) {
      return NextResponse.json(
        { error: 'control_id and framework_id are required' },
        { status: 400 }
      );
    }

    if (!exception_reason || exception_reason.trim().length === 0) {
      return NextResponse.json(
        { error: 'exception_reason is required' },
        { status: 400 }
      );
    }

    if (!justification || justification.trim().length === 0) {
      return NextResponse.json(
        { error: 'justification is required' },
        { status: 400 }
      );
    }

    if (risk_residual && !['low', 'medium', 'high', 'critical'].includes(risk_residual)) {
      return NextResponse.json(
        { error: 'Invalid risk_residual. Must be: low, medium, high, or critical' },
        { status: 400 }
      );
    }

    // Criar exceção
    const { data: exception, error: createError } = await supabase
      .from('control_exceptions')
      .insert({
        control_id: control_id,
        framework_id: framework_id,
        exception_reason: exception_reason.trim(),
        justification: justification.trim(),
        expires_at: expires_at || null,
        risk_residual: risk_residual || null,
        status: 'pending',
        metadata: metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating control exception:', createError);
      throw createError;
    }

    return NextResponse.json({
      exception: exception,
      message: 'Control exception created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating control exception:', error);
    return NextResponse.json(
      { error: 'Failed to create control exception', message: error.message },
      { status: 500 }
    );
  }
}

