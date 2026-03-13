import { query } from '../db/client';

type RouterOutput = {
  classification: string;
  owner: string;
  approvalRequired: boolean;
  approvalType?: string;
  durabilityScore: number;
  decisionSummary: string;
};

function classifyContent(content: Record<string, unknown>): RouterOutput {
  const text = JSON.stringify(content).toLowerCase();

  if (text.includes('website') || text.includes('page update')) {
    return {
      classification: 'website_change',
      owner: 'Message + Digital Room',
      approvalRequired: true,
      approvalType: 'website_publish',
      durabilityScore: 70,
      decisionSummary: 'Website change request routed to Website Queue with approval required.'
    };
  }

  if (text.includes('event')) {
    return {
      classification: 'event_opportunity',
      owner: 'Strategy Room',
      approvalRequired: false,
      durabilityScore: 60,
      decisionSummary: 'Event-related intake routed to Event Opportunities.'
    };
  }

  if (text.includes('brain') || text.includes('knowledge update')) {
    return {
      classification: 'campaign_brain_proposal',
      owner: 'Strategy Room',
      approvalRequired: true,
      approvalType: 'campaign_brain_update',
      durabilityScore: 85,
      decisionSummary: 'Campaign Brain proposal created and gated for approval.'
    };
  }

  return {
    classification: 'signal',
    owner: 'War Room',
    approvalRequired: false,
    durabilityScore: 50,
    decisionSummary: 'Intake compressed into a signal for monitoring.'
  };
}

export async function processIntakeItem(intakeItemId: string) {
  const items = await query<{ id: string; content: Record<string, unknown> }>(
    'select id, content from intake_items where id = $1 limit 1',
    [intakeItemId]
  );

  if (!items.length) {
    throw new Error('Intake item not found');
  }

  const item = items[0];
  const decision = classifyContent(item.content);

  const decisionRows = await query<{ id: string }>(
    `insert into route_decisions
      (intake_item_id, classification, owner, approval_required, approval_type, durability_score, decision_summary)
     values ($1, $2, $3, $4, $5, $6, $7)
     returning id`,
    [
      intakeItemId,
      decision.classification,
      decision.owner,
      decision.approvalRequired,
      decision.approvalType ?? null,
      decision.durabilityScore,
      decision.decisionSummary
    ]
  );

  if (decision.classification === 'signal') {
    await query(
      `insert into signals (signal_type, category, severity, summary, linked_intake)
       values ($1, $2, $3, $4, $5)`,
      ['operational', 'general', 'medium', decision.decisionSummary, intakeItemId]
    );
  }

  if (decision.classification === 'event_opportunity') {
    await query(
      `insert into event_opportunities (event_name, source, status, notes, linked_intake)
       values ($1, $2, $3, $4, $5)`,
      ['Suggested Event', 'router', 'suggested', decision.decisionSummary, intakeItemId]
    );
  }

  if (decision.classification === 'website_change') {
    const approval = await maybeCreateApproval(decision, 'website_change_requests', intakeItemId);
    await query(
      `insert into website_change_requests (change_type, description, status, approval_id, linked_intake)
       values ($1, $2, $3, $4, $5)`,
      ['content_update', decision.decisionSummary, 'pending', approval, intakeItemId]
    );
  }

  if (decision.classification === 'campaign_brain_proposal') {
    const approval = await maybeCreateApproval(decision, 'campaign_brain_proposals', intakeItemId);
    await query(
      `insert into campaign_brain_proposals (proposal_summary, proposed_change, status, approval_id, linked_intake)
       values ($1, $2, $3, $4, $5)`,
      [decision.decisionSummary, JSON.stringify(item.content), 'pending', approval, intakeItemId]
    );
  }

  await query('update intake_items set router_processed = true, status = $2 where id = $1', [intakeItemId, 'processed']);

  return {
    routeDecisionId: decisionRows[0].id,
    ...decision
  };
}

async function maybeCreateApproval(decision: RouterOutput, objectType: string, objectId: string) {
  if (!decision.approvalRequired || !decision.approvalType) {
    return null;
  }

  const rows = await query<{ id: string }>(
    `insert into approvals (approval_type, object_type, object_id, description, status)
     values ($1, $2, $3, $4, $5)
     returning id`,
    [decision.approvalType, objectType, objectId, decision.decisionSummary, 'pending']
  );

  return rows[0].id;
}
