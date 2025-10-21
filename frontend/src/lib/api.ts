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

