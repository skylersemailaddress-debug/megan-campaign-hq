import { Router } from 'express';
import { z } from 'zod';
import { generateReport } from '../services/reportService';

export const reportsRouter = Router();

reportsRouter.post('/reports/generate', async (req, res) => {
  try {
    const body = z.object({
      reportType: z.string(),
      generatedBy: z.string().optional()
    }).parse(req.body);

    const report = await generateReport(body.reportType, body.generatedBy);
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});
