// Evidence Packages API Route
// GET /api/compliance/evidence-packages
// POST /api/compliance/evidence-packages

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';
import crypto from 'crypto';

/**
 * GET /api/compliance/evidence-packages
 * Lista todos os pacotes de evidência
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
    const assessmentId = searchParams.get('assessment_id');
    const status = searchParams.get('status');

    // Construir query
    // Nota: Usando view pública ou tabela diretamente
    // Supabase PostgREST pode acessar views públicas automaticamente
    let query = supabase
      .from('evidence_packages')
      .select(`
        *,
        control:controls!evidence_packages_control_id_fkey(id, control_code, control_title),
        assessment:assessments!evidence_packages_assessment_id_fkey(id, assessment_date, status)
      `)
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (controlId) {
      query = query.eq('control_id', controlId);
    }
    if (assessmentId) {
      query = query.eq('assessment_id', assessmentId);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data: packages, error } = await query;

    if (error) {
      console.error('Error fetching evidence packages:', error);
      throw error;
    }

    // Obter estatísticas
    const { count: total } = await supabase
      .from('evidence_packages')
      .select('*', { count: 'exact', head: true });

    const { count: draft } = await supabase
      .from('evidence_packages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft');

    const { count: submitted } = await supabase
      .from('evidence_packages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'submitted');

    const { count: approved } = await supabase
      .from('evidence_packages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    return NextResponse.json({
      packages: packages || [],
      statistics: {
        total: total || 0,
        draft: draft || 0,
        submitted: submitted || 0,
        approved: approved || 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching evidence packages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch evidence packages', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/compliance/evidence-packages
 * Cria um novo pacote de evidência
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
    const { package_name, description, control_id, assessment_id, metadata } = body;

    // Validações
    if (!package_name || package_name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Package name is required' },
        { status: 400 }
      );
    }

    if (!control_id && !assessment_id) {
      return NextResponse.json(
        { error: 'Either control_id or assessment_id is required' },
        { status: 400 }
      );
    }

    // Gerar hash inicial (será recalculado quando artefatos forem adicionados)
    const initialHash = crypto.createHash('sha256')
      .update(`${package_name}${Date.now()}`)
      .digest('hex');

    // Criar pacote de evidência
    const { data: evidencePackage, error: createError } = await supabase
      .from('evidence_packages')
      .insert({
        package_name: package_name.trim(),
        description: description || null,
        control_id: control_id || null,
        assessment_id: assessment_id || null,
        hash: initialHash,
        status: 'draft',
        metadata: metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating evidence package:', createError);
      throw createError;
    }

    return NextResponse.json({
      package: evidencePackage,
      message: 'Evidence package created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating evidence package:', error);
    return NextResponse.json(
      { error: 'Failed to create evidence package', message: error.message },
      { status: 500 }
    );
  }
}

