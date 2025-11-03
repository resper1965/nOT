// API Route for Risk Matrix
// Computes risk matrix based on vulnerabilities, assets, and network topology
import { NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const supabase = getAdminSupabaseClient();

    // Get vulnerabilities by severity
    const { data: vulnerabilities, error: vulnError } = await supabase
      .from('vulnerabilities')
      .select('severity, cvss_score, status, asset_id')
      .eq('status', 'open');

    if (vulnError) throw vulnError;

    // Get assets by criticality
    const { data: assets, error: assetsError } = await supabase
      .from('assets')
      .select('criticality, asset_type, status')
      .eq('status', 'active');

    if (assetsError) throw assetsError;

    // Compute risk matrix (5x5: Impact x Likelihood)
    // Impact levels: Critical, High, Medium, Low, Very Low
    // Likelihood levels: Very High, High, Medium, Low, Very Low
    
    const riskMatrix: Record<string, number> = {
      'critical-very_high': 0,
      'critical-high': 0,
      'critical-medium': 0,
      'critical-low': 0,
      'critical-very_low': 0,
      'high-very_high': 0,
      'high-high': 0,
      'high-medium': 0,
      'high-low': 0,
      'high-very_low': 0,
      'medium-very_high': 0,
      'medium-high': 0,
      'medium-medium': 0,
      'medium-low': 0,
      'medium-very_low': 0,
      'low-very_high': 0,
      'low-high': 0,
      'low-medium': 0,
      'low-low': 0,
      'low-very_low': 0,
      'very_low-very_high': 0,
      'very_low-high': 0,
      'very_low-medium': 0,
      'very_low-low': 0,
      'very_low-very_low': 0,
    };

    // Map vulnerabilities to risk matrix
    // CVSS 9.0-10.0 = Critical, 7.0-8.9 = High, 4.0-6.9 = Medium, 0.1-3.9 = Low
    const mapCvssToImpact = (cvss: number | null): string => {
      if (!cvss) return 'low';
      if (cvss >= 9.0) return 'critical';
      if (cvss >= 7.0) return 'high';
      if (cvss >= 4.0) return 'medium';
      return 'low';
    };

    // Simplified likelihood mapping (could be enhanced with asset exposure data)
    const mapToLikelihood = (severity: string, cvss: number | null): string => {
      if (severity === 'critical' || (cvss && cvss >= 9.0)) return 'very_high';
      if (severity === 'high' || (cvss && cvss >= 7.0)) return 'high';
      if (severity === 'medium' || (cvss && cvss >= 4.0)) return 'medium';
      return 'low';
    };

    vulnerabilities?.forEach((vuln) => {
      const impact = mapCvssToImpact(vuln.cvss_score);
      const likelihood = mapToLikelihood(vuln.severity || 'medium', vuln.cvss_score);
      const key = `${impact}-${likelihood}`;
      if (riskMatrix[key] !== undefined) {
        riskMatrix[key]++;
      }
    });

    // Calculate risk levels (Critical, High, Medium, Low)
    const criticalRisks = 
      riskMatrix['critical-very_high'] +
      riskMatrix['critical-high'] +
      riskMatrix['high-very_high'];
    
    const highRisks = 
      riskMatrix['critical-medium'] +
      riskMatrix['high-high'] +
      riskMatrix['high-medium'] +
      riskMatrix['medium-very_high'];
    
    const mediumRisks = 
      riskMatrix['critical-low'] +
      riskMatrix['high-low'] +
      riskMatrix['medium-high'] +
      riskMatrix['medium-medium'] +
      riskMatrix['low-very_high'];
    
    const lowRisks = Object.values(riskMatrix).reduce((sum, val) => sum + val, 0) - 
      criticalRisks - highRisks - mediumRisks;

    // Asset criticality distribution
    const assetCriticality = {
      critical: assets?.filter((a) => a.criticality === 'critical').length || 0,
      high: assets?.filter((a) => a.criticality === 'high').length || 0,
      medium: assets?.filter((a) => a.criticality === 'medium').length || 0,
      low: assets?.filter((a) => a.criticality === 'low').length || 0,
      unknown: assets?.filter((a) => !a.criticality).length || 0,
    };

    // Vulnerability distribution
    const vulnDistribution = {
      critical: vulnerabilities?.filter((v) => v.severity === 'critical').length || 0,
      high: vulnerabilities?.filter((v) => v.severity === 'high').length || 0,
      medium: vulnerabilities?.filter((v) => v.severity === 'medium').length || 0,
      low: vulnerabilities?.filter((v) => v.severity === 'low').length || 0,
    };

    // Top risks (by CVSS score)
    const topRisks = vulnerabilities
      ?.filter((v) => v.cvss_score)
      .sort((a, b) => (b.cvss_score || 0) - (a.cvss_score || 0))
      .slice(0, 10)
      .map((v) => ({
        id: v.asset_id,
        severity: v.severity,
        cvss_score: v.cvss_score,
      })) || [];

    return NextResponse.json({
      risk_matrix: riskMatrix,
      risk_levels: {
        critical: criticalRisks,
        high: highRisks,
        medium: mediumRisks,
        low: lowRisks,
      },
      asset_criticality: assetCriticality,
      vulnerability_distribution: vulnDistribution,
      top_risks: topRisks,
      total_vulnerabilities: vulnerabilities?.length || 0,
      total_assets: assets?.length || 0,
    });
  } catch (error: any) {
    console.error('Error fetching risk matrix:', error);
    return NextResponse.json(
      {
        risk_matrix: {},
        risk_levels: { critical: 0, high: 0, medium: 0, low: 0 },
        asset_criticality: { critical: 0, high: 0, medium: 0, low: 0, unknown: 0 },
        vulnerability_distribution: { critical: 0, high: 0, medium: 0, low: 0 },
        top_risks: [],
        total_vulnerabilities: 0,
        total_assets: 0,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

