import React from 'react'
import { PerformanceMetrics as PerformanceMetricsType } from '../types'

interface PerformanceMetricsProps {
  metrics: PerformanceMetricsType
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  if (!metrics.http && !metrics.grpc) {
    return null
  }

  const formatDuration = (duration: number) => `${duration}ms`

  return (
    <div className="performance-metrics" style={{
      marginBottom: 24,
      padding: 20,
      border: '1px solid #e1e8ed',
      borderRadius: 12,
      backgroundColor: '#f8f9fa',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{
        margin: '0 0 16px 0',
        color: '#2c3e50',
        fontSize: '1.25rem'
      }}>
        🚀 Communication Performance Metrics
      </h3>
      
      <p style={{
        margin: '0 0 16px 0',
        color: '#6c757d',
        fontSize: '14px',
        fontStyle: 'italic'
      }}>
        Pure network communication time between services (no AI processing overhead)
      </p>
      
      <div className="metrics-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {metrics.http && (
          <div className="metric-card http" style={{
            padding: '16px',
            border: '2px solid #2196f3',
            borderRadius: '8px',
            backgroundColor: '#e3f2fd'
          }}>
            <h4 style={{
              margin: '0 0 12px 0',
              color: '#1976d2',
              fontSize: '1.1rem'
            }}>
              🌐 HTTP
            </h4>
            <div className="metric-item" style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span className="label" style={{ fontWeight: '600' }}>Duration:</span>
              <span className="value" style={{ color: '#1976d2' }}>{formatDuration(metrics.http.duration)}</span>
            </div>
            <div className="metric-item" style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span className="label" style={{ fontWeight: '600' }}>Start:</span>
              <span className="value">{new Date(metrics.http.startTime).toLocaleTimeString()}</span>
            </div>
            <div className="metric-item" style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span className="label" style={{ fontWeight: '600' }}>End:</span>
              <span className="value">{new Date(metrics.http.endTime).toLocaleTimeString()}</span>
            </div>
          </div>
        )}
        
        {metrics.grpc && (
          <div className="metric-card grpc" style={{
            padding: '16px',
            border: '2px solid #4caf50',
            borderRadius: '8px',
            backgroundColor: '#e8f5e8'
          }}>
            <h4 style={{
              margin: '0 0 12px 0',
              color: '#2e7d32',
              fontSize: '1.1rem'
            }}>
              ⚡ gRPC
            </h4>
            <div className="metric-item" style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span className="label" style={{ fontWeight: '600' }}>Duration:</span>
              <span className="value" style={{ color: '#2e7d32' }}>{formatDuration(metrics.grpc.duration)}</span>
            </div>
            <div className="metric-item" style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span className="label" style={{ fontWeight: '600' }}>Start:</span>
              <span className="value">{new Date(metrics.grpc.startTime).toLocaleTimeString()}</span>
            </div>
            <div className="metric-item" style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span className="label" style={{ fontWeight: '600' }}>End:</span>
              <span className="value">{new Date(metrics.grpc.endTime).toLocaleTimeString()}</span>
            </div>
          </div>
        )}
      </div>
      
      {metrics.http && metrics.grpc && (
        <div className="comparison" style={{
          padding: '16px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#ffffff'
        }}>
          <h4 style={{
            margin: '0 0 12px 0',
            color: '#2c3e50',
            fontSize: '1.1rem'
          }}>
            📊 Performance Comparison
          </h4>
          <div className="comparison-item" style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            padding: '8px 0',
            borderBottom: '1px solid #eee'
          }}>
            <span className="label" style={{ fontWeight: '600' }}>HTTP vs gRPC:</span>
            <span className={`value ${metrics.http.duration < metrics.grpc.duration ? 'faster' : 'slower'}`} style={{
              color: metrics.http.duration < metrics.grpc.duration ? '#4caf50' : '#f44336',
              fontWeight: '600'
            }}>
              {metrics.http.duration < metrics.grpc.duration 
                ? `HTTP is ${metrics.grpc.duration - metrics.http.duration}ms faster`
                : `gRPC is ${metrics.http.duration - metrics.grpc.duration}ms faster`
              }
            </span>
          </div>
          <div className="comparison-item" style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            padding: '8px 0'
          }}>
            <span className="label" style={{ fontWeight: '600' }}>Speed improvement:</span>
            <span className="value" style={{
              color: '#ff9800',
              fontWeight: '600'
            }}>
              {Math.round(
                ((Math.max(metrics.http.duration, metrics.grpc.duration) - Math.min(metrics.http.duration, metrics.grpc.duration)) / 
                Math.max(metrics.http.duration, metrics.grpc.duration)) * 100
              )}%
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
