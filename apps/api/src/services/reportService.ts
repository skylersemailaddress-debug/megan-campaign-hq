import { query } from '../db/client';

export async function generateReport(reportType: string, generatedBy = 'Ask HQ') {
  const title = `${reportType.replace(/_/g, ' ')} - ${new Date().toISOString()}`;
  const summary = `Generated ${reportType} from current Megan Campaign HQ state.`;

  const rows = await query<{ id: string }>(
    `insert into generated_reports (report_type, title, generated_by, summary)
     values ($1, $2, $3, $4)
     returning id`,
    [reportType, title, generatedBy, summary]
  );

  return {
    id: rows[0].id,
    reportType,
    title,
    summary,
    docUrl: null
  };
}
