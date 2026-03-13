import { HQDashboard } from '../components/HQDashboard';
import { getAnalyticsSummary, getDashboardState } from '../lib/api';

export default async function Page() {
  const [dashboardState, analyticsSummary] = await Promise.all([
    getDashboardState().catch(() => ({
      today: { summary: 'API unavailable', priorityCount: 0 },
      signals: [],
      approvals: [],
      events: [],
      websiteQueue: []
    })),
    getAnalyticsSummary().catch(() => ({
      signalsByCategory: [],
      approvalsByType: [],
      eventsByStatus: []
    }))
  ]);

  return <HQDashboard dashboardState={dashboardState} analyticsSummary={analyticsSummary} />;
}
