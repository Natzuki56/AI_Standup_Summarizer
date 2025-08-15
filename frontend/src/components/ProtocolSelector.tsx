import React from 'react'
import { ProtocolType } from '../types'

interface ProtocolSelectorProps {
  protocol: ProtocolType
  onProtocolChange: (protocol: ProtocolType) => void
}

export const ProtocolSelector: React.FC<ProtocolSelectorProps> = ({
  protocol,
  onProtocolChange
}) => {
  return (
    <div className="protocol-selector" style={{
      marginBottom: 16,
      padding: '16px',
      border: '1px solid #e1e8ed',
      borderRadius: 8,
      backgroundColor: '#ffffff'
    }}>
      <label className="protocol-label" style={{
        display: 'block',
        marginBottom: '12px',
        fontWeight: '600',
        color: '#2c3e50',
        fontSize: '14px'
      }}>
        Communication Protocol:
      </label>
      <div className="protocol-options" style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <label className="protocol-option" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          backgroundColor: protocol === 'http' ? '#e3f2fd' : '#ffffff',
          borderColor: protocol === 'http' ? '#2196f3' : '#ddd'
        }}>
          <input
            type="radio"
            name="protocol"
            value="http"
            checked={protocol === 'http'}
            onChange={(e) => onProtocolChange(e.target.value as ProtocolType)}
            style={{ margin: 0 }}
          />
          <span>HTTP</span>
        </label>
        <label className="protocol-option" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          backgroundColor: protocol === 'grpc' ? '#e8f5e8' : '#ffffff',
          borderColor: protocol === 'grpc' ? '#4caf50' : '#ddd'
        }}>
          <input
            type="radio"
            name="protocol"
            value="grpc"
            checked={protocol === 'grpc'}
            onChange={(e) => onProtocolChange(e.target.value as ProtocolType)}
            style={{ margin: 0 }}
          />
          <span>gRPC</span>
        </label>
        <label className="protocol-option" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          backgroundColor: protocol === 'both' ? '#fff3e0' : '#ffffff',
          borderColor: protocol === 'both' ? '#ff9800' : '#ddd'
        }}>
          <input
            type="radio"
            name="protocol"
            value="both"
            checked={protocol === 'both'}
            onChange={(e) => onProtocolChange(e.target.value as ProtocolType)}
            style={{ margin: 0 }}
          />
          <span>Both (Compare)</span>
        </label>
      </div>
    </div>
  )
}
