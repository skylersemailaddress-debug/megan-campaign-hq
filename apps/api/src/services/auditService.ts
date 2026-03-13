import { query } from '../db/client';

export async function logAuditEvent(input: {
  actor: string;
  action: string;
  objectType: string;
  objectId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  try {
    await query(
      `insert into audit_events (actor, action, object_type, object_id, metadata)
       values ($1, $2, $3, $4, $5)`,
      [
        input.actor,
        input.action,
        input.objectType,
        input.objectId ?? null,
        JSON.stringify(input.metadata ?? {})
      ]
    );
  } catch (error) {
    console.error('audit log failed', error);
  }
}
