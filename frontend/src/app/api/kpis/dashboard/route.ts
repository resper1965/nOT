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

    // Buscar KPIs usando queries SQL diretas
    // As views estão em schemas diferentes (compliance, security, ops)
    // Usamos uma abordagem que retorna dados padrão caso as views não estejam disponíveis
    
    let summary: any = {};
    let frameworkCompliance: any[] = [];
    let evidenceValidity: any = {};
    let baseline: any = {};
    let cyberAnalysis: any = {};
    let exceptions: any = {};
    let mttr: any = {};

    // Tentar buscar dados das views (pode falhar se não estiverem expostas via PostgREST)
    try {
      const { data: summaryData } = await supabase
        .from('v_kpi_dashboard_summary')
        .select('*')
        .single();
      summary = summaryData || {};
    } catch (e) {
      console.warn('v_kpi_dashboard_summary not accessible via PostgREST');
    }

    try {
      const { data: frameworkData } = await supabase
        .from('v_kpi_framework_compliance')
        .select('*')
        .order('compliance_percentage', { ascending: false });
      frameworkCompliance = frameworkData || [];
    } catch (e) {
      console.warn('v_kpi_framework_compliance not accessible via PostgREST');
    }

    try {
      const { data: evidenceData } = await supabase
        .from('v_kpi_evidence_validity')
        .select('*')
        .single();
      evidenceValidity = evidenceData || {};
    } catch (e) {
      console.warn('v_kpi_evidence_validity not accessible via PostgREST');
    }

    try {
      const { data: baselineData } = await supabase
        .from('v_kpi_critical_assets_baseline')
        .select('*')
        .single();
      baseline = baselineData || {};
    } catch (e) {
      console.warn('v_kpi_critical_assets_baseline not accessible via PostgREST');
    }

    try {
      const { data: cyberData } = await supabase
        .from('v_kpi_ot_changes_cyber')
        .select('*')
        .single();
      cyberAnalysis = cyberData || {};
    } catch (e) {
      console.warn('v_kpi_ot_changes_cyber not accessible via PostgREST');
    }

    try {
      const { data: exceptionsData } = await supabase
        .from('v_kpi_exceptions_status')
        .select('*')
        .single();
      exceptions = exceptionsData || {};
    } catch (e) {
      console.warn('v_kpi_exceptions_status not accessible via PostgREST');
    }

    try {
      const { data: mttrData } = await supabase
        .from('v_kpi_ot_mttd_mttr')
        .select('*')
        .single();
      mttr = mttrData || {};
    } catch (e) {
      console.warn('v_kpi_ot_mttd_mttr not accessible via PostgREST');
    }

    return NextResponse.json({
      summary: summary,
      framework_compliance: frameworkCompliance,
      evidence_validity: evidenceValidity,
      baseline_coverage: baseline,
      cyber_analysis: cyberAnalysis,
      exceptions: exceptions,
      mttr: mttr,
    });
  } catch (error: any) {
    console.error('Error fetching KPIs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch KPIs', message: error.message },
      { status: 500 }
    );
  }
}

