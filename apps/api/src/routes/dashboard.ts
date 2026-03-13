import { Router } from 'express';
import { query } from '../db/client';

export const dashboardRouter = Router();

dashboardRouter.get('/dashboard/state', async (_req, res) => {
  try {
    const [signals, approvals, events, websiteQueue] = await Promise.all([
      query('select * from signals order by created_at desc limit 10'),
      query('select * from approvals order by created_at desc limit 10'),
      query('select * from event_opportunities order by created_at desc limit 10'),
      query('select * from website_change_requests order by created_at desc limit 10')
    ]);

    res.json({
      today: {
        summary: 'Operational overview ready.',
        priorityCount: approvals.length + signals.length
      },
      signals,
      approvals,
      events,
      websiteQueue
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
