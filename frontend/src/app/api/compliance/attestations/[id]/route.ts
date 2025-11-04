// Attestation Detail API Route
// GET /api/compliance/attestations/[id]
// PUT /api/compliance/attestations/[id] (para assinar)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';
import crypto from 'crypto';

/**
 * GET /api/compliance/attestations/[id]
 * Obtém detalhes de uma attestation
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

    // Obter attestation
    const { data: attestation, error } = await supabase
      .from('attestations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching attestation:', error);
      throw error;
    }

    if (!attestation) {
      return NextResponse.json(
        { error: 'Attestation not found' },
        { status: 404 }
      );
    }

    // Obter informações do escopo
    let scopeInfo = null;

    if (attestation.scope === 'control') {
      const { data: controlData } = await supabase
        .from('controls')
        .select('id, control_code, control_title, framework_id')
        .eq('id', attestation.scope_id)
        .single();
      scopeInfo = controlData;
    } else if (attestation.scope === 'assessment') {
      const { data: assessmentData } = await supabase
        .from('assessments')
        .select('id, assessment_date, status, framework_id')
        .eq('id', attestation.scope_id)
        .single();
      scopeInfo = assessmentData;
    }

    // Obter informações do owner
    const { data: ownerData } = await supabase.auth.admin.getUserById(attestation.owner_id).catch(() => ({ data: { user: null } }));

    // Combinar dados
    const result = {
      ...attestation,
      scope_info: scopeInfo,
      owner: ownerData?.user ? {
        id: ownerData.user.id,
        email: ownerData.user.email,
        name: ownerData.user.user_metadata?.name || ownerData.user.email,
      } : null,
    };

    return NextResponse.json({
      attestation: result,
    });
  } catch (error: any) {
    console.error('Error fetching attestation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attestation', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/compliance/attestations/[id]
 * Assina uma attestation
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
    const { action } = body;

    // Verificar se a attestation existe
    const { data: attestation, error: fetchError } = await supabase
      .from('attestations')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !attestation) {
      return NextResponse.json(
        { error: 'Attestation not found' },
        { status: 404 }
      );
    }

    // Verificar se o usuário é o owner
    if (attestation.owner_id !== user.id) {
      return NextResponse.json(
        { error: 'Only the owner can sign this attestation' },
        { status: 403 }
      );
    }

    // Verificar se já está assinada
    if (attestation.signed_at) {
      return NextResponse.json(
        { error: 'Attestation already signed' },
        { status: 400 }
      );
    }

    if (action !== 'sign') {
      return NextResponse.json(
        { error: 'Invalid action. Use action: "sign"' },
        { status: 400 }
      );
    }

    // Obter IP e User-Agent da requisição
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const clientUserAgent = request.headers.get('user-agent') || 'unknown';

    // Gerar hash da assinatura
    // Hash baseado em: owner_id + scope + scope_id + statement + timestamp
    const signatureData = `${user.id}${attestation.scope}${attestation.scope_id}${attestation.statement}${Date.now()}`;
    const signatureHash = crypto.createHash('sha256')
      .update(signatureData)
      .digest('hex');

    // Atualizar attestation com assinatura
    const { data: updatedAttestation, error: updateError } = await supabase
      .from('attestations')
      .update({
        signed_at: new Date().toISOString(),
        signature_hash: signatureHash,
        ip_address: clientIp,
        user_agent: clientUserAgent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error signing attestation:', updateError);
      throw updateError;
    }

    // Chamar função do banco para criar histórico (se existir)
    // A função compliance.create_attestation já cria o histórico automaticamente
    // Mas vamos garantir que o histórico seja criado
    try {
      await supabase.rpc('create_attestation', {
        p_owner_id: user.id,
        p_scope: attestation.scope,
        p_scope_id: attestation.scope_id,
        p_statement: attestation.statement,
      });
    } catch (rpcError) {
      // Se a função não existir ou falhar, não é crítico
      console.warn('RPC create_attestation failed:', rpcError);
    }

    return NextResponse.json({
      attestation: updatedAttestation,
      message: 'Attestation signed successfully',
    });
  } catch (error: any) {
    console.error('Error signing attestation:', error);
    return NextResponse.json(
      { error: 'Failed to sign attestation', message: error.message },
      { status: 500 }
    );
  }
}

