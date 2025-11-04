// KPIs Dashboard API Route
// GET /api/kpis/dashboard
// Retorna todos os KPIs do dashboard

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';

/**
 * GET /api/kpis/dashboard
 * Retorna resumo geral de todos os KPIs
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Buscar resumo geral
    const { data: summary, error: summaryError } = await supabase
      .from('v_kpi_dashboard_summary')
      .select('*')
      .single();

    if (summaryError) {
      console.error('Error fetching KPI summary:', summaryError);
    }

    // Buscar conformidade por framework
    const { data: frameworkCompliance, error: frameworkError } = await supabase
      .from('v_kpi_framework_compliance')
      .select('*')
      .order('compliance_percentage', { ascending: false });

    if (frameworkError) {
      console.error('Error fetching framework compliance:', frameworkError);
    }

    // Buscar validade de evidências
    const { data: evidenceValidity, error: evidenceError } = await supabase
      .from('v_kpi_evidence_validity')
      .select('*')
      .single();

    if (evidenceError) {
      console.error('Error fetching evidence validity:', evidenceError);
    }

    // Buscar baseline de ativos críticos
    const { data: baseline, error: baselineError } = await supabase
      .from('v_kpi_critical_assets_baseline')
      .select('*')
      .single();

    if (baselineError) {
      console.error('Error fetching baseline:', baselineError);
    }

    // Buscar análise cyber de mudanças OT
    const { data: cyberAnalysis, error: cyberError } = await supabase
      .from('v_kpi_ot_changes_cyber')
      .select('*')
      .single();

    if (cyberError) {
      console.error('Error fetching cyber analysis:', cyberError);
    }

    // Buscar status de exceções
    const { data: exceptions, error: exceptionsError } = await supabase
      .from('v_kpi_exceptions_status')
      .select('*')
      .single();

    if (exceptionsError) {
      console.error('Error fetching exceptions:', exceptionsError);
    }

    // Buscar MTTD/MTTR
    const { data: mttr, error: mttrError } = await supabase
      .from('v_kpi_ot_mttd_mttr')
      .select('*')
      .single();

    if (mttrError) {
      console.error('Error fetching MTTR:', mttrError);
    }

    return NextResponse.json({
      summary: summary || {},
      framework_compliance: frameworkCompliance || [],
      evidence_validity: evidenceValidity || {},
      baseline_coverage: baseline || {},
      cyber_analysis: cyberAnalysis || {},
      exceptions: exceptions || {},
      mttr: mttr || {},
    });
  } catch (error: any) {
    console.error('Error fetching KPIs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch KPIs', message: error.message },
      { status: 500 }
    );
  }
}

