import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db/client';
import { processIntakeItem } from '../services/routerService';
import { logAuditEvent } from '../services/auditService';

export const intakeRouter = Router();

const intakeSchema = z.object({
  sourceType: z.string(),
  sourceRef: z.string().optional(),
  submittedBy: z.string().optional(),
  content: z.record(z.string(), z.any())
});

intakeRouter.post('/intake', async (req, res) => {
  try {
    const parsed = intakeSchema.parse(req.body);
    const rows = await query<{ id: string }>(
      `insert into intake_items (source_type, source_ref, submitted_by, content)
       values ($1, $2, $3, $4)
       returning id`,
      [parsed.sourceType, parsed.sourceRef ?? null, parsed.submittedBy ?? null, JSON.stringify(parsed.content)]
    );

    await logAuditEvent({
      actor: parsed.submittedBy ?? 'system',
      action: 'create_intake_item',
      objectType: 'intake_items',
      objectId: rows[0].id,
      metadata: { sourceType: parsed.sourceType }
    });

    res.status(201).json({ id: rows[0].id });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

intakeRouter.post('/router/process', async (req, res) => {
  try {
    const body = z.object({ intakeItemId: z.string().uuid() }).parse(req.body);
    const result = await processIntakeItem(body.intakeItemId);
    await logAuditEvent({
      actor: 'router',
      action: 'process_intake_item',
      objectType: 'intake_items',
      objectId: body.intakeItemId,
      metadata: result
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

