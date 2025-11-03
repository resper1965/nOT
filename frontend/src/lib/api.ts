// API client for ness. OT GRC backend
// Supports both Supabase (primary) and FastAPI backend (fallback)
// Priority: Use Supabase when available, fallback to FastAPI

// Import Supabase functions
import {
  getAssetsStatsFromSupabase,
  getVLANsFromSupabase,
  getComplianceDocumentsFromSupabase,
  getOnsControlsFromSupabase,
  getNetworkTopologyFromSupabase,
  getAssetsListFromSupabase,
} from './api-supabase';

// Get API URL from environment variables (for FastAPI fallback)
const getApiUrl = (): string => {
  // Use environment variable if available
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (apiUrl) {
    return apiUrl;
  }
  
  // Fallback: Use different URL for server-side vs client-side (Docker/local)
  if (typeof window === 'undefined') {
    // Server-side (dentro do Docker)
    return 'http://backend:8000';
  }
  // Client-side (browser)
  return 'http://localhost:8001';
};

const API_BASE_URL = getApiUrl();

// Configuration: Use Supabase by default
const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE !== 'false';

export async function getAssetsStats() {
  // Use Supabase if configured, otherwise fallback to FastAPI
  if (USE_SUPABASE) {
    try {
      return await getAssetsStatsFromSupabase();
    } catch (error) {
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV === 'development') {
        console.warn('Supabase query failed, falling back to FastAPI:', error);
      }
    }
  }
  
  // Fallback to FastAPI
  const res = await fetch(`${API_BASE_URL}/api/assets/stats`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch assets stats');
  return res.json();
}

export async function getTopDevices() {
  const res = await fetch(`${API_BASE_URL}/api/assets/top-devices`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch top devices');
  return res.json();
}

export async function getNetworkTopology() {
  // Use Supabase if configured
  if (USE_SUPABASE) {
    try {
      return await getNetworkTopologyFromSupabase();
    } catch (error) {
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV === 'development') {
        console.warn('Supabase query failed, falling back to FastAPI:', error);
      }
    }
  }
  
  // Fallback to FastAPI
  const res = await fetch(`${API_BASE_URL}/api/network/topology-summary`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch network topology');
  return res.json();
}

export async function getVLANs() {
  // Use Supabase if configured
  if (USE_SUPABASE) {
    try {
      const result = await getVLANsFromSupabase();
      return result;
    } catch (error) {
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV === 'development') {
        console.warn('Supabase query failed, falling back to FastAPI:', error);
      }
    }
  }
  
  // Fallback to FastAPI
  const res = await fetch(`${API_BASE_URL}/api/network/vlans`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch VLANs');
  return res.json();
}

export async function getIPSummary() {
  const res = await fetch(`${API_BASE_URL}/api/network/ip-summary`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch IP summary');
  return res.json();
}

export async function getAssetsList(limit = 100, offset = 0) {
  // Use Supabase if configured
  if (USE_SUPABASE) {
    try {
      return await getAssetsListFromSupabase(limit, offset);
    } catch (error) {
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV === 'development') {
        console.warn('Supabase query failed, falling back to FastAPI:', error);
      }
    }
  }
  
  // Fallback to FastAPI
  const res = await fetch(`${API_BASE_URL}/api/assets/list?limit=${limit}&offset=${offset}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch assets list');
  return res.json();
}

// Compliance API functions
export async function getComplianceDocuments() {
  // Use Supabase if configured
  if (USE_SUPABASE) {
    try {
      const result = await getComplianceDocumentsFromSupabase();
      return result;
    } catch (error) {
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV === 'development') {
        console.warn('Supabase query failed, falling back to FastAPI:', error);
      }
    }
  }
  
  // Fallback to FastAPI
  const res = await fetch(`${API_BASE_URL}/api/compliance/documents`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch compliance documents');
  return res.json();
}

export async function getOnsControls() {
  // Use Supabase if configured
  if (USE_SUPABASE) {
    try {
      const result = await getOnsControlsFromSupabase();
      return result;
    } catch (error) {
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV === 'development') {
        console.warn('Supabase query failed, falling back to FastAPI:', error);
      }
    }
  }
  
  // Fallback to FastAPI
  const res = await fetch(`${API_BASE_URL}/api/compliance/ons-controls`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch ONS controls');
  return res.json();
}

export async function getAneelRequirements() {
  const res = await fetch(`${API_BASE_URL}/api/compliance/aneel-requirements`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch ANEEL requirements');
  return res.json();
}

// Routing API functions
export async function getRoutingAnalysis() {
  const res = await fetch(`${API_BASE_URL}/api/routing/analysis-summary`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch routing analysis');
  return res.json();
}

export async function getRoutingVulnerabilities() {
  const res = await fetch(`${API_BASE_URL}/api/routing/vulnerabilities`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch routing vulnerabilities');
  return res.json();
}

export async function getRoutingGraph() {
  const res = await fetch(`${API_BASE_URL}/api/routing/routing-graph`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch routing graph');
  return res.json();
}

// Dashboard Stats API functions
export async function getComplianceStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const documentsRes = await fetch(`${baseUrl}/api/compliance/documents`, { cache: 'no-store' });
    const documentsData = documentsRes.ok ? await documentsRes.json() : { statistics: { total: 0, approved: 0, pending: 0 } };
    
    const onsRes = await fetch(`${baseUrl}/api/compliance/ons-controls`, { cache: 'no-store' }).catch(() => null);
    const onsData = onsRes?.ok ? await onsRes.json() : { stats: { compliance_rate: 0 } };
    
    return {
      total_documents: documentsData.statistics?.total || 0,
      approved_documents: documentsData.statistics?.approved || 0,
      missing_documents: (documentsData.statistics?.total || 0) - (documentsData.statistics?.approved || 0),
      completion_rate: documentsData.statistics?.total > 0 
        ? Math.round((documentsData.statistics?.approved / documentsData.statistics?.total) * 100)
        : 0,
      ons_compliance: onsData.stats?.compliance_rate || 0,
    };
  } catch (error) {
    console.error('Error fetching compliance stats:', error);
    return {
      total_documents: 0,
      approved_documents: 0,
      missing_documents: 0,
      completion_rate: 0,
      ons_compliance: 0,
    };
  }
}

export async function getGapsStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/remediation/gaps`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch gaps stats');
    const data = await res.json();
    return {
      total_gaps: data.stats?.total_gaps || 0,
      critical_gaps: data.stats?.critical_gaps || 0,
      high_gaps: data.stats?.high_gaps || 0,
      total_effort_hours: data.stats?.total_effort_hours || 0,
      avg_cvss: data.stats?.avg_cvss || 0,
    };
  } catch (error) {
    console.error('Error fetching gaps stats:', error);
    return {
      total_gaps: 0,
      critical_gaps: 0,
      high_gaps: 0,
      total_effort_hours: 0,
      avg_cvss: 0,
    };
  }
}

