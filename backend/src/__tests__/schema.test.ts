
import { describe, it, expect } from '@jest/globals';
import { schema } from '../lib/schema';

describe('GraphQL schema', () => {
  it('has expected root types', () => {
    expect(schema.getQueryType()?.name).toBe('Query');
    expect(schema.getMutationType()?.name).toBe('Mutation');
  });
});
