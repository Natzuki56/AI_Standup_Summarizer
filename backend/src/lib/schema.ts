
import { buildSchema } from 'graphql';

export const schema = buildSchema(`
  input CreateUpdateInput {
    userId: String!
    text: String!
    protocol: String
  }

  type Update {
    id: ID!
    userId: String!
    text: String!
    summary: String!
    createdAt: String!
  }

  type PerformanceTestResult {
    success: Boolean!
    protocol: String!
    result: String
    error: String
    timestamp: String!
  }

  type HeavyPayloadTestResult {
    success: Boolean!
    protocol: String!
    message: String
    timestamp: String
    total_size_bytes: Int
    chunk_count: Int
    error: String
  }

  type Query {
    summaries(userId: String): [Update!]!
    testPerformance(text: String!, protocol: String): PerformanceTestResult!
    testHeavyPayload(size_kb: Int!, protocol: String): HeavyPayloadTestResult!
  }

  type Mutation {
    createUpdate(input: CreateUpdateInput!): Update!
  }
`);
