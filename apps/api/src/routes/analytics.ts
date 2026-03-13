import { Router } from 'express';
import { query } from '../db/client';

export const analyticsRouter = Router();

analyticsRouter.get('/analytics/summary', async (_req, res) => {
  try {
    const [signalsByCategory, approvalsByType, eventsByStatus] = await Promise.all([
      query(`select category as label, count(*)::int as value from signals group by category order by value desc`),
      query(`select approval_type as label, count(*)::int as value from approvals group by approval_type order by value desc`),
      query(`select status as label, count(*)::int as value from event_opportunities group by status order by value desc`)
    ]);

    res.json({ signalsByCategory, approvalsByType, eventsByStatus });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
