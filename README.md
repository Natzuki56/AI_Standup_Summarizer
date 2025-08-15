
# AI Standup Summarizer (Localhost + Serverless Offline)

A small but meaningful **AI-powered MERN**-style app that runs **entirely on localhost**.  
It demonstrates **microservices**, a **GraphQL API**, **MongoDB** for logs, **MySQL** for users/teams, **unit tests (Jest)**, and a **React + TypeScript** frontend.

> Uses **Serverless Framework** with **serverless-offline** to emulate Lambdas locally.  
> Optional: `localstack` is included in `docker-compose.yml` if you want to simulate S3-like storage, but the app works without touching S3.

---

## Features

- Submit daily standup updates (text) from the frontend.
- GraphQL API stores raw updates and a generated **AI summary** for each submission using Google Gemini AI.
- Summaries and logs queryable via GraphQL.
- Simple notifier function stub (HTTP-triggered) for a daily digest pattern.
- **All local**: MongoDB + MySQL via Docker, Lambdas via Serverless Offline, frontend via Vite dev server.

---

## Quick Start

### 0) Prereqs
- Node.js 18+ and npm or yarn/pnpm
- Docker Desktop (or Docker Engine) running
- Serverless Framework CLI:  
  ```bash
  npm i -g serverless
  ```

### 1) Start Databases (MongoDB + MySQL [+ Localstack optional])
From project root:
```bash
docker compose up -d
```
> MySQL is exposed on `localhost:3306` (user: `root`, password: `rootpass`).  
> MongoDB is exposed on `localhost:27017`.  
> Localstack (optional) on `localhost:4566`.

### 2) Backend (Serverless Offline)
```bash
cd backend
npm install
# copy env example and edit if needed
cp .env.example .env
# run lambdas locally
npm run dev
```
This starts:
- **GraphQL API** at `http://localhost:3001/graphql`
- **Summarizer** at `http://localhost:3002/summarize` (HTTP POST)
- **Notifier** at `http://localhost:3003/notify` (HTTP POST)

### 3) Frontend (React + TS + Vite)
```bash
cd ../frontend
npm install
npm run dev
```
Open the URL printed by Vite (usually `http://localhost:5173`).

---

## Environment Variables

Create `backend/.env` from `.env.example` (already provided).

- `GEMINI_API_KEY` – Required. Your Google Gemini API key for AI-powered summarization.
- `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DB`
- `MONGO_URI`

> The default values match the docker-compose setup, so it should work out of the box.

---

## Example GraphQL Queries

### Create an update (mutation)
```graphql
mutation CreateUpdate($input: CreateUpdateInput!) {
  createUpdate(input: $input) {
    id
    userId
    text
    summary
    createdAt
  }
}
```
**Variables:**
```json
{
  "input": {
    "userId": "u123",
    "text": "Yesterday: fixed login bug; Today: implement caching; Blockers: flaky test in payments"
  }
}
```

### Get summaries
```graphql
query GetSummaries($userId: String) {
  summaries(userId: $userId) {
    id
    userId
    summary
    createdAt
  }
}
```

---

## Testing
```bash
cd backend
npm test
```

---

## Open Source
Feel free to push this to your GitHub as a public repo. Suggested name: `ai-standup-summarizer`.

---

## Notes
- This is designed to be **demo-friendly**, runnable **in a day**, and still show senior-level practices: typed Node, clean layering, tests, and microservices with a local service-to-service HTTP call (representing gRPC in production).
- To keep local setup lean, we skip true gRPC and use HTTP between services. In interviews, call out how you'd swap HTTP with gRPC (e.g., using `@grpc/grpc-js`) and a proper service discovery layer.
