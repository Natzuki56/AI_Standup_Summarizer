import React from 'react'
import { ProtocolSelector } from './ProtocolSelector'
import { PerformanceMetrics } from './PerformanceMetrics'
import { PerformanceMetrics as PerformanceMetricsType, ProtocolType } from '../types'

interface PerformanceTesterProps {
  protocol: ProtocolType
  loading: boolean
  error: string | null
  performanceMetrics: PerformanceMetricsType
  onProtocolChange: (protocol: ProtocolType) => void
  onPerformanceTest: () => void
  onHeavyPayloadTest: (sizeKb: number) => void
}

export const PerformanceTester: React.FC<PerformanceTesterProps> = ({
  protocol,
  loading,
  error,
  performanceMetrics,
  onProtocolChange,
  onPerformanceTest,
  onHeavyPayloadTest
}) => {
  return (
    <section style={{ 
      marginBottom: 24, 
      padding: 20, 
      border: '1px solid #e1e8ed', 
      borderRadius: 12,
      backgroundColor: '#f0f8ff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ 
        margin: '0 0 16px 0', 
        color: '#1e40af',
        fontSize: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🚀 Performance Testing Lab
      </h3>
      
      <p style={{
        margin: '0 0 20px 0',
        color: '#6b7280',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        Test and compare the communication performance between HTTP and gRPC protocols. 
        This section measures pure network communication time without any business logic overhead.
      </p>
      
      <ProtocolSelector 
        protocol={protocol}
        onProtocolChange={onProtocolChange}
      />
      
      <div style={{ 
        display: 'flex', 
        gap: 12, 
        flexWrap: 'wrap', 
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <button 
          onClick={onPerformanceTest}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            opacity: loading ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {loading ? '⏳ Testing...' : '⚡ Test Performance'}
        </button>
        
        <div style={{
          padding: '8px 16px',
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#92400e'
        }}>
          💡 Tip: Use "Both" protocol to compare HTTP vs gRPC side-by-side
        </div>
      </div>

      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#f9fafb',
        marginBottom: '16px'
      }}>
        <h4 style={{
          margin: '0 0 12px 0',
          color: '#374151',
          fontSize: '1rem'
        }}>
          🚛 Heavy Payload Testing
        </h4>
        <p style={{
          margin: '0 0 12px 0',
          color: '#6b7280',
          fontSize: '13px'
        }}>
          Test with larger data payloads to see more significant performance differences between HTTP and gRPC.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => onHeavyPayloadTest(100)}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              opacity: loading ? 0.6 : 1
            }}
          >
            Test 100KB
          </button>
          <button 
            onClick={() => onHeavyPayloadTest(500)}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              opacity: loading ? 0.6 : 1
            }}
          >
            Test 500KB
          </button>
          <button 
            onClick={() => onHeavyPayloadTest(1024)}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              opacity: loading ? 0.6 : 1
            }}
          >
            Test 1MB
          </button>
        </div>
      </div>
      
      {error && (
        <div style={{ 
          marginTop: 16,
          padding: '12px 16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#dc2626',
          fontSize: '14px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <PerformanceMetrics metrics={performanceMetrics} />
    </section>
  )
}
