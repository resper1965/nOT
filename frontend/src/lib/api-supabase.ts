// Supabase-based API client for ness. OT GRC
// Real queries using Supabase PostgREST API
// Based on database schema: security.*, topology.*, compliance.*, audit.*
// Uses SERVICE_ROLE_KEY for server-side operations (bypasses RLS when needed)

import { getSupabaseClient, supabaseHelpers } from './supabase';
import { getAdminSupabaseClient } from './supabase-admin';

/**
 * Get assets statistics using Supabase
 * Returns aggregated stats from security.assets table
 */
export async function getAssetsStatsFromSupabase() {
  // Use admin client for server-side operations (bypasses RLS)
  // For client-side, use regular client (respects RLS)
  const supabase = typeof window === 'undefined' 
    ? getAdminSupabaseClient() 
    : getSupabaseClient();
  
  try {
    // Get total count
    const { count: totalAssets, error: countError } = await supabase
      .from('security.assets')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    // Get assets by type
    const { data: byTypeData, error: byTypeError } = await supabase
      .from('security.assets')
      .select('asset_type')
      .not('asset_type', 'is', null);
    
    if (byTypeError) throw byTypeError;
    
    // Aggregate by type
    const byTypeMap = new Map<string, number>();
    byTypeData?.forEach((asset) => {
      const type = asset.asset_type || 'Unknown';
      byTypeMap.set(type, (byTypeMap.get(type) || 0) + 1);
    });
    
    const by_type = Array.from(byTypeMap.entries()).map(([type, count]) => ({
      type,
      count,
    }));
    
    // Get assets by criticality
    const { data: byCriticalityData, error: byCriticalityError } = await supabase
      .from('security.assets')
      .select('criticality')
      .not('criticality', 'is', null);
    
    if (byCriticalityError) throw byCriticalityError;
    
    const byCriticalityMap = new Map<string, number>();
    byCriticalityData?.forEach((asset) => {
      const criticality = asset.criticality || 'unknown';
      byCriticalityMap.set(criticality, (byCriticalityMap.get(criticality) || 0) + 1);
    });
    
    const by_criticality = Array.from(byCriticalityMap.entries()).map(([criticality, count]) => ({
      criticality,
      count,
    }));
    
    // Get VLAN and IP counts for complete stats
    const { count: vlanCount } = await supabase
      .from('topology.vlans')
      .select('*', { count: 'exact', head: true });
    
    const { count: ipCount } = await supabase
      .from('topology.ip_addresses')
      .select('*', { count: 'exact', head: true });
    
    return {
      total_assets: totalAssets || 0,
      by_type: by_type.sort((a, b) => b.count - a.count),
      by_criticality: by_criticality,
      total_vlans: vlanCount || 0,
      total_ips: ipCount || 0,
    };
  } catch (error: any) {
    supabaseHelpers.handleError(error, 'getAssetsStats');
    return {
      total_assets: 0,
      by_type: [],
      by_criticality: [],
      total_vlans: 0,
      total_ips: 0,
    };
  }
}

/**
 * Get VLANs using Supabase
 * Returns VLANs from topology.vlans table
 */
export async function getVLANsFromSupabase() {
  const supabase = typeof window === 'undefined' 
    ? getAdminSupabaseClient() 
    : getSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('topology.vlans')
      .select('*')
      .order('vlan_id', { ascending: true });
    
    if (error) throw error;
    
    return {
      vlans: data || [],
      total: data?.length || 0,
    };
  } catch (error: any) {
    supabaseHelpers.handleError(error, 'getVLANs');
    return { vlans: [], total: 0 };
  }
}

/**
 * Get network topology summary using Supabase
 */
export async function getNetworkTopologyFromSupabase() {
  const supabase = typeof window === 'undefined' 
    ? getAdminSupabaseClient() 
    : getSupabaseClient();
  
  try {
    // Get VLAN count
    const { count: vlanCount } = await supabase
      .from('topology.vlans')
      .select('*', { count: 'exact', head: true });
    
    // Get IP addresses count
    const { count: ipCount } = await supabase
      .from('topology.ip_addresses')
      .select('*', { count: 'exact', head: true });
    
    // Get assets by type for devices summary
    const { data: assets } = await supabase
      .from('security.assets')
      .select('asset_type');
    
    const devicesMap = new Map<string, number>();
    assets?.forEach((asset) => {
      const type = asset.asset_type?.toLowerCase() || 'unknown';
      if (type.includes('router')) devicesMap.set('router', (devicesMap.get('router') || 0) + 1);
      if (type.includes('switch')) devicesMap.set('switch', (devicesMap.get('switch') || 0) + 1);
      if (type.includes('server')) devicesMap.set('server', (devicesMap.get('server') || 0) + 1);
      if (type.includes('firewall')) devicesMap.set('firewall', (devicesMap.get('firewall') || 0) + 1);
    });
    
    return {
      vlans: vlanCount || 0,
      ips: ipCount || 0,
      devices: {
        router: devicesMap.get('router') || 0,
        switch: devicesMap.get('switch') || 0,
        server: devicesMap.get('server') || 0,
        firewall: devicesMap.get('firewall') || 0,
      },
    };
  } catch (error: any) {
    supabaseHelpers.handleError(error, 'getNetworkTopology');
    return {
      vlans: 0,
      ips: 0,
      devices: { router: 0, switch: 0, server: 0, firewall: 0 },
    };
  }
}

/**
 * Get compliance documents using Supabase
 * Returns documents with stats for compatibility with existing components
 */
export async function getComplianceDocumentsFromSupabase() {
  const supabase = typeof window === 'undefined' 
    ? getAdminSupabaseClient() 
    : getSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('compliance.documents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const documents = data || [];
    const total = documents.length;
    
    // Calculate stats for compatibility
    const stats = {
      total,
      missing: documents.filter((d: any) => d.status === 'missing' || !d.status).length,
      approved: documents.filter((d: any) => d.status === 'approved').length,
      draft: documents.filter((d: any) => d.status === 'draft').length,
      review: documents.filter((d: any) => d.status === 'review' || d.status === 'pending').length,
      completion_rate: total > 0 ? Math.round((approved / total) * 100) : 0,
    };
    
    // Count by framework
    const frameworks = {
      aneel: documents.filter((d: any) => d.framework === 'aneel' || d.requirement_type === 'aneel').length,
      ons: documents.filter((d: any) => d.framework === 'ons' || d.requirement_type === 'ons').length,
      iec: documents.filter((d: any) => d.framework === 'iec' || d.requirement_type === 'iec').length,
    };
    
    return {
      documents,
      stats,
      frameworks,
    };
  } catch (error: any) {
    supabaseHelpers.handleError(error, 'getComplianceDocuments');
    return {
      documents: [],
      stats: { total: 0, missing: 0, approved: 0, draft: 0, review: 0, completion_rate: 0 },
      frameworks: { aneel: 0, ons: 0, iec: 0 },
    };
  }
}

/**
 * Get ONS controls status using Supabase
 * Returns controls in format compatible with existing components
 */
export async function getOnsControlsFromSupabase() {
  const supabase = typeof window === 'undefined' 
    ? getAdminSupabaseClient() 
    : getSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('compliance.ons_controls')
      .select('*')
      .order('control_id', { ascending: true });
    
    if (error) throw error;
    
    const controls = data || [];
    
    // Calculate stats for compatibility
    const stats = {
      total: controls.length,
      implemented: controls.filter((c: any) => c.status === 'implemented' || c.status === 'compliant').length,
      pending: controls.filter((c: any) => c.status === 'pending' || c.status === 'not_implemented').length,
      compliant: controls.filter((c: any) => c.status === 'compliant').length,
      non_compliant: controls.filter((c: any) => c.status === 'non_compliant').length,
    };
    
    return {
      controls,
      stats,
      total: controls.length,
    };
  } catch (error: any) {
    supabaseHelpers.handleError(error, 'getOnsControls');
    return {
      controls: [],
      stats: { total: 0, implemented: 0, pending: 0, compliant: 0, non_compliant: 0 },
      total: 0,
    };
  }
}

/**
 * Get assets list with pagination
 */
export async function getAssetsListFromSupabase(limit = 100, offset = 0) {
  const supabase = typeof window === 'undefined' 
    ? getAdminSupabaseClient() 
    : getSupabaseClient();
  
  try {
    const { data, error, count } = await supabase
      .from('security.assets')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return {
      assets: data || [],
      total: count || 0,
      limit,
      offset,
    };
  } catch (error: any) {
    supabaseHelpers.handleError(error, 'getAssetsList');
    return { assets: [], total: 0, limit, offset };
  }
}

/**
 * Call Supabase Edge Function for complex operations
 */
export async function callSupabaseEdgeFunction(
  functionName: string,
  body?: Record<string, any>
) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.functions.invoke(functionName, {
    body: body || {},
  });
  
  if (error) throw new Error(`Edge function error: ${error.message}`);
  
  return data;
}

