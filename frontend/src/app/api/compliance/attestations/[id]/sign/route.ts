// Attestation Sign API Route
// POST /api/compliance/attestations/[id]/sign
// Assina uma attestation

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';
import crypto from 'crypto';

/**
 * POST /api/compliance/attestations/[id]/sign
 * Assina uma attestation
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

    const { id } = params;

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
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error signing attestation:', updateError);
      throw updateError;
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

