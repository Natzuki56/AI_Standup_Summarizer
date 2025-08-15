
import { buildSchema } from 'graphql';

export const schema = buildSchema(`
  input CreateUpdateInput {
    userId: String!
    text: String!
  }

  type Update {
    id: ID!
    userId: String!
    text: String!
    summary: String!
    createdAt: String!
  }

  type Query {
    summaries(userId: String): [Update!]!
  }

  type Mutation {
    createUpdate(input: CreateUpdateInput!): Update!
  }
`);
