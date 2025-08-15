import React from 'react'
import { Update } from '../types'

interface SummaryItemProps {
  update: Update
}

const SummaryItem: React.FC<SummaryItemProps> = ({ update }) => {
  return (
    <li style={{ 
      marginBottom: 16,
      padding: 16,
      border: '1px solid #e9ecef',
      borderRadius: 8,
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 8
      }}>
        <strong style={{ 
          color: '#495057',
          fontSize: '16px'
        }}>
          {update.userId}
        </strong>
        <small style={{ 
          color: '#6c757d',
          fontSize: '12px'
        }}>
          {new Date(update.createdAt).toLocaleString()}
        </small>
      </div>
      
      <div style={{ 
        whiteSpace: 'pre-wrap',
        marginBottom: 12,
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: 6,
        border: '1px solid #e9ecef'
      }}>
        <em style={{ color: '#495057' }}>{update.summary}</em>
      </div>
      
      <details style={{ fontSize: '14px' }}>
        <summary style={{ 
          cursor: 'pointer',
          color: '#6c757d',
          fontWeight: '500',
          userSelect: 'none'
        }}>
          Raw text
        </summary>
        <pre style={{ 
          background: '#f8f9fa', 
          padding: 12, 
          margin: '8px 0 0 0',
          borderRadius: 4,
          border: '1px solid #e9ecef',
          fontSize: '13px',
          lineHeight: '1.4',
          overflow: 'auto',
          whiteSpace: 'pre-wrap'
        }}>
          {update.text}
        </pre>
      </details>
    </li>
  )
}

export default SummaryItem
