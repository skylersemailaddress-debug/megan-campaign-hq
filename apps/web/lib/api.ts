const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://megancampaginhq-production.up.railway.app";

async function fetchJson(path: string) {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${path}`);
  }
  return res.json();
}

export async function getDashboardState() {
  return fetchJson("/dashboard/state");
}

export async function getAnalyticsSummary() {
  try {
    return await fetchJson("/analytics/summary");
  } catch {
    return {
      signalsByCategory: [],
      approvalsByType: [],
    };
  }
}

export async function fetchDashboardState() {
  return getDashboardState();
}
