import React from 'react'

interface NewUpdateFormProps {
  userId: string
  text: string
  loading: boolean
  error: string | null
  onUserIdChange: (userId: string) => void
  onTextChange: (text: string) => void
  onSubmit: () => void
  onRefresh: () => void
}

const NewUpdateForm: React.FC<NewUpdateFormProps> = ({
  userId,
  text,
  loading,
  error,
  onUserIdChange,
  onTextChange,
  onSubmit,
  onRefresh
}) => {
  return (
    <section style={{ 
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
        fontSize: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        📝 Standup Update
      </h3>
      
      <p style={{
        margin: '0 0 16px 0',
        color: '#6b7280',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        Submit your daily standup update. The system will automatically generate an AI-powered summary.
      </p>
      
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          placeholder="User ID"
          value={userId}
          onChange={e => onUserIdChange(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: 6,
            fontSize: '14px',
            flex: 1
          }}
        />
      </div>
      
      <textarea
        rows={6}
        placeholder="Enter your standup update..."
        value={text}
        onChange={e => onTextChange(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          border: '1px solid #ddd',
          borderRadius: 6,
          fontSize: '14px',
          fontFamily: 'inherit',
          resize: 'vertical',
          minHeight: '120px',
          marginBottom: 16
        }}
      />
      
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button 
          onClick={onSubmit} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            opacity: loading ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {loading ? '⏳ Submitting...' : '📤 Submit Update'}
        </button>
        
        <button 
          onClick={onRefresh} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            opacity: loading ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🔄 Refresh
        </button>
      </div>
      
      {error && (
        <p style={{ 
          color: '#dc3545', 
          margin: '12px 0 0 0',
          fontSize: '14px',
          padding: '8px 12px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: 4
        }}>
          {error}
        </p>
      )}
    </section>
  )
}

export default NewUpdateForm
