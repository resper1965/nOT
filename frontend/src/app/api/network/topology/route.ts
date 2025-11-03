// Network Topology API Route
// GET /api/network/topology

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // Get assets count by type
    const { data: assetsByType } = await supabase
      .from('assets')
      .select('asset_type');
    
    const devices: Record<string, number> = {};
    assetsByType?.forEach((asset) => {
      const type = asset.asset_type || 'Unknown';
      devices[type] = (devices[type] || 0) + 1;
    });
    
    // Get VLAN count
    const { count: vlanCount } = await supabase
      .from('vlans')
      .select('*', { count: 'exact', head: true });
    
    // Get IP count
    const { count: ipCount } = await supabase
      .from('ip_addresses')
      .select('*', { count: 'exact', head: true });
    
    // Get subnet count
    const { count: subnetCount } = await supabase
      .from('ip_subnets')
      .select('*', { count: 'exact', head: true });
    
    // Get connections count
    const { count: connectionsCount } = await supabase
      .from('network_connections')
      .select('*', { count: 'exact', head: true });
    
    return NextResponse.json({
      devices,
      vlans: vlanCount || 0,
      ips: ipCount || 0,
      subnets: subnetCount || 0,
      connections: connectionsCount || 0,
    });
  } catch (error: any) {
    console.error('Error fetching network topology:', error);
    return NextResponse.json(
      { error: 'Failed to fetch network topology', message: error.message },
      { status: 500 }
    );
  }
}

