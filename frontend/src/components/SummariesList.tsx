import React from 'react'
import { Update } from '../types'
import SummaryItem from './SummaryItem'

interface SummariesListProps {
  summaries: Update[]
  loading: boolean
}

const SummariesList: React.FC<SummariesListProps> = ({ summaries, loading }) => {
  if (loading) {
    return (
      <section style={{ 
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
          Summaries
        </h3>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: '#6c757d'
        }}>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>Loading...</div>
          <div style={{ fontSize: '14px' }}>Fetching your summaries</div>
        </div>
      </section>
    )
  }

  if (summaries.length === 0) {
    return (
      <section style={{ 
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
          Summaries
        </h3>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: '#6c757d'
        }}>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>No summaries yet</div>
          <div style={{ fontSize: '14px' }}>Submit your first standup update above</div>
        </div>
      </section>
    )
  }

  return (
    <section style={{ 
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
        Summaries ({summaries.length})
      </h3>
      
      <ul style={{ 
        listStyle: 'none', 
        padding: 0, 
        margin: 0 
      }}>
        {summaries.map(update => (
          <SummaryItem key={update.id} update={update} />
        ))}
      </ul>
    </section>
  )
}

export default SummariesList
