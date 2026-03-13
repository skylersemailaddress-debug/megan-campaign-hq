const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function getDashboardState() {
  const res = await fetch(`${API_BASE_URL}/dashboard/state`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load dashboard state');
  return res.json();
}

export async function getAnalyticsSummary() {
  const res = await fetch(`${API_BASE_URL}/analytics/summary`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load analytics summary');
  return res.json();
}
