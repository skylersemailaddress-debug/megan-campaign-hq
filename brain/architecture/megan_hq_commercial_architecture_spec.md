# Megan HQ Commercial Architecture Spec

## Objective
Build Megan HQ as a commercial-grade campaign operating system that feels like the same operator across:
- ChatGPT runtime
- Shell UI runtime

while keeping:
- clean architecture
- full UI control
- shared memory
- operational discipline
- minimal duplication
- room for future scale

## Executive decision
Use the **Shell UI runtime as the primary product runtime**.

Do **not** try to embed the Custom GPT itself into the shell.

Instead, run:
- **Shell UI** -> **Railway API** -> **/hq/chat** -> **Responses API**
- **Custom GPT** as a parallel operator runtime
- **Google Drive** as the shared durable brain
- **Supabase** as operational app state and query layer

This delivers the cleanest commercial setup and gets the closest practical result to “same person in both places.”

---

## Final architecture

### Primary runtime
- **Next.js Shell UI**
- **Railway API**
- **/hq/chat**
- **Responses API**

### Parallel runtime
- **Custom GPT**
- same identity
- same memory access pattern
- same operating rules

### Shared memory and state
- **Google Drive** = canonical durable brain
- **Supabase** = app state, workflow state, dashboard state, queryable records

---

## Role of each system

### 1. Shell UI
This is the main Megan HQ product.

It owns:
- dashboard
- Ask HQ
- approvals
- signals
- events
- website queue
- research queue
- routing panels
- operator workflows
- UI command execution

This is where Megan HQ behaves like a command center.

### 2. Railway API
This is the orchestration layer.

It owns:
- `/hq/chat`
- memory loading
- prompt assembly
- model calls
- write policy enforcement
- UI command shaping
- Google Drive read/write
- Supabase read/write
- logging
- auth and environment control

### 3. Responses API runtime
This is the model execution layer for the shell.

It receives:
- Megan HQ system identity
- campaign brain context
- working memory context
- relevant dashboard state
- current user message
- optional session summary
- UI command contract

It returns:
- assistant response
- routing metadata
- memory proposals
- UI commands

### 4. Custom GPT runtime
This is a parallel interface for staff who want to work in ChatGPT.

It should:
- load the same memory from Drive
- follow the same operating rules
- write to the same brain
- behave like the same operator

It is not the primary app runtime.

### 5. Google Drive
This is the canonical durable memory system.

It stores:
- Campaign Brain
- Working Memory
- session summaries
- identity/runtime files
- approved durable intelligence

### 6. Supabase
This is the operational data system.

It stores:
- intake items
- approvals
- signals
- events
- dashboard state snapshots
- reports
- chat/session references as needed

Use Supabase for fast querying and app workflows.
Use Google Drive for canonical durable brain files.

---

## Memory model

### A. Campaign Brain
Durable intelligence only:
- strategy decisions
- approved messaging
- major research findings
- major risks/opportunities
- important field decisions
- approved next steps

Rules:
- highly gated
- archive before overwrite
- change log required
- do not write casually

### B. Working Memory
Useful continuity that should not pollute Campaign Brain:
- build/debug notes
- launcher quirks
- operator preferences
- UI preferences
- recent non-strategic facts
- temporary operating context

Rules:
- easier to write
- still structured
- should support continuity across chats and runtimes

### C. Operational state
Lives primarily in Supabase:
- signals
- approvals
- events
- queues
- dashboard state
- reports

### D. Session summaries
Short structured summaries of recent interactions.

Used to preserve continuity across:
- shell sessions
- ChatGPT sessions
- operator handoffs

---

## Source-of-truth policy

### Google Drive is canonical for:
- Megan HQ identity
- Campaign Brain
- Working Memory
- session summaries
- durable runtime specs

### Supabase is canonical for:
- operational records
- dashboard queues
- event objects
- approvals
- signals
- workflow records

### Runtime rule
The model should never treat its own ephemeral conversation context as the long-term source of truth.

---

## Runtime parity model

Both runtimes must share:

### Shared identity
- same system prompt
- same mission
- same tone
- same routing rules
- same escalation rules
- same output discipline
- same write policy

### Shared memory
- same Campaign Brain
- same Working Memory
- same session summaries

### Shared behavior
- same routing defaults
- same approval rules
- same signal labels
- same dashboard placement logic

This is how Megan HQ feels like the same operator in two places.

---

## Identity package

Canonical files:
- `brain/megan_hq_system_prompt.txt`
- `brain/megan_hq_identity.md`
- `brain/memory_write_policy.md`
- `brain/ui_command_contract.json`
- `brain/hq_chat_runtime_spec.md`
- `brain/google_drive_brain_schema.md`

These files are loaded by the shell runtime and mirrored conceptually by the Custom GPT runtime.

---

## Shell request lifecycle

### Request flow
1. user sends message from Ask HQ
2. shell posts to `/hq/chat`
3. backend loads identity files
4. backend loads Drive memory
5. backend loads relevant Supabase state
6. backend assembles runtime prompt
7. backend calls model
8. backend validates memory proposals
9. backend writes approved updates
10. backend returns:
   - assistant text
   - routing metadata
   - memory actions
   - UI commands

### Response envelope
Return structured JSON like:

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
  "memory_actions": [],
  "ui_commands": []
}
```

---

## UI command layer

The shell should not rely on the model to directly mutate the DOM.

Instead the model returns structured UI intents.

Recommended commands:
- `navigate`
- `open_panel`
- `set_filter`
- `surface_signal`
- `queue_decision`
- `draft_response`
- `hydrate_context`

The shell interprets and executes these commands safely.

This is how Megan HQ “manipulates the UI” in a commercial way.

---

## Recommended folder/file architecture

### Repo structure
```text
/apps
  /web
  /api

/brain
  megan_hq_system_prompt.txt
  megan_hq_identity.md
  memory_write_policy.md
  ui_command_contract.json
  hq_chat_runtime_spec.md
  google_drive_brain_schema.md
```

### API services
```text
/apps/api/src
  /routes
    hq.ts
  /brain
    composeBrainPrompt.ts
    promptBuilder.ts
    memoryWritePolicy.ts
  /services
    googleDriveMemory.ts
    supabaseState.ts
    sessionSummaryService.ts
    uiCommandNormalizer.ts
  /types
    hq.ts
    memory.ts
    uiCommands.ts
```

---

## Google Drive structure

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
    archive/
      working_memory-YYYYMMDD-HHMMSS.json

  sessions/
    session_summaries/
      YYYY-MM-DD-session-001.json

  runtime_logs/
    memory_writes.jsonl
    route_decisions.jsonl
```

---

## Supabase scope

Recommended tables:
- `intake_items`
- `approvals`
- `signals`
- `events`
- `website_queue`
- `research_queue`
- `dashboard_state_snapshots`
- `session_threads`
- `reports`

Do not store the canonical Campaign Brain only in Supabase.
Mirror if useful, but Drive remains canonical for durable intelligence.

---

## Write policy

### Campaign Brain writes
Allowed only when changing:
- strategy
- approved messaging
- issue framing
- major risk/opportunity assessment
- major research conclusion
- field targeting priority
- approved next steps

Procedure:
1. read current brain
2. archive current brain
3. append change log
4. write new live brain

### Working Memory writes
Allowed for:
- operator continuity
- technical continuity
- preferences
- temporary state worth preserving

Procedure:
1. read current working memory
2. merge structured update
3. write updated file
4. log write

---

## Product behavior rules

### Tone
- direct
- calm
- tactical
- structured
- concise
- commercially clean

### Output discipline
Default structure:

- HQ Intake Processed
- What HQ detected
- Where HQ routed it
- What it changes
- Recommended action
- Approval needed
- Signal status

### Routing defaults
- service complaints -> Community Issue Tracker
- rumors/attacks -> War Room
- invitations/events -> Events + Outreach Pipeline
- website/content work -> Website Queue
- approvals/tradeoffs -> Decision Queue
- unclear -> Intake Catch-All

### Website rules
Locked:
- Header
- Hero
- Trust Bar
- Homepage order

Implementation rule:
- ZIP patches + PowerShell only
- no manual edits

---

## Clean commercial principles

### 1. No patch-and-pray
Use:
- inspection first
- overwrite when cleaner
- versioned backups
- deterministic schemas

### 2. Model is not the database
The model reasons.
Your systems store truth.

### 3. Drive for brain, Supabase for operations
Do not blur these responsibilities.

### 4. Structured outputs everywhere
Avoid raw freeform control when structured envelopes are cleaner.

### 5. Runtime parity over runtime embedding
Do not fight the platform trying to literally embed the Custom GPT.
Build parity instead.

This gets 99% of the desired result with much cleaner control.

---

## Recommended implementation phases

### Phase 1 — Lock runtime identity
Done or nearly done:
- identity pack
- system prompt
- memory write policy
- UI command contract

### Phase 2 — Normalize shell runtime
Implement:
- prompt builder
- `/hq/chat` structured response envelope
- safe dashboard state loading
- deterministic UI command output

### Phase 3 — Build Google Drive memory bridge
Implement:
- Drive auth
- file loader/writer
- Campaign Brain archive flow
- Working Memory update flow
- session summary loader

### Phase 4 — Add Supabase operational loaders
Implement:
- signals
- approvals
- events
- queues
- dashboard snapshot

### Phase 5 — Add UI command execution layer
Implement:
- open panel
- navigate
- set filters
- draft responses
- queue decisions
- surface signals

### Phase 6 — Parallelize ChatGPT runtime
Make the Custom GPT use the same memory contracts and files.

---

## Final recommendation

The cleanest commercial Megan HQ setup is:

- **Shell UI is the main product**
- **Responses API is the main runtime**
- **Google Drive is the canonical shared brain**
- **Supabase is the operational state layer**
- **Custom GPT is a parallel operator console**
- **Both runtimes share identity, memory, and rules**
- **The shell uses structured UI commands**
- **Drive-backed memory creates same-person continuity**

This is the most efficient clean setup that still gets you almost everything you want:
- same operator feel
- full UI control
- memory across runtimes
- commercial architecture
- lower fragility
- higher scalability
