
# AI Standup Summarizer – Implementation Plan

## Goal
Deliver a fully functional localhost app using Serverless Framework (offline Lambdas), MongoDB, MySQL, and a React+TS frontend. Provide clean README and tests.

---

## Phase 1 – Setup
- [ ] Initialize repo structure: `backend/`, `frontend/`, `docker-compose.yml`, `README.md`
- [ ] Add Serverless Framework with `serverless-offline`

## Phase 2 – Databases
- [ ] Spin up MongoDB (logs/summaries) via Docker
- [ ] Spin up MySQL (users/teams) via Docker
- [ ] Seed or lazy-create schema as needed

## Phase 3 – Backend (Lambdas)
### API Gateway (GraphQL)
- [ ] Define schema: `CreateUpdate`, `Summary`, queries (`summaries`), mutations (`createUpdate`)
- [ ] Implement resolvers to:
  - [ ] Insert raw update (Mongo)
  - [ ] Call Summarizer service over HTTP
  - [ ] Store summary (Mongo)
  - [ ] Return combined payload
- [ ] Add MySQL connection module for future user/team lookups

### Summarizer
- [ ] If `GEMINI_API_KEY` present: call Google Gemini AI
- [ ] Else: return error (Gemini API key required)
- [ ] Return concise summary JSON

### Notifier
- [ ] Stub endpoint that would build a digest for a user/team
- [ ] (Optional) Integrate with Slack/Email in future

### Testing
- [ ] Jest tests for GraphQL resolvers (unit-ish)
- [ ] Summarizer function tests (pure function)

## Phase 4 – Frontend
- [ ] Vite React + TS scaffold
- [ ] Form to submit update text
- [ ] List view for summaries with filtering by userId
- [ ] Basic UX: loading/error, memoized list, small pagination

## Phase 5 – Local Run & Docs
- [ ] `docker compose up -d`
- [ ] `serverless offline` for all services
- [ ] `npm run dev` for frontend
- [ ] Update README with examples & screenshots (optional)
