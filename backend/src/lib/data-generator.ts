/**
 * Common utility for generating realistic test data for performance testing
 * Used by both HTTP and gRPC implementations to ensure consistency
 */

export interface TestUser {
  id: string;
  name: string;
  email: string;
  profile: {
    age: number;
    location: string;
    preferences: {
      theme: 'dark' | 'light';
      language: 'en' | 'es' | 'fr';
      notifications: boolean;
    };
    settings: {
      privacy_level: number;
      auto_save: boolean;
      sync_frequency: number;
    };
  };
  activity: {
    last_login: string;
    login_count: number;
    status: 'active' | 'inactive' | 'suspended';
  };
}

export interface TestTransaction {
  id: string;
  user_id: string;
  amount: string;
  currency: 'USD' | 'EUR' | 'GBP';
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  timestamp: string;
  details: {
    category: 'food' | 'transport' | 'entertainment' | 'shopping' | 'other';
    merchant: string;
    location: string;
    tags: string[];
  };
}

export interface TestLogEntry {
  id: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  timestamp: string;
  source: string;
  user_id: string;
  context: {
    request_id: string;
    session_id: string;
    ip_address: string;
    user_agent: string;
    additional_data: {
      param1: string;
      param2: boolean;
      param3: number;
    };
  };
}

export interface TestData {
  message: string;
  timestamp: string;
  metadata: {
    generated_at: string;
    target_size_kb: number;
    version: string;
    test_type: string;
  };
  users: TestUser[];
  transactions: TestTransaction[];
  logs: TestLogEntry[];
  actual_size_bytes: number;
  processing_time_ms: number;
  generated_size_kb: number;
}

/**
 * Generate realistic test data for performance testing
 * @param sizeKb Target size in kilobytes
 * @returns Generated test data with realistic structure
 */
export function generateRealisticData(sizeKb: number): TestData {
  // Create a more complex data structure that mimics real-world scenarios
  const data: TestData = {
    message: "Heavy payload for performance testing",
    timestamp: new Date().toISOString(),
    metadata: {
      generated_at: new Date().toISOString(),
      target_size_kb: sizeKb,
      version: "1.0.0",
      test_type: "performance_comparison"
    },
    users: [],
    transactions: [],
    logs: [],
    actual_size_bytes: 0,
    processing_time_ms: 0,
    generated_size_kb: 0
  };

  // Generate realistic user data
  const numUsers = Math.ceil(sizeKb / 10); // Roughly 10KB per user
  for (let i = 0; i < numUsers; i++) {
    data.users.push({
      id: `user_${i}`,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      profile: {
        age: 25 + (i % 50),
        location: `City ${i % 100}`,
        preferences: {
          theme: i % 2 === 0 ? 'dark' : 'light',
          language: i % 3 === 0 ? 'en' : i % 3 === 1 ? 'es' : 'fr',
          notifications: i % 2 === 0
        },
        settings: {
          privacy_level: i % 3 + 1,
          auto_save: i % 2 === 0,
          sync_frequency: i % 4 + 1
        }
      },
      activity: {
        last_login: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        login_count: Math.floor(Math.random() * 1000),
        status: i % 3 === 0 ? 'active' : i % 3 === 1 ? 'inactive' : 'suspended'
      }
    });
  }

  // Generate transaction data
  const numTransactions = Math.ceil(sizeKb / 5); // Roughly 5KB per transaction
  for (let i = 0; i < numTransactions; i++) {
    data.transactions.push({
      id: `txn_${i}`,
      user_id: `user_${i % numUsers}`,
      amount: (Math.random() * 10000).toFixed(2),
      currency: i % 3 === 0 ? 'USD' : i % 3 === 1 ? 'EUR' : 'GBP',
      status: i % 4 === 0 ? 'completed' : i % 4 === 1 ? 'pending' : i % 4 === 2 ? 'failed' : 'cancelled',
      timestamp: new Date(Date.now() - Math.random() * 2592000000).toISOString(),
      details: {
        category: i % 5 === 0 ? 'food' : i % 5 === 1 ? 'transport' : i % 5 === 2 ? 'entertainment' : i % 5 === 3 ? 'shopping' : 'other',
        merchant: `Merchant ${i % 100}`,
        location: `Location ${i % 50}`,
        tags: [`tag${i % 10}`, `tag${(i + 1) % 10}`, `tag${(i + 2) % 10}`]
      }
    });
  }

  // Generate log data
  const numLogs = Math.ceil(sizeKb / 2); // Roughly 2KB per log entry
  for (let i = 0; i < numLogs; i++) {
    data.logs.push({
      id: `log_${i}`,
      level: i % 4 === 0 ? 'INFO' : i % 4 === 1 ? 'WARN' : i % 4 === 2 ? 'ERROR' : 'DEBUG',
      message: `This is a log message ${i} with some additional context information`,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      source: `service_${i % 10}`,
      user_id: `user_${i % numUsers}`,
      context: {
        request_id: `req_${i}`,
        session_id: `sess_${i % 100}`,
        ip_address: `192.168.1.${i % 255}`,
        user_agent: `Mozilla/5.0 (compatible; TestBot/${i % 10}.0)`,
        additional_data: {
          param1: `value${i}`,
          param2: i % 2 === 0,
          param3: Math.random() * 1000
        }
      }
    });
  }

  // Calculate actual size
  const jsonString = JSON.stringify(data);
  data.actual_size_bytes = jsonString.length;
  data.generated_size_kb = Math.round(jsonString.length / 1024);

  return data;
}
