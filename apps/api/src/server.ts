import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { intakeRouter } from './routes/intake';
import { dashboardRouter } from './routes/dashboard';
import { approvalsRouter } from './routes/approvals';
import { reportsRouter } from './routes/reports';
import { analyticsRouter } from './routes/analytics';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'megan-campaign-hq-api' });
});

app.use(intakeRouter);
app.use(dashboardRouter);
app.use(approvalsRouter);
app.use(reportsRouter);
app.use(analyticsRouter);

app.listen(port, () => {
  console.log(`Megan Campaign HQ API listening on http://localhost:${port}`);
});

app.get('/dashboard/state', (req,res)=>{
res.json({
today:{},
signals:[],
approvals:[],
events:[],
website_queue:[]
})
})

