// ANEEL Report API Route
// GET /api/compliance/reports/aneel
// Gera relatório ANEEL RN 964/2021

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';
import { generateCSV, generatePDFHTML } from '@/lib/report-export';

/**
 * GET /api/compliance/reports/aneel
 * Gera relatório ANEEL RN 964/2021
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

    // Buscar framework ANEEL
    const { data: frameworks, error: frameworkError } = await supabase
      .from('frameworks')
      .select('id, framework_name, metadata')
      .order('created_at', { ascending: false });
    
    // Filtrar framework ANEEL por nome ou metadata
    const aneelFramework = frameworks?.find(f => 
      f.framework_name?.toLowerCase().includes('aneel') || 
      f.metadata?.code === 'ANEEL' ||
      f.metadata?.framework_code === 'ANEEL'
    );

    if (frameworkError || !aneelFramework) {
      return NextResponse.json(
        { error: 'ANEEL framework not found' },
        { status: 404 }
      );
    }

    // Buscar controles ANEEL
    const { data: controls, error: controlsError } = await supabase
      .from('controls')
      .select('*')
      .eq('framework_id', aneelFramework.id)
      .order('control_code', { ascending: true });

    if (controlsError) {
      console.error('Error fetching ANEEL controls:', controlsError);
      throw controlsError;
    }

    // Buscar avaliações ANEEL
    const { data: assessments, error: assessmentsError } = await supabase
      .from('assessments')
      .select('*')
      .eq('framework_id', aneelFramework.id)
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
      .eq('framework_id', aneelFramework.id);

    // Montar relatório
    const report = {
      framework: aneelFramework,
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
      const csv = generateCSV(report);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="aneel-report-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    if (format === 'pdf') {
      const html = generatePDFHTML(report, 'ANEEL RN 964/2021');
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // JSON (padrão)
    return NextResponse.json({
      report,
      format: 'json',
    });
  } catch (error: any) {
    console.error('Error generating ANEEL report:', error);
    return NextResponse.json(
      { error: 'Failed to generate ANEEL report', message: error.message },
      { status: 500 }
    );
  }
}

