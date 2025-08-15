
# AI Standup Summarizer - HTTP vs gRPC Performance Comparison

A comprehensive **AI-powered microservices** application that demonstrates and compares the performance differences between **HTTP** and **gRPC** communication protocols.  
The project runs **entirely on localhost** and showcases **microservices architecture**, **GraphQL API**, **MongoDB** for logs, **MySQL** for users/teams, **unit tests (Jest)**, and a **React + TypeScript** frontend with real-time performance metrics.

> Uses **Serverless Framework** with **serverless-offline** to emulate Lambdas locally.  
> **Key Feature**: Toggle between HTTP, gRPC, or run both in parallel for performance comparison.

---

## Features

- **Protocol Selection**: Choose between HTTP, gRPC, or both for service communication
- **Performance Comparison**: Real-time measurement and display of **pure communication timing** for both protocols
- **Parallel Execution**: Run HTTP and gRPC calls simultaneously to compare performance
- **Heavy Payload Testing**: Test with 100KB, 500KB, and 1MB data payloads for significant performance differences
- **AI-Powered Summarization**: Submit daily standup updates and get AI-generated summaries using Google Gemini AI
- **GraphQL API**: Modern API with support for protocol-specific requests
- **Microservices Architecture**: Separate services for API, Summarization (HTTP), and gRPC server
- **All Local**: MongoDB + MySQL via Docker, Lambdas via Serverless Offline, gRPC via standalone server, frontend via Vite dev server

---

## Performance Comparison

The application now focuses on demonstrating the performance differences between HTTP and gRPC:

- **HTTP**: Traditional REST API calls with JSON payloads via serverless functions
- **gRPC**: High-performance RPC calls using Protocol Buffers via standalone server
- **Both**: Parallel execution for direct performance comparison
- **Real-time Metrics**: Duration, start/end times, and percentage improvements
- **Visual Indicators**: Color-coded performance cards and comparison charts

### ⚡ Pure Communication Testing

To get accurate performance comparisons, the app now includes:
- **Ping Endpoints**: Lightweight endpoints that only measure network communication time
- **Heavy Payload Endpoints**: Generate large data payloads (100KB, 500KB, 1MB) for significant performance testing
- **No AI Processing**: Performance tests bypass AI summarization to focus on protocol efficiency
- **Separate Testing**: Dedicated "Performance Testing Lab" section for communication-only measurements
- **Accurate Metrics**: True comparison between HTTP and gRPC without processing overhead

---

## Frontend Architecture

The application has a clear separation of concerns:

### 🚀 Performance Testing Lab
- **Dedicated Section**: Separate from business logic for focused performance testing
- **Protocol Selection**: Choose HTTP, gRPC, or both for comparison
- **Test Integration**: Uses text from the Standup Update section for performance testing
- **Heavy Payload Testing**: Test with 100KB, 500KB, and 1MB data payloads
- **Real-time Metrics**: Instant feedback on communication performance
- **Visual Comparison**: Side-by-side performance analysis with improvement percentages

### 📝 Standup Update Section
- **Business Logic**: Submit actual standup updates with AI summarization
- **Protocol Integration**: Uses selected protocol for creating updates
- **User Management**: User ID input and update submission
- **Clean Interface**: Focused on the core business functionality

### 📊 Performance Metrics Display
- **Integrated View**: Shows performance results within the testing lab
- **Protocol Comparison**: Clear HTTP vs gRPC performance analysis
- **Timing Details**: Start/end times and duration measurements
- **Improvement Calculations**: Percentage improvements and speed differences

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

### 2) Backend (Serverless Offline + Standalone gRPC)
```bash
cd backend
npm install
# copy env example and edit if needed
cp .env.example .env
# run all services including gRPC server
npm run dev
```
This starts:
- **GraphQL API** at `http://localhost:3001/graphql`
- **Summarizer (HTTP)** at `http://localhost:3002/summarize` (HTTP POST)
- **Summarizer (gRPC)** at `localhost:50051` (Standalone gRPC server)
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
- `GRPC_PORT` – gRPC server port (default: 50051)

> The default values match the docker-compose setup, so it should work out of the box.

---

## Usage

### 🚀 Performance Testing
1. **Navigate to Performance Testing Lab**: Top section of the application
2. **Select Protocol**: Choose HTTP, gRPC, or both for comparison
3. **Choose Test Type**:
   - **Light Test**: Click "Test Performance" for small payload testing
   - **Heavy Test**: Click "Test 100KB", "Test 500KB", or "Test 1MB" for large payload testing
4. **View Results**: See side-by-side comparison with timing and improvement metrics

### 📝 Business Operations
1. **Navigate to Standup Update Section**: Middle section of the application
2. **Enter User ID**: Provide your user identifier
3. **Write Update**: Enter your daily standup update text (this text is used for performance testing)
4. **Submit**: Create the update with AI summarization using selected protocol
5. **View Summaries**: See all updates in the summaries list below

### Protocol Selection
- **HTTP Only**: Traditional REST API calls via serverless functions
- **gRPC Only**: High-performance RPC calls via standalone gRPC server
- **Both**: Parallel execution for performance comparison

---

## Example GraphQL Queries

### Create an update with specific protocol
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
    "text": "Yesterday: fixed login bug; Today: implement caching; Blockers: flaky test in payments",
    "protocol": "grpc"
  }
}
```

### Test performance (communication only)
```graphql
query TestPerformance($text: String!, $protocol: String) {
  testPerformance(text: $text, protocol: $protocol) {
    success
    protocol
    result
    error
    timestamp
  }
}
```

### Test heavy payload performance
```graphql
query TestHeavyPayload($size_kb: Int!, $protocol: String) {
  testHeavyPayload(size_kb: $size_kb, protocol: $protocol) {
    success
    protocol
    message
    timestamp
    total_size_bytes
    chunk_count
    error
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

## Architecture

```
Frontend (React + TS)
    ↓
├── Performance Testing Lab (Protocol Selection + Testing)
├── Standup Update Section (Business Logic + Test Text)
└── Summaries Display
    ↓
GraphQL API (Port 3001)
    ↓
Protocol Router (HTTP/gRPC)
    ↓
Summarizer Service
├── HTTP Endpoint (Port 3002) - Serverless
└── gRPC Server (Port 50051) - Standalone Node.js
    ↓
Google Gemini AI
```

### Service Architecture
- **HTTP**: Runs via serverless functions (stateless, scalable)
- **gRPC**: Runs as standalone Node.js server (persistent, high-performance)
- **Performance**: True comparison between different architectures

---

## Testing
```bash
cd backend
npm test
```

### Performance Testing
```bash
cd backend
npm run performance
```

This runs a comprehensive test comparing HTTP vs gRPC performance with different payload sizes (100KB, 500KB, 1MB).

---