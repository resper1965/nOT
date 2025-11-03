// Assets Statistics API Route
// GET /api/assets/stats

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // Get total assets count
    const { count: totalAssets, error: countError } = await supabase
      .from('security.assets')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    // Get all assets for aggregation
    const { data: assets, error: assetsError } = await supabase
      .from('security.assets')
      .select('asset_type, criticality');
    
    if (assetsError) throw assetsError;
    
    // Aggregate by type
    const byTypeMap = new Map<string, number>();
    assets?.forEach((asset) => {
      const type = asset.asset_type || 'Unknown';
      byTypeMap.set(type, (byTypeMap.get(type) || 0) + 1);
    });
    
    const by_type = Array.from(byTypeMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
    
    // Aggregate by criticality
    const byCriticalityMap = new Map<string, number>();
    assets?.forEach((asset) => {
      const criticality = asset.criticality || 'unknown';
      byCriticalityMap.set(criticality, (byCriticalityMap.get(criticality) || 0) + 1);
    });
    
    const by_criticality = Array.from(byCriticalityMap.entries())
      .map(([criticality, count]) => ({ criticality, count }));
    
    // Get VLAN and IP counts
    const { count: vlanCount } = await supabase
      .from('topology.vlans')
      .select('*', { count: 'exact', head: true });
    
    const { count: ipCount } = await supabase
      .from('topology.ip_addresses')
      .select('*', { count: 'exact', head: true });
    
    return NextResponse.json({
      total_assets: totalAssets || 0,
      by_type,
      by_criticality,
      total_vlans: vlanCount || 0,
      total_ips: ipCount || 0,
    });
  } catch (error: any) {
    console.error('Error fetching assets stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets stats', message: error.message },
      { status: 500 }
    );
  }
}

