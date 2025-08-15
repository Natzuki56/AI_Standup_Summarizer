import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load proto file
const PROTO_PATH = path.join(__dirname, 'proto/summarizer.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const summarizerProto = grpc.loadPackageDefinition(packageDefinition);

// Create gRPC client
const client = new summarizerProto.summarizer.SummarizerService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

console.log('🧪 Testing gRPC connection...');

// Test the connection
client.Summarize({ text: 'Test standup update' }, (err, response) => {
  if (err) {
    console.error('❌ gRPC test failed:', err.message);
    console.log('\n💡 Make sure the gRPC server is running:');
    console.log('   npm run dev:grpc');
    process.exit(1);
  } else {
    console.log('✅ gRPC test successful!');
    console.log('📝 Response:', response.summary);
    process.exit(0);
  }
});
