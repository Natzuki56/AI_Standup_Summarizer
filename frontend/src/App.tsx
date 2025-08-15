
import React from 'react'
import { Header, Layout, NewUpdateForm, SummariesList } from './components'
import { useStandupApi } from './hooks/useStandupApi'

const App: React.FC = () => {
  const {
    userId,
    text,
    summaries,
    loading,
    error,
    setUserId,
    setText,
    createUpdate,
    fetchSummaries
  } = useStandupApi()

  return (
    <Layout>
      <Header title="AI Standup Summarizer (Local)" />
      
      <NewUpdateForm
        userId={userId}
        text={text}
        loading={loading}
        error={error}
        onUserIdChange={setUserId}
        onTextChange={setText}
        onSubmit={createUpdate}
        onRefresh={fetchSummaries}
      />
      
      <SummariesList
        summaries={summaries}
        loading={loading}
      />
    </Layout>
  )
}

export default App
