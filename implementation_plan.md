
# AI Standup Summarizer – HTTP vs gRPC Performance Comparison

## Goal
Deliver a fully functional localhost app that demonstrates and compares the performance differences between HTTP and gRPC communication protocols using Serverless Framework (offline Lambdas), MongoDB, MySQL, and a React+TS frontend with real-time performance metrics and clear separation of concerns.

---

## Phase 1 – Setup ✅
- [x] Initialize repo structure: `backend/`, `frontend/`, `docker-compose.yml`, `README.md`
- [x] Add Serverless Framework with `serverless-offline`

## Phase 2 – Databases ✅
- [x] Spin up MongoDB (logs/summaries) via Docker
- [x] Spin up MySQL (users/teams) via Docker
- [x] Seed or lazy-create schema as needed

## Phase 3 – Backend (Lambdas) ✅
### API Gateway (GraphQL)
- [x] Define schema: `CreateUpdate`, `Summary`, queries (`summaries`), mutations (`createUpdate`)
- [x] Implement resolvers to:
  - [x] Insert raw update (Mongo)
  - [x] Call Summarizer service over HTTP or gRPC based on protocol parameter
  - [x] Store summary (Mongo)
  - [x] Return combined payload
- [x] Add MySQL connection module for future user/team lookups

### Summarizer Service
- [x] **HTTP Endpoint**: If `GEMINI_API_KEY` present: call Google Gemini AI
- [x] **gRPC Server**: Protocol Buffer-based RPC server for high-performance communication
- [x] **Protocol Support**: Both HTTP and gRPC endpoints running simultaneously
- [x] **Error Handling**: Proper error responses for both protocols

### Notifier
- [x] Stub endpoint that would build a digest for a user/team
- [x] (Optional) Integrate with Slack/Email in future

### Testing
- [x] Jest tests for GraphQL resolvers (unit-ish)
- [x] Summarizer function tests (pure function)

## Phase 4 – Frontend ✅
- [x] Vite React + TS scaffold
- [x] **Protocol Selector**: Toggle between HTTP, gRPC, or both for comparison
- [x] **Performance Metrics**: Real-time display of request timing and comparison
- [x] Form to submit update text with protocol selection
- [x] List view for summaries with filtering by userId
- [x] **Performance Comparison**: Visual indicators and percentage improvements
- [x] Basic UX: loading/error, memoized list, small pagination

## Phase 5 – HTTP vs gRPC Performance Features ✅
- [x] **Protocol Buffer Definitions**: `.proto` files for gRPC services
- [x] **Dual Protocol Support**: Backend services support both HTTP and gRPC
- [x] **Performance Measurement**: Accurate timing for both protocols
- [x] **Parallel Execution**: Option to run both protocols simultaneously for comparison
- [x] **Visual Metrics**: Performance cards, comparison charts, and improvement percentages
- [x] **Protocol Routing**: Frontend can choose communication protocol per request

## Phase 6 – Performance Testing Separation ✅
- [x] **Dedicated Performance Testing Lab**: Separate section for protocol performance testing
- [x] **Business Logic Separation**: Standup update functionality isolated from performance testing
- [x] **Ping Endpoints**: Lightweight endpoints for pure communication measurement
- [x] **Clean Architecture**: Clear separation between testing and business operations
- [x] **Enhanced UX**: Better visual organization and user guidance

## Phase 7 – Local Run & Documentation ✅
- [x] `docker compose up -d`
- [x] `serverless offline` for all services (HTTP + gRPC)
- [x] `npm run dev` for frontend
- [x] Updated README with performance comparison features and examples
- [x] Architecture diagrams and protocol flow documentation

---

## Key Features Implemented

### Backend
- **Dual Protocol Support**: HTTP (REST) and gRPC (Protocol Buffers)
- **Protocol Selection**: GraphQL mutations accept protocol parameter
- **Performance Measurement**: Accurate timing for both protocols
- **Error Handling**: Proper error responses for both HTTP and gRPC
- **Ping Endpoints**: Lightweight communication testing without AI overhead

### Frontend
- **Performance Testing Lab**: Dedicated section for protocol performance testing
- **Standup Update Section**: Clean business logic interface
- **Protocol Toggle**: Radio buttons for HTTP, gRPC, or both
- **Performance Metrics**: Real-time display of communication timing
- **Comparison View**: Side-by-side performance comparison
- **Visual Indicators**: Color-coded performance cards and improvement metrics

### Architecture
- **Microservices**: API, Summarizer (HTTP + gRPC), Notifier
- **Protocol Routing**: Smart routing based on frontend selection
- **Parallel Execution**: Option to run both protocols simultaneously
- **Performance Analysis**: Comprehensive metrics and comparison tools
- **Separation of Concerns**: Clear distinction between testing and business operations

---

## Frontend Architecture

### 🚀 Performance Testing Lab
- **Purpose**: Dedicated protocol performance testing
- **Features**: Protocol selection, test messages, performance metrics
- **Benefits**: Focused testing environment, accurate measurements
- **Integration**: Uses ping endpoints for pure communication timing

### 📝 Standup Update Section
- **Purpose**: Business logic for creating standup updates
- **Features**: User ID input, update submission, AI summarization
- **Benefits**: Clean interface, focused functionality
- **Integration**: Uses selected protocol for service communication

### 📊 Performance Metrics Display
- **Purpose**: Visual representation of performance results
- **Features**: Timing details, comparison charts, improvement calculations
- **Benefits**: Clear performance analysis, actionable insights
- **Integration**: Embedded within performance testing lab

---

## Performance Comparison Results

The application now provides:
- **Real-time Metrics**: Duration, start/end times for each protocol
- **Direct Comparison**: Side-by-side performance analysis
- **Percentage Improvements**: Calculated speed improvements
- **Visual Feedback**: Color-coded performance indicators
- **Protocol Selection**: Choose optimal protocol for specific use cases
- **Clean Separation**: Performance testing isolated from business operations

This makes it an excellent tool for developers to understand the performance characteristics of HTTP vs gRPC in real-world scenarios, with a clear separation between testing and business functionality.
