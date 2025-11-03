// API Route for Gap Analysis ONS
// Computes gaps by comparing ONS requirements with actual network data
import { NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const supabase = getAdminSupabaseClient();

    // Get ONS controls (Controle 5: Segmentação)
    const { data: onsControls, error: controlsError } = await supabase
      .from('compliance.controls')
      .select('*, frameworks:framework_id(framework_name)')
      .ilike('control_code', '%ONS%')
      .or('control_code.ilike.%SEGMENTAÇÃO%,control_code.ilike.%PURDUE%');

    if (controlsError) throw controlsError;

    // Get network data
    const { count: subnetCount } = await supabase
      .from('topology.ip_subnets')
      .select('*', { count: 'exact', head: true });

    const { count: subnetMappedCount } = await supabase
      .from('topology.ip_subnets')
      .select('*', { count: 'exact', head: true })
      .not('purdue_level', 'is', null);

    const { count: vlanCount } = await supabase
      .from('topology.vlans')
      .select('*', { count: 'exact', head: true });

    const { count: vlanClassifiedCount } = await supabase
      .from('topology.vlans')
      .select('*', { count: 'exact', head: true })
      .not('purdue_level', 'is', null);

    const { count: connectionCount } = await supabase
      .from('topology.connections')
      .select('*', { count: 'exact', head: true });

    const { count: firewallCount } = await supabase
      .from('security.assets')
      .select('*', { count: 'exact', head: true })
      .ilike('asset_type', '%firewall%');

    const { count: assetCount } = await supabase
      .from('security.assets')
      .select('*', { count: 'exact', head: true });

    // Compute gaps based on actual data
    const gaps = [];

    // GAP 1: Modelo Purdue não implementado
    if (subnetMappedCount === 0 && subnetCount && subnetCount > 0) {
      gaps.push({
        id: 'GAP-SEG-001',
        name: 'Modelo Purdue não implementado',
        status: 'critical',
        cvss: 9.1,
        effort_hours: 300,
        details: `0/${subnetCount} subnets mapeados para níveis Purdue`,
        current_value: 0,
        target_value: subnetCount || 0,
        unit: 'subnets',
        description: 'Nenhum subnet foi mapeado para os níveis do Modelo Purdue (0-5).',
      });
    }

    // GAP 2: Subnets não mapeados
    const unmapedSubnets = (subnetCount || 0) - (subnetMappedCount || 0);
    if (unmapedSubnets > 0) {
      gaps.push({
        id: 'GAP-SEG-002',
        name: 'Subnets não mapeados para níveis Purdue',
        status: 'high',
        cvss: 8.5,
        effort_hours: 80,
        details: `${unmapedSubnets}/${subnetCount} subnets (${Math.round((unmapedSubnets / (subnetCount || 1)) * 100)}%) não mapeados`,
        current_value: unmapedSubnets,
        target_value: subnetCount || 0,
        unit: 'subnets',
        description: 'Subnets identificados mas não classificados por nível Purdue.',
      });
    }

    // GAP 3: VLANs não classificadas
    const unclassifiedVlans = (vlanCount || 0) - (vlanClassifiedCount || 0);
    if (unclassifiedVlans > 0) {
      gaps.push({
        id: 'GAP-SEG-003',
        name: 'VLANs não classificadas por zona',
        status: 'high',
        cvss: 7.8,
        effort_hours: 40,
        details: `${unclassifiedVlans}/${vlanCount} VLANs (${Math.round((unclassifiedVlans / (vlanCount || 1)) * 100)}%) não classificadas`,
        current_value: unclassifiedVlans,
        target_value: vlanCount || 0,
        unit: 'VLANs',
        description: 'VLANs identificadas mas não classificadas por zona ou nível Purdue.',
      });
    }

    // GAP 4: Conexões não analisadas (cross-zone)
    // This would require more complex analysis - simplified for now
    if (connectionCount && connectionCount > 0) {
      gaps.push({
        id: 'GAP-SEG-004',
        name: 'Conexões não analisadas (cross-zone)',
        status: 'high',
        cvss: 8.2,
        effort_hours: 60,
        details: `${connectionCount} conexões identificadas, análise cross-zone pendente`,
        current_value: 0,
        target_value: connectionCount || 0,
        unit: 'conexões',
        description: 'Conexões entre assets identificadas mas análise de segmentação pendente.',
      });
    }

    // GAP 5: Firewalls insuficientes (assuming minimum 6 for Purdue model)
    const minFirewallsRequired = 6;
    if (firewallCount && firewallCount < minFirewallsRequired) {
      gaps.push({
        id: 'GAP-SEG-005',
        name: 'Firewalls insuficientes para segmentação Purdue',
        status: 'critical',
        cvss: 9.0,
        effort_hours: 40,
        details: `${firewallCount} existentes vs ${minFirewallsRequired} necessários`,
        current_value: firewallCount || 0,
        target_value: minFirewallsRequired,
        unit: 'firewalls',
        description: 'Quantidade insuficiente de firewalls para implementar segmentação adequada.',
      });
    }

    // Compute aggregate metrics
    const totalGaps = gaps.length;
    const criticalGaps = gaps.filter((g) => g.status === 'critical').length;
    const highGaps = gaps.filter((g) => g.status === 'high').length;
    const avgCvss = gaps.length > 0 
      ? gaps.reduce((sum, g) => sum + g.cvss, 0) / gaps.length 
      : 0;
    const totalEffort = gaps.reduce((sum, g) => sum + g.effort_hours, 0);

    // Overall stats
    const stats = {
      total_gaps: totalGaps,
      critical_gaps: criticalGaps,
      high_gaps: highGaps,
      medium_gaps: gaps.filter((g) => g.status === 'medium').length,
      low_gaps: gaps.filter((g) => g.status === 'low').length,
      avg_cvss: Math.round(avgCvss * 10) / 10,
      total_effort_hours: totalEffort,
      total_effort_weeks: Math.ceil(totalEffort / 40), // Assuming 40h/week
      risk_level: avgCvss >= 9 ? 'critical' : avgCvss >= 7 ? 'high' : avgCvss >= 5 ? 'medium' : 'low',
    };

    return NextResponse.json({
      gaps,
      stats,
      network_data: {
        total_assets: assetCount || 0,
        total_subnets: subnetCount || 0,
        mapped_subnets: subnetMappedCount || 0,
        total_vlans: vlanCount || 0,
        classified_vlans: vlanClassifiedCount || 0,
        total_connections: connectionCount || 0,
        total_firewalls: firewallCount || 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching gap analysis:', error);
    return NextResponse.json(
      {
        gaps: [],
        stats: {
          total_gaps: 0,
          critical_gaps: 0,
          high_gaps: 0,
          medium_gaps: 0,
          low_gaps: 0,
          avg_cvss: 0,
          total_effort_hours: 0,
          total_effort_weeks: 0,
          risk_level: 'low',
        },
        network_data: {
          total_assets: 0,
          total_subnets: 0,
          mapped_subnets: 0,
          total_vlans: 0,
          classified_vlans: 0,
          total_connections: 0,
          total_firewalls: 0,
        },
        error: error.message,
      },
      { status: 500 }
    );
  }
}

