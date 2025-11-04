// Attestations API Route
// GET /api/compliance/attestations
// POST /api/compliance/attestations

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';
import crypto from 'crypto';

/**
 * GET /api/compliance/attestations
 * Lista todas as attestations
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
    const scope = searchParams.get('scope');
    const scopeId = searchParams.get('scope_id');
    const ownerId = searchParams.get('owner_id');

    // Construir query
    let query = supabase
      .from('attestations')
      .select('*')
      .order('signed_at', { ascending: false });

    // Aplicar filtros
    if (scope) {
      query = query.eq('scope', scope);
    }
    if (scopeId) {
      query = query.eq('scope_id', scopeId);
    }
    if (ownerId) {
      query = query.eq('owner_id', ownerId);
    }

    const { data: attestations, error } = await query;

    if (error) {
      console.error('Error fetching attestations:', error);
      throw error;
    }

    // Obter estatísticas
    const { count: total } = await supabase
      .from('attestations')
      .select('*', { count: 'exact', head: true });

    const { count: signed } = await supabase
      .from('attestations')
      .select('*', { count: 'exact', head: true })
      .not('signed_at', 'is', null);

    return NextResponse.json({
      attestations: attestations || [],
      statistics: {
        total: total || 0,
        signed: signed || 0,
        pending: (total || 0) - (signed || 0),
      },
    });
  } catch (error: any) {
    console.error('Error fetching attestations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attestations', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/compliance/attestations
 * Cria uma nova attestation
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
    const { scope, scope_id, statement, ip_address, user_agent, metadata } = body;

    // Validações
    if (!scope || !['control', 'assessment', 'installation', 'framework'].includes(scope)) {
      return NextResponse.json(
        { error: 'Invalid scope. Must be: control, assessment, installation, or framework' },
        { status: 400 }
      );
    }

    if (!scope_id) {
      return NextResponse.json(
        { error: 'scope_id is required' },
        { status: 400 }
      );
    }

    if (!statement || statement.trim().length === 0) {
      return NextResponse.json(
        { error: 'Statement is required' },
        { status: 400 }
      );
    }

    // Obter IP e User-Agent da requisição
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     ip_address || 
                     'unknown';
    const clientUserAgent = request.headers.get('user-agent') || user_agent || 'unknown';

    // Criar attestation (sem assinatura ainda)
    const { data: attestation, error: createError } = await supabase
      .from('attestations')
      .insert({
        owner_id: user.id,
        scope: scope,
        scope_id: scope_id,
        statement: statement.trim(),
        signed_at: null, // Será preenchido quando assinar
        signature_hash: null, // Será preenchido quando assinar
        ip_address: clientIp,
        user_agent: clientUserAgent,
        metadata: metadata || {},
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating attestation:', createError);
      throw createError;
    }

    return NextResponse.json({
      attestation: attestation,
      message: 'Attestation created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating attestation:', error);
    return NextResponse.json(
      { error: 'Failed to create attestation', message: error.message },
      { status: 500 }
    );
  }
}

