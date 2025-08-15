import axios from 'axios';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load proto file for gRPC client
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
const grpcClient = new summarizerProto.summarizer.SummarizerService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// Test HTTP performance
async function testHttpPerformance(sizeKb) {
  const startTime = Date.now();
  try {
    const response = await axios.post('http://localhost:3002/heavy-payload', {
      message: 'test',
      size_kb: sizeKb
    });
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`🌐 HTTP ${sizeKb}KB Test:`);
    console.log(`   Duration: ${duration}ms`);
    console.log(`   Response Size: ${response.data.response_metadata?.response_size_bytes || 'N/A'} bytes`);
    console.log(`   Protocol: ${response.data.response_metadata?.protocol || 'N/A'}`);
    console.log('');
    
    return { success: true, duration, data: response.data };
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`🌐 HTTP ${sizeKb}KB Test: FAILED`);
    console.log(`   Duration: ${duration}ms`);
    console.log(`   Error: ${error.message}`);
    console.log('');
    return { success: false, duration, error: error.message };
  }
}

// Test gRPC performance
function testGrpcPerformance(sizeKb) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    grpcClient.HeavyPayload({ message: 'test', size_kb: sizeKb }, (err, response) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (err) {
        console.log(`⚡ gRPC ${sizeKb}KB Test: FAILED`);
        console.log(`   Duration: ${duration}ms`);
        console.log(`   Error: ${err.message}`);
        console.log('');
        resolve({ success: false, duration, error: err.message });
        return;
      }
      
      console.log(`⚡ gRPC ${sizeKb}KB Test:`);
      console.log(`   Duration: ${duration}ms`);
      console.log(`   Response Size: ${response.actual_size_bytes || 'N/A'} bytes`);
      console.log(`   Protocol: ${JSON.parse(response.response_metadata || '{}').protocol || 'N/A'}`);
      console.log(`   Advantage: ${JSON.parse(response.response_metadata || '{}').efficiency_advantage || 'N/A'}`);
      console.log('');
      
      resolve({ success: true, duration, data: response });
    });
  });
}

// Run performance comparison
async function runPerformanceComparison() {
  console.log('🚀 Starting Performance Comparison Test...\n');
  
  const testSizes = [100, 500, 1024]; // 100KB, 500KB, 1MB
  
  for (const size of testSizes) {
    console.log(`📊 Testing ${size}KB payloads:`);
    console.log('=' .repeat(50));
    
    // Test HTTP
    const httpResult = await testHttpPerformance(size);
    
    // Test gRPC
    const grpcResult = await testGrpcPerformance(size);
    
    // Compare results
    if (httpResult.success && grpcResult.success) {
      const httpDuration = httpResult.duration;
      const grpcDuration = grpcResult.duration;
      const difference = httpDuration - grpcDuration;
      const percentage = Math.round((difference / httpDuration) * 100);
      
      console.log(`📈 ${size}KB Performance Comparison:`);
      if (grpcDuration < httpDuration) {
        console.log(`   🎉 gRPC is ${difference}ms faster (${percentage}% improvement)`);
      } else {
        console.log(`   📉 HTTP is ${Math.abs(difference)}ms faster (${Math.abs(percentage)}% improvement)`);
      }
      console.log(`   HTTP: ${httpDuration}ms | gRPC: ${grpcDuration}ms`);
    }
    
    console.log('');
    console.log('-' .repeat(50));
    console.log('');
  }
  
  console.log('✅ Performance comparison completed!');
}

// Run the test
runPerformanceComparison().catch(console.error);
