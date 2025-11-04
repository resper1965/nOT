// ONS Report API Route
// GET /api/compliance/reports/ons
// Gera relatório ONS RO-CB.BR.01

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';

/**
 * GET /api/compliance/reports/ons
 * Gera relatório ONS RO-CB.BR.01
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
    const format = searchParams.get('format') || 'json'; // json, pdf, csv
    const installationId = searchParams.get('installation_id');

    // Buscar framework ONS
    const { data: onsFramework, error: frameworkError } = await supabase
      .from('frameworks')
      .select('id, framework_name, framework_code')
      .eq('framework_code', 'ONS')
      .single();

    if (frameworkError || !onsFramework) {
      return NextResponse.json(
        { error: 'ONS framework not found' },
        { status: 404 }
      );
    }

    // Buscar controles ONS
    const { data: controls, error: controlsError } = await supabase
      .from('controls')
      .select('*')
      .eq('framework_id', onsFramework.id)
      .order('control_code', { ascending: true });

    if (controlsError) {
      console.error('Error fetching ONS controls:', controlsError);
      throw controlsError;
    }

    // Buscar avaliações ONS
    const { data: assessments, error: assessmentsError } = await supabase
      .from('assessments')
      .select('*')
      .eq('framework_id', onsFramework.id)
      .order('assessment_date', { ascending: false })
      .limit(1)
      .single();

    // Buscar resultados de controles
    let controlResults: any[] = [];
    if (assessments) {
      const { data: results, error: resultsError } = await supabase
        .from('control_results')
        .select('*')
        .eq('assessment_id', assessments.id);

      if (!resultsError) {
        controlResults = results || [];
      }
    }

    // Buscar pacotes de evidência
    const controlIds = (controls || []).map(c => c.id);
    const { data: evidencePackages } = await supabase
      .from('evidence_packages')
      .select('*')
      .in('control_id', controlIds);

    // Buscar exceções
    const { data: exceptions } = await supabase
      .from('control_exceptions')
      .select('*')
      .eq('framework_id', onsFramework.id);

    // Montar relatório
    const report = {
      framework: onsFramework,
      installation_id: installationId || null,
      generated_at: new Date().toISOString(),
      generated_by: user.id,
      summary: {
        total_controls: controls?.length || 0,
        total_assessments: assessments ? 1 : 0,
        total_evidence_packages: evidencePackages?.length || 0,
        total_exceptions: exceptions?.length || 0,
      },
      controls: (controls || []).map(control => {
        const result = controlResults.find(r => r.control_id === control.id);
        const evidence = evidencePackages?.filter(ep => ep.control_id === control.id) || [];
        const exception = exceptions?.find(e => e.control_id === control.id);

        return {
          ...control,
          assessment_result: result || null,
          evidence_count: evidence.length,
          has_exception: !!exception,
          exception: exception || null,
        };
      }),
      assessment: assessments || null,
      exceptions: exceptions || [],
    };

    // Retornar no formato solicitado
    if (format === 'csv') {
      // TODO: Converter para CSV
      return NextResponse.json({ error: 'CSV export not yet implemented' }, { status: 501 });
    }

    if (format === 'pdf') {
      // TODO: Gerar PDF
      return NextResponse.json({ error: 'PDF export not yet implemented' }, { status: 501 });
    }

    // JSON (padrão)
    return NextResponse.json({
      report,
      format: 'json',
    });
  } catch (error: any) {
    console.error('Error generating ONS report:', error);
    return NextResponse.json(
      { error: 'Failed to generate ONS report', message: error.message },
      { status: 500 }
    );
  }
}

