# MVP Build Plan

## Build order
1. Postgres schema
2. API skeleton
3. Router pipeline
4. Dashboard UI
5. Ask HQ tool bridge
6. Reports
7. Google outputs
8. Analytics

## Non-negotiable rule
GPT must never simulate state mutation in text. All state changes must happen through structured tools hitting the backend API.
