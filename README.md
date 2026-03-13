# Megan Campaign HQ

Monorepo scaffold for the Megan Campaign HQ MVP.

## Stack
- `apps/web`: Next.js 15 + React + Tailwind dashboard
- `apps/api`: Node.js + Express + TypeScript API
- `packages/shared`: shared types and contracts
- `docs`: implementation notes and GPT tool contract

## MVP scope in this scaffold
- Dashboard UI shell
- Ask HQ panel shell
- Backend API skeleton
- Router service skeleton
- Postgres schema SQL
- Report + analytics endpoint stubs
- Google Docs / Google Chat service stubs
- Shared type contracts

## Quick start

### 1) API
```bash
cd apps/api
npm install
npm run dev
```

API runs on `http://localhost:4000`.

### 2) Web app
```bash
cd apps/web
npm install
npm run dev
```

Web runs on `http://localhost:3000`.

## Environment
Create `apps/api/.env`:
```env
PORT=4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/megan_hq
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_CHAT_WEBHOOK_URL=
GOOGLE_SERVICE_ACCOUNT_JSON=
```

Create `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## Database bootstrap
Run `apps/api/src/db/schema.sql` against Postgres or Supabase SQL editor.

## Notes
This is a real starter scaffold, not a finished product. The external integrations are intentionally stubbed so you can wire credentials and deployment details safely.
