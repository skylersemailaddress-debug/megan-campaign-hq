create extension if not exists "pgcrypto";

create table if not exists intake_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source_type text not null,
  source_ref text,
  submitted_by text,
  content jsonb not null,
  status text not null default 'new',
  router_processed boolean not null default false
);

create table if not exists route_decisions (
  id uuid primary key default gen_random_uuid(),
  intake_item_id uuid not null references intake_items(id) on delete cascade,
  classification text not null,
  owner text,
  approval_required boolean not null default false,
  approval_type text,
  durability_score integer not null default 0,
  decision_summary text not null,
  created_at timestamptz not null default now()
);

create table if not exists signals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  signal_type text not null,
  category text not null,
  severity text not null,
  location text,
  summary text not null,
  linked_intake uuid references intake_items(id) on delete set null,
  status text not null default 'open'
);

create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  approval_type text not null,
  requested_by text,
  object_type text not null,
  object_id uuid,
  description text not null,
  status text not null default 'pending',
  approved_by text,
  approved_at timestamptz
);

create table if not exists event_opportunities (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_name text not null,
  event_date date,
  location text,
  audience text,
  source text,
  status text not null default 'suggested',
  notes text,
  linked_intake uuid references intake_items(id) on delete set null
);

create table if not exists website_change_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  requested_by text,
  change_type text not null,
  description text not null,
  target_page text,
  status text not null default 'pending',
  approval_id uuid references approvals(id) on delete set null,
  linked_intake uuid references intake_items(id) on delete set null
);

create table if not exists campaign_brain_proposals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  proposal_summary text not null,
  proposed_change jsonb not null,
  requested_by text,
  status text not null default 'pending',
  approval_id uuid references approvals(id) on delete set null,
  linked_intake uuid references intake_items(id) on delete set null
);

create table if not exists generated_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  report_type text not null,
  title text not null,
  generated_by text,
  doc_url text,
  summary text not null
);

create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor text not null,
  action text not null,
  object_type text not null,
  object_id uuid,
  metadata jsonb not null default '{}'::jsonb
);
