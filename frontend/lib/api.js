const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Request failed: ${response.status}`);
  }
  
  return response.json();
}

export async function getStats() {
  return request('/stats');
}

export async function getSessions(page = 1, limit = 20) {
  const params = new URLSearchParams({ page, limit });
  return request(`/sessions?${params.toString()}`);
}

export async function getSessionById(sessionId) {
  return request(`/sessions/${sessionId}`);
}

export async function getHeatmap(pageUrl) {
  const params = new URLSearchParams({ pageUrl });
  return request(`/heatmap?${params.toString()}`);
}
