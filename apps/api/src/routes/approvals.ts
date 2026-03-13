import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db/client';

export const approvalsRouter = Router();

approvalsRouter.get('/approvals', async (_req, res) => {
  try {
    const rows = await query('select * from approvals order by created_at desc limit 50');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

approvalsRouter.post('/approvals', async (req, res) => {
  try {
    const body = z.object({
      approvalType: z.string(),
      requestedBy: z.string().optional(),
      objectType: z.string(),
      objectId: z.string().uuid().optional(),
      description: z.string()
    }).parse(req.body);

    const rows = await query<{ id: string }>(
      `insert into approvals (approval_type, requested_by, object_type, object_id, description)
       values ($1, $2, $3, $4, $5)
       returning id`,
      [
        body.approvalType,
        body.requestedBy ?? null,
        body.objectType,
        body.objectId ?? null,
        body.description
      ]
    );

    res.status(201).json({ id: rows[0].id });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});
