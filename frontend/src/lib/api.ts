// API client for ness. OT GRC backend

// Use different URL for server-side vs client-side
const getApiUrl = () => {
  // Server-side (dentro do Docker)
  if (typeof window === 'undefined') {
    return 'http://backend:8000';
  }
  // Client-side (browser)
  return 'http://localhost:8001';
};

const API_BASE_URL = getApiUrl();

export async function getAssetsStats() {
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
  const res = await fetch(`${API_BASE_URL}/api/network/topology-summary`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch network topology');
  return res.json();
}

export async function getVLANs() {
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
  const res = await fetch(`${API_BASE_URL}/api/assets/list?limit=${limit}&offset=${offset}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch assets list');
  return res.json();
}

// Compliance API functions
export async function getComplianceDocuments() {
  const res = await fetch(`${API_BASE_URL}/api/compliance/documents`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch compliance documents');
  return res.json();
}

export async function getOnsControls() {
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

