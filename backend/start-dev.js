import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
function loadEnv() {
  try {
    const envPath = join(__dirname, '.env');
    const envContent = readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          envVars[key] = valueParts.join('=');
        }
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error loading .env file:', error.message);
    return {};
  }
}

// Start a service
function startService(name, config, port) {
  console.log(`Starting ${name} service on port ${port}...`);
  
  const child = spawn('npx', ['serverless', 'offline', '--config', config], {
    stdio: 'inherit',
    env: { ...process.env, [name + '_PORT']: port.toString() }
  });
  
  child.on('error', (error) => {
    console.error(`Error starting ${name} service:`, error);
  });
  
  child.on('exit', (code) => {
    console.log(`${name} service exited with code ${code}`);
  });
  
  return child;
}

// Main function
async function main() {
  const env = loadEnv();
  
  // Set default values
  const apiPort = env.API_PORT || '3001';
  const summarizerPort = env.SUMMARIZER_PORT || '3002';
  const notifierPort = env.NOTIFIER_PORT || '3003';
  
  console.log('Starting services with environment variables:');
  console.log(`API_PORT: ${apiPort}`);
  console.log(`SUMMARIZER_PORT: ${summarizerPort}`);
  console.log(`NOTIFIER_PORT: ${notifierPort}`);
  console.log('');
  
  // Start all services
  const api = startService('API', 'serverless.api.yml', apiPort);
  const summarizer = startService('SUMMARIZER', 'serverless.summarizer.yml', summarizerPort);
  const notifier = startService('NOTIFIER', 'serverless.notifier.yml', notifierPort);
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\nShutting down services...');
    api.kill('SIGINT');
    summarizer.kill('SIGINT');
    notifier.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\nShutting down services...');
    api.kill('SIGTERM');
    summarizer.kill('SIGTERM');
    notifier.kill('SIGTERM');
    process.exit(0);
  });
}

main().catch(console.error);
