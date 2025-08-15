
import 'dotenv/config';
import express from 'express';
import serverless from 'serverless-http';
import { graphqlHTTP } from 'express-graphql';
import { schema } from '../lib/schema.js';
import { root } from '../lib/resolvers.js';

const app = express();
app.use(express.json());

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

export const graphql = serverless(app);
