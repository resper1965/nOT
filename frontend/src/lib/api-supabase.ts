// Supabase-based API client for ness. OT GRC
// Alternative to FastAPI backend using Supabase PostgREST and Edge Functions

import { getSupabaseClient } from './supabase';

/**
 * Get assets statistics using Supabase
 */
export async function getAssetsStatsFromSupabase() {
  const supabase = getSupabaseClient();
  
  // Example: Using Supabase to query assets table
  // Adjust table names and queries based on your database schema
  const { data, error } = await supabase
    .from('security.assets')
    .select('count', { count: 'exact', head: true });
  
  if (error) throw new Error(`Failed to fetch assets stats: ${error.message}`);
  
  // You may need to aggregate multiple queries for full stats
  return {
    total: data || 0,
    // Add more stats as needed
  };
}

/**
 * Get VLANs using Supabase
 */
export async function getVLANsFromSupabase() {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('topology.vlans')
    .select('*')
    .order('vlan_id', { ascending: true });
  
  if (error) throw new Error(`Failed to fetch VLANs: ${error.message}`);
  
  return data || [];
}

/**
 * Get compliance documents using Supabase
 */
export async function getComplianceDocumentsFromSupabase() {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('compliance.documents')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw new Error(`Failed to fetch compliance documents: ${error.message}`);
  
  return data || [];
}

/**
 * Get ONS controls status using Supabase
 */
export async function getOnsControlsFromSupabase() {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('compliance.ons_controls')
    .select('*')
    .order('control_id', { ascending: true });
  
  if (error) throw new Error(`Failed to fetch ONS controls: ${error.message}`);
  
  return data || [];
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

