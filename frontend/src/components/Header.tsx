import React from 'react'

interface HeaderProps {
  title: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header style={{ textAlign: 'center', marginBottom: '32px' }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: '600', 
        color: '#2c3e50',
        margin: 0,
        padding: '20px 0'
      }}>
        {title}
      </h1>
    </header>
  )
}

export default Header
