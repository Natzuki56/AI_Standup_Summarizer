
import axios from 'axios';
import { connectMongo, UpdateModel } from './mongo.js';
import { randomUUID } from 'crypto';

const summarizerBase = process.env.SUMMARIZER_BASE_URL || 'http://localhost:3002';

export const root = {
  summaries: async ({ userId }: { userId?: string }) => {
    await connectMongo();
    const q = userId ? { userId } : {};
    const results = await UpdateModel.find(q).sort({ createdAt: -1 }).limit(100).lean();
    return results.map((r: any) => ({
      id: r._id.toString(),
      userId: r.userId,
      text: r.text,
      summary: r.summary,
      createdAt: r.createdAt.toISOString(),
    }));
  },

  createUpdate: async ({ input }: { input: { userId: string; text: string } }) => {
    await connectMongo();
    // Call Summarizer service
    const resp = await axios.post(`${summarizerBase}/summarize`, { text: input.text });
    const summary = resp.data.summary || 'No summary';

    const doc = await UpdateModel.create({
      userId: input.userId,
      text: input.text,
      summary,
    });

    return {
      id: doc._id.toString(),
      userId: doc.userId,
      text: doc.text,
      summary: doc.summary,
      createdAt: doc.createdAt.toISOString(),
    };
  },
};
