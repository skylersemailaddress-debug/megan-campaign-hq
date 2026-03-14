# Memory Write Policy

## Goal
Preserve sameness across runtimes without polluting durable campaign intelligence.

## Two memory lanes

### Campaign Brain
Write only when one of these changes:
- strategy
- approved messaging
- issue framing
- major risk/opportunity assessment
- major research conclusion
- field targeting priority
- approved next steps

### Working Memory
Write when useful for continuity but not durable enough for Campaign Brain:
- debug/setup notes
- launcher or local environment issues
- UI preferences
- preferred working style
- temporary operating context
- recent non-strategic facts

## Write sensitivity classes
- read_only
- internal_write
- approval_required_write
- prohibited_without_explicit_approval

## Campaign Brain write procedure
1. read current `campaign_brain.json`
2. archive current file to `campaign_brain/archive/`
3. append change record to `campaign_brain/change_log/campaign_brain_changes.jsonl`
4. write updated live `campaign_brain.json`

## Working Memory write procedure
1. read current `working_memory.json`
2. merge or append allowed items
3. write updated file
4. append a log line to `runtime_logs/memory_writes.jsonl`

## Same-person continuity rule
If one runtime learns an allowed fact, it should write it to the correct shared memory lane so the other runtime can load it on the next turn.

## Guardrails
Do not durably write:
- every chat message
- speculative claims
- emotional venting unless it changes operations
- transient errors unless useful for future support
- public-facing content changes without approval
