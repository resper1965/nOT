// API Route for Remediation Plan
// Computes remediation plan based on gaps and risks
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createServerClient();

    // Compute gaps inline (reuse gaps logic)
    const { count: subnetCount } = await supabase
      .from('ip_subnets')
      .select('*', { count: 'exact', head: true });

    const { count: subnetMappedCount } = await supabase
      .from('ip_subnets')
      .select('*', { count: 'exact', head: true })
      .not('purdue_level', 'is', null);

    const { count: vlanCount } = await supabase
      .from('vlans')
      .select('*', { count: 'exact', head: true });

    const { count: vlanClassifiedCount } = await supabase
      .from('vlans')
      .select('*', { count: 'exact', head: true })
      .not('purdue_level', 'is', null);

    const { count: connectionCount } = await supabase
      .from('network_connections')
      .select('*', { count: 'exact', head: true });

    const { count: firewallCount } = await supabase
      .from('assets')
      .select('*', { count: 'exact', head: true })
      .ilike('asset_type', '%firewall%');

    // Build gaps array
    const gaps: any[] = [];
    
    const unmapedSubnets = (subnetCount || 0) - (subnetMappedCount || 0);
    if (subnetMappedCount === 0 && subnetCount && subnetCount > 0) {
      gaps.push({
        id: 'GAP-SEG-001',
        name: 'Modelo Purdue não implementado',
        effort_hours: 300,
        status: 'critical',
      });
    }
    if (unmapedSubnets > 0) {
      gaps.push({
        id: 'GAP-SEG-002',
        name: 'Subnets não mapeados para níveis Purdue',
        effort_hours: 80,
        status: 'high',
      });
    }
    const unclassifiedVlans = (vlanCount || 0) - (vlanClassifiedCount || 0);
    if (unclassifiedVlans > 0) {
      gaps.push({
        id: 'GAP-SEG-003',
        name: 'VLANs não classificadas por zona',
        effort_hours: 40,
        status: 'high',
      });
    }
    if (connectionCount && connectionCount > 0) {
      gaps.push({
        id: 'GAP-SEG-004',
        name: 'Conexões não analisadas (cross-zone)',
        effort_hours: 60,
        status: 'high',
      });
    }
    if (firewallCount && firewallCount < 6) {
      gaps.push({
        id: 'GAP-SEG-005',
        name: 'Firewalls insuficientes para segmentação Purdue',
        effort_hours: 40,
        status: 'critical',
      });
    }
    gaps.push({
      id: 'GAP-SEG-006',
      name: 'Documentação de segmentação ausente',
      effort_hours: 40,
      status: 'medium',
    });

    // Organize plan by phases
    const phases = [
      {
        id: 'phase-1',
        name: 'Fase 1: Assessment',
        duration_days: 30,
        duration_text: 'Dias 1-30',
        status: 'pending',
        effort_hours: 0,
        tasks: [] as any[],
      },
      {
        id: 'phase-2',
        name: 'Fase 2: Design',
        duration_days: 30,
        duration_text: 'Dias 30-60',
        status: 'blocked',
        effort_hours: 0,
        tasks: [] as any[],
      },
      {
        id: 'phase-3',
        name: 'Fase 3: Implementação',
        duration_days: 30,
        duration_text: 'Dias 60-90',
        status: 'blocked',
        effort_hours: 0,
        tasks: [] as any[],
      },
    ];

    // Phase 1: Assessment tasks
    gaps.forEach((gap: any) => {
      if (gap.id === 'GAP-SEG-002' || gap.id === 'GAP-SEG-003' || gap.id === 'GAP-SEG-004') {
        phases[0].tasks.push({
          gap_id: gap.id,
          name: gap.name,
          effort_hours: gap.effort_hours,
          description: gap.description,
          details: gap.details,
        });
        phases[0].effort_hours += gap.effort_hours || 0;
      }
    });

    // Phase 2: Design tasks
    gaps.forEach((gap: any) => {
      if (gap.id === 'GAP-SEG-001' || gap.id === 'GAP-SEG-006') {
        phases[1].tasks.push({
          gap_id: gap.id,
          name: gap.name,
          effort_hours: gap.effort_hours,
          description: gap.description,
          details: gap.details,
        });
        phases[1].effort_hours += gap.effort_hours || 0;
      }
    });

    // Phase 3: Implementation tasks
    gaps.forEach((gap: any) => {
      if (gap.id === 'GAP-SEG-005') {
        phases[2].tasks.push({
          gap_id: gap.id,
          name: gap.name,
          effort_hours: gap.effort_hours,
          description: gap.description,
          details: gap.details,
        });
        phases[2].effort_hours += gap.effort_hours || 0;
      }
    });

    // Overall metrics
    const totalEffort = phases.reduce((sum, phase) => sum + phase.effort_hours, 0);
    const totalWeeks = Math.ceil(totalEffort / 40); // 40h/week

    // Timeline items
    const timeline = [
      { week: 'Semanas 1-2', task: 'Mapping de subnets e VLANs', status: 'pending' },
      { week: 'Semanas 3-4', task: 'Análise de conexões e firewalls', status: 'pending' },
      { week: 'Semanas 5-6', task: 'Design do Modelo Purdue TO-BE', status: 'pending' },
      { week: 'Semanas 7-8', task: 'Especificação e documentação', status: 'pending' },
      { week: 'Semanas 9-10', task: 'Aquisição e instalação de firewalls', status: 'pending' },
      { week: 'Semanas 11-12', task: 'Implementação de segmentação', status: 'pending' },
      { week: 'Semana 13', task: 'Validação e testes', status: 'pending' },
    ];

    // Progress metrics
    const metrics = [
      {
        name: 'Subnets mapeados Purdue',
        current: subnetMappedCount || 0,
        target: subnetCount || 0,
        unit: 'subnets',
      },
      {
        name: 'VLANs classificadas',
        current: vlanClassifiedCount || 0,
        target: vlanCount || 0,
        unit: 'VLANs',
      },
      {
        name: 'Conexões analisadas',
        current: 0, // Would require cross-zone analysis
        target: connectionCount || 0,
        unit: 'conexões',
      },
      {
        name: 'Firewalls implementados',
        current: firewallCount || 0,
        target: 15, // Minimum for proper segmentation
        unit: 'firewalls',
      },
      {
        name: 'Documentos aprovados',
        current: 0,
        target: 6,
        unit: 'docs',
      },
      {
        name: 'Conformidade Controle 5',
        current: 0,
        target: 100,
        unit: '%',
      },
    ];

    return NextResponse.json({
      phases,
      timeline,
      metrics,
      summary: {
        total_phases: phases.length,
        total_effort_hours: totalEffort,
        total_effort_weeks: totalWeeks,
        total_effort_person_weeks: totalWeeks,
        estimated_investment_min: totalEffort * 450, // R$450/h
        estimated_investment_max: totalEffort * 650, // R$650/h
        estimated_duration_days: 90,
        total_gaps: gaps.length,
        critical_gaps: gaps.filter((g: any) => g.status === 'critical').length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching remediation plan:', error);
    return NextResponse.json(
      {
        phases: [],
        timeline: [],
        metrics: [],
        summary: {
          total_phases: 0,
          total_effort_hours: 0,
          total_effort_weeks: 0,
          total_effort_person_weeks: 0,
          estimated_investment_min: 0,
          estimated_investment_max: 0,
          estimated_duration_days: 0,
          total_gaps: 0,
          critical_gaps: 0,
        },
        error: error.message,
      },
      { status: 500 }
    );
  }
}

