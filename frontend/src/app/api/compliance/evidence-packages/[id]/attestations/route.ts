// Evidence Package Attestations API Route
// GET /api/compliance/evidence-packages/[id]/attestations
// POST /api/compliance/evidence-packages/[id]/attestations

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';

/**
 * GET /api/compliance/evidence-packages/[id]/attestations
 * Lista attestations vinculadas a um pacote de evidência
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

    const { id: packageId } = params;

    // Verificar se o pacote existe
    const { data: evidencePackage, error: packageError } = await supabase
      .from('evidence_packages')
      .select('id')
      .eq('id', packageId)
      .single();

    if (packageError || !evidencePackage) {
      return NextResponse.json(
        { error: 'Evidence package not found' },
        { status: 404 }
      );
    }

    // Obter attestations vinculadas
    const { data: packageAttestations, error } = await supabase
      .from('evidence_package_attestations')
      .select(`
        *,
        attestation:attestations(*)
      `)
      .eq('package_id', packageId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching package attestations:', error);
      throw error;
    }

    return NextResponse.json({
      attestations: packageAttestations || [],
      count: packageAttestations?.length || 0,
    });
  } catch (error: any) {
    console.error('Error fetching package attestations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch package attestations', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/compliance/evidence-packages/[id]/attestations
 * Vincula uma attestation a um pacote de evidência
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

    const { id: packageId } = params;
    const body = await request.json();
    const { attestation_id } = body;

    if (!attestation_id) {
      return NextResponse.json(
        { error: 'attestation_id is required' },
        { status: 400 }
      );
    }

    // Verificar se o pacote existe
    const { data: evidencePackage, error: packageError } = await supabase
      .from('evidence_packages')
      .select('id')
      .eq('id', packageId)
      .single();

    if (packageError || !evidencePackage) {
      return NextResponse.json(
        { error: 'Evidence package not found' },
        { status: 404 }
      );
    }

    // Verificar se a attestation existe
    const { data: attestation, error: attestationError } = await supabase
      .from('attestations')
      .select('id')
      .eq('id', attestation_id)
      .single();

    if (attestationError || !attestation) {
      return NextResponse.json(
        { error: 'Attestation not found' },
        { status: 404 }
      );
    }

    // Criar vinculação
    const { data: packageAttestation, error: linkError } = await supabase
      .from('evidence_package_attestations')
      .insert({
        package_id: packageId,
        attestation_id: attestation_id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (linkError) {
      console.error('Error linking attestation to package:', linkError);
      throw linkError;
    }

    return NextResponse.json({
      package_attestation: packageAttestation,
      message: 'Attestation linked to package successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error linking attestation to package:', error);
    return NextResponse.json(
      { error: 'Failed to link attestation to package', message: error.message },
      { status: 500 }
    );
  }
}

