import 'dotenv/config';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateRealisticData } from './lib/data-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load proto file
const PROTO_PATH = path.join(__dirname, '../proto/summarizer.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const summarizerProto = grpc.loadPackageDefinition(packageDefinition) as any;

async function summarizeWithGemini(text: string, apiKey: string): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Please provide a concise summary of this standup update. Focus on the key points from yesterday, today's plans, and any blockers. Keep it brief but informative:

${text}

Summary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate summary with Gemini API');
  }
}

// Create gRPC server
const server = new grpc.Server();

server.addService(summarizerProto.summarizer.SummarizerService.service, {
  Summarize: async (call: any, callback: any) => {
    const { text } = call.request;
    
    if (!text) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'text is required'
      });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      callback({
        code: grpc.status.INTERNAL,
        message: 'GEMINI_API_KEY environment variable is required'
      });
      return;
    }

    try {
      const summary = await summarizeWithGemini(text, apiKey);
      callback(null, { summary });
    } catch (error) {
      console.error('gRPC Summarization error:', error);
      callback({
        code: grpc.status.INTERNAL,
        message: 'Failed to generate summary'
      });
    }
  },

  Ping: async (call: any, callback: any) => {
    const { message } = call.request;
    
    try {
      // Just echo back the message with timestamp - no processing overhead
      callback(null, { 
        message: message || 'pong',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('gRPC Ping error:', error);
      callback({
        code: grpc.status.INTERNAL,
        message: 'Ping failed'
      });
    }
  },

  HeavyPayload: async (call: any, callback: any) => {
    const { message, size_kb = 1024 } = call.request; // Default to 1MB
    
    try {
      const data = generateRealisticData(size_kb);
      
      // Add response metadata
      const responseMetadata = {
        protocol: 'gRPC',
        efficiency_advantage: 'Protocol Buffers + HTTP/2'
      };
      
      callback(null, {
        message: data.message,
        timestamp: data.timestamp,
        users: data.users,
        transactions: data.transactions,
        logs: data.logs,
        actual_size_bytes: data.actual_size_bytes,
        generated_size_kb: data.generated_size_kb,
        response_metadata: JSON.stringify(responseMetadata)
      });
    } catch (error) {
      console.error('gRPC HeavyPayload error:', error);
      callback({
        code: grpc.status.INTERNAL,
        message: 'Heavy payload generation failed'
      });
    }
  }
});

// Start gRPC server
const grpcPort = process.env.GRPC_PORT || 50051;
server.bindAsync(`0.0.0.0:${grpcPort}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Failed to bind gRPC server:', err);
    process.exit(1);
  }
  console.log(`🚀 gRPC server running on port ${port}`);
  server.start();
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gRPC server...');
  server.tryShutdown(() => {
    console.log('✅ gRPC server stopped gracefully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gRPC server...');
  server.tryShutdown(() => {
    console.log('✅ gRPC server stopped gracefully');
    process.exit(0);
  });
});
