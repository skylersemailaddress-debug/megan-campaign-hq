# Google Drive Brain Schema

## Goal
Make the ChatGPT Megan HQ runtime and the dashboard `/hq/chat` runtime behave like the same operator by reading and writing the same external memory.

## Recommended folder structure

```text
/Megan HQ Brain/
  runtime_identity/
    megan_hq_system_prompt.txt
    megan_hq_identity.md
    hq_chat_runtime_spec.md
    ui_command_contract.json
    memory_write_policy.md

  campaign_brain/
    live/
      campaign_brain.json
    archive/
      campaign_brain-YYYYMMDD-HHMMSS.json
    change_log/
      campaign_brain_changes.jsonl

  working_memory/
    working_memory.json
    working_memory_archive/
      working_memory-YYYYMMDD-HHMMSS.json

  operations/
    approvals.json
    signals.json
    events.json
    website_queue.json
    research_queue.json
    dashboard_state_snapshot.json

  sessions/
    session_summaries/
      2026-03-13-session-001.json
      2026-03-13-session-002.json

  runtime_logs/
    memory_writes.jsonl
    route_decisions.jsonl
```

## Canonical file shapes

### campaign_brain.json
```json
{
  "version": "1.0",
  "updated_at": "2026-03-13T21:00:00Z",
  "strategy_decisions": [],
  "approved_messaging": [],
  "research_findings": [],
  "major_risks_opportunities": [],
  "field_decisions": [],
  "approved_next_steps": []
}
```

### working_memory.json
```json
{
  "version": "1.0",
  "updated_at": "2026-03-13T21:00:00Z",
  "operator_preferences": [],
  "build_debug_notes": [],
  "ui_preferences": [],
  "temporary_context": [],
  "recent_useful_facts": []
}
```

### approvals.json
```json
{
  "version": "1.0",
  "updated_at": "2026-03-13T21:00:00Z",
  "items": []
}
```

### signals.json
```json
{
  "version": "1.0",
  "updated_at": "2026-03-13T21:00:00Z",
  "items": []
}
```

### events.json
```json
{
  "version": "1.0",
  "updated_at": "2026-03-13T21:00:00Z",
  "items": []
}
```

## Write model
- Campaign Brain writes are durable and gated
- Working Memory writes are easier and more frequent
- Every Campaign Brain write must archive previous state first
- Every write should be logged to `runtime_logs/memory_writes.jsonl`

## Same-person rule
Both runtimes must:
1. load identity files
2. load Campaign Brain
3. load Working Memory
4. load relevant operational files
5. answer
6. write back approved updates
