# /hq/chat Runtime Spec

## Objective
Make the dashboard runtime respond as close as possible to the ChatGPT Megan HQ runtime.

## Runtime flow

### Request in
Client sends:
```json
{
  "message": "user input here",
  "selected_context": {},
  "ui_state": {},
  "session_id": "abc123",
  "user_id": "optional"
}
```

### Server-side load order
1. `runtime_identity/megan_hq_system_prompt.txt`
2. `campaign_brain/live/campaign_brain.json`
3. `working_memory/working_memory.json`
4. operational files as needed:
   - approvals.json
   - signals.json
   - events.json
   - website_queue.json
   - dashboard_state_snapshot.json
5. recent session summaries
6. current user message and UI context

### Model call shape
Use a strong system message with:
- Megan HQ identity
- routing rules
- memory rules
- write rules
- output format
- UI command contract

Then pass:
- current message
- selected context
- dashboard state
- relevant excerpts from Drive memory

### Response out
Return structured JSON to the UI:

```json
{
  "assistant_text": "HQ Intake Processed ...",
  "routing": {
    "input_type": "issue report",
    "primary_owner": "Community Issue Tracker",
    "secondary_owners": [],
    "signal_status": "Early Watch",
    "dashboard_bucket": "Signals"
  },
  "memory_actions": [
    {
      "target": "working_memory",
      "action": "append",
      "reason": "temporary operator context"
    }
  ],
  "ui_commands": []
}
```

## Memory write pass
After response generation:
1. inspect model-proposed memory actions
2. validate against write policy
3. archive if Campaign Brain update
4. write to Drive
5. log write
6. return final response

## Same-person parity requirements
The runtime must preserve:
- same tone
- same output discipline
- same routing behavior
- same escalation labels
- same memory split
- same write sensitivity rules

## Recommended implementation notes
- keep drive I/O in a dedicated memory service
- keep prompt assembly in a dedicated prompt builder
- keep ui command parsing separate from assistant text
- prefer deterministic schemas for writes
