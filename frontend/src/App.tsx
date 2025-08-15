
import React from 'react'
import { Header, Layout, NewUpdateForm, SummariesList, PerformanceTester } from './components'
import { useStandupApi } from './hooks/useStandupApi'

const App: React.FC = () => {
  const {
    userId,
    text,
    summaries,
    loading,
    error,
    protocol,
    performanceMetrics,
    setUserId,
    setText,
    setProtocol,
    createUpdate,
    fetchSummaries,
    testPerformance,
    testHeavyPayload
  } = useStandupApi()

  return (
    <Layout>
      <Header title="AI Standup Summarizer - HTTP vs gRPC Performance" />
      
      <PerformanceTester
        protocol={protocol}
        loading={loading}
        error={error}
        performanceMetrics={performanceMetrics}
        onProtocolChange={setProtocol}
        onPerformanceTest={testPerformance}
        onHeavyPayloadTest={testHeavyPayload}
      />
      
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
