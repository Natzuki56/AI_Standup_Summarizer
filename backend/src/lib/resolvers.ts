
import axios from 'axios';
import { connectMongo, UpdateModel } from './mongo.js';
import { randomUUID } from 'crypto';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const summarizerBase = process.env.SUMMARIZER_BASE_URL || 'http://localhost:3002';
const grpcPort = process.env.GRPC_PORT || '50051';

// Load proto file for gRPC client
const PROTO_PATH = path.join(__dirname, '../../proto/summarizer.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const summarizerProto = grpc.loadPackageDefinition(packageDefinition) as any;

// Create gRPC client
const grpcClient = new summarizerProto.summarizer.SummarizerService(
  `localhost:${grpcPort}`,
  grpc.credentials.createInsecure()
);

async function callSummarizerService(text: string, protocol: 'http' | 'grpc' = 'http'): Promise<string> {
  if (protocol === 'grpc') {
    return new Promise((resolve, reject) => {
      grpcClient.Summarize({ text }, (err: any, response: any) => {
        if (err) {
          reject(new Error(err.message || 'gRPC call failed'));
          return;
        }
        resolve(response.summary || 'No summary');
      });
    });
  } else {
    // HTTP fallback
    const resp = await axios.post(`${summarizerBase}/summarize`, { text });
    return resp.data.summary || 'No summary';
  }
}

// Performance testing function - only measures communication time
async function testCommunicationPerformance(text: string, protocol: 'http' | 'grpc' = 'http'): Promise<any> {
  if (protocol === 'grpc') {
    return new Promise((resolve, reject) => {
      const deadline = new Date();
      deadline.setSeconds(deadline.getSeconds() + 10);
      
      grpcClient.Ping({ message: text }, { deadline }, (err: any, response: any) => {
        if (err) {
          reject(new Error(`gRPC ping failed: ${err.message}`));
          return;
        }
        resolve(response);
      });
    });
  } else {
    // HTTP ping
    const resp = await axios.post(`${summarizerBase}/ping`, { message: text });
    return resp.data;
  }
}

// Heavy payload testing function - measures performance with large data
async function testHeavyPayloadPerformance(sizeKb: number, protocol: 'http' | 'grpc' = 'http'): Promise<any> {
  if (protocol === 'grpc') {
    return new Promise((resolve, reject) => {
      const deadline = new Date();
      deadline.setSeconds(deadline.getSeconds() + 30); // Longer timeout for heavy payloads
      
      grpcClient.HeavyPayload({ message: 'test', size_kb: sizeKb }, { deadline }, (err: any, response: any) => {
        if (err) {
          reject(new Error(`gRPC heavy payload failed: ${err.message}`));
          return;
        }
        resolve(response);
      });
    });
  } else {
    // HTTP heavy payload
    const resp = await axios.post(`${summarizerBase}/heavy-payload`, { message: 'test', size_kb: sizeKb });
    return resp.data;
  }
}

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

  createUpdate: async ({ input, protocol = 'http' }: { input: { userId: string; text: string }; protocol?: 'http' | 'grpc' }) => {
    await connectMongo();
    
    // Call Summarizer service with specified protocol
    const summary = await callSummarizerService(input.text, protocol);

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

  // New performance testing endpoint
  testPerformance: async ({ text, protocol = 'http' }: { text: string; protocol?: 'http' | 'grpc' }) => {
    try {
      const result = await testCommunicationPerformance(text, protocol);
      return {
        success: true,
        protocol,
        result: JSON.stringify(result),
        error: null,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        protocol,
        result: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  },

  // New heavy payload testing endpoint
  testHeavyPayload: async ({ size_kb, protocol = 'http' }: { size_kb: number; protocol?: 'http' | 'grpc' }) => {
    try {
      const result = await testHeavyPayloadPerformance(size_kb, protocol);
      return {
        success: true,
        protocol,
        message: result.message,
        timestamp: result.timestamp,
        total_size_bytes: result.total_size_bytes,
        chunk_count: result.data_chunks ? result.data_chunks.length : 0,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        protocol,
        message: null,
        timestamp: null,
        total_size_bytes: 0,
        chunk_count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },
};
