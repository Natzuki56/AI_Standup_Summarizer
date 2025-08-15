import { useCallback, useEffect, useMemo, useState } from 'react'
import { Update, CreateUpdateInput, PerformanceMetrics, ProtocolType } from '../types'

const GQL_URL = 'http://localhost:3001/graphql'

export const useStandupApi = () => {
  const [userId, setUserId] = useState('u123')
  const [text, setText] = useState('Yesterday: fixed login bug\nToday: implement caching\nBlockers: flaky test in payments')
  const [summaries, setSummaries] = useState<Update[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [protocol, setProtocol] = useState<ProtocolType>('http')
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({})

  const fetchSummaries = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const resp = await fetch(GQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `query GetSummaries($userId: String) {
            summaries(userId: $userId) { id userId text summary createdAt }
          }`,
          variables: { userId: userId || null }
        })
      })
      const data = await resp.json()
      setSummaries(data.data.summaries || [])
    } catch (e: any) {
      setError(e.message || 'Failed to fetch summaries')
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Dedicated performance testing function
  const testPerformance = useCallback(async () => {
    setLoading(true)
    setError(null)
    setPerformanceMetrics({})
    
    try {
      if (protocol === 'both') {
        // Test both protocols in parallel for pure communication comparison
        const startTime = Date.now()
        
        const [httpResult, grpcResult] = await Promise.allSettled([
          // HTTP performance test
          (async () => {
            const httpStart = Date.now()
            const resp = await fetch(GQL_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: `query TestPerformance($text: String!, $protocol: String) {
                  testPerformance(text: $text, protocol: $protocol) { success protocol result error timestamp }
                }`,
                variables: { text: text.substring(0, 100), protocol: 'http' }
              })
            })
            const data = await resp.json()
            if (data.errors) throw new Error(data.errors[0].message)
            const httpEnd = Date.now()
            return { data, duration: httpEnd - httpStart }
          })(),
          
          // gRPC performance test
          (async () => {
            const grpcStart = Date.now()
            const resp = await fetch(GQL_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: `query TestPerformance($text: String!, $protocol: String) {
                  testPerformance(text: $text, protocol: $protocol) { success protocol result error timestamp }
                }`,
                variables: { text: text.substring(0, 100), protocol: 'grpc' }
              })
            })
            const data = await resp.json()
            if (data.errors) throw new Error(data.errors[0].message)
            const grpcEnd = Date.now()
            return { data, duration: grpcEnd - grpcStart }
          })()
        ])

        const endTime = Date.now()
        
        // Set performance metrics for communication only
        setPerformanceMetrics({
          http: httpResult.status === 'fulfilled' ? {
            startTime: startTime,
            endTime: startTime + httpResult.value.duration,
            duration: httpResult.value.duration
          } : undefined,
          grpc: grpcResult.status === 'fulfilled' ? {
            startTime: startTime,
            endTime: startTime + grpcResult.value.duration,
            duration: grpcResult.value.duration
          } : undefined
        })

        // Show results
        if (httpResult.status === 'fulfilled' && grpcResult.status === 'fulfilled') {
          console.log('Performance test completed:', {
            http: httpResult.value.data.data.testPerformance,
            grpc: grpcResult.value.data.data.testPerformance
          })
        }
      } else {
        // Single protocol performance test
        const startTime = Date.now()
        const resp = await fetch(GQL_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `query TestPerformance($text: String!, $protocol: String) {
              testPerformance(text: $text, protocol: $protocol) { success protocol result error timestamp }
            }`,
            variables: { text: text.substring(0, 100), protocol }
          })
        })
        const data = await resp.json()
        if (data.errors) throw new Error(data.errors[0].message)
        
        const endTime = Date.now()
        setPerformanceMetrics({
          [protocol]: {
            startTime,
            endTime,
            duration: endTime - startTime
          }
        })
        
        console.log('Performance test completed:', data.data.testPerformance)
      }
    } catch (e: any) {
      setError(e.message || 'Performance test failed')
    } finally {
      setLoading(false)
    }
  }, [text, protocol])

  // Heavy payload performance testing function
  const testHeavyPayload = useCallback(async (sizeKb: number = 1024) => {
    setLoading(true)
    setError(null)
    setPerformanceMetrics({})
    
    try {
      if (protocol === 'both') {
        // Test both protocols in parallel for heavy payload comparison
        const startTime = Date.now()
        
        const [httpResult, grpcResult] = await Promise.allSettled([
          // HTTP heavy payload test
          (async () => {
            const httpStart = Date.now()
            const resp = await fetch(GQL_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: `query TestHeavyPayload($size_kb: Int!, $protocol: String) {
                  testHeavyPayload(size_kb: $size_kb, protocol: $protocol) { 
                    success protocol message timestamp total_size_bytes chunk_count error 
                  }
                }`,
                variables: { size_kb: sizeKb, protocol: 'http' }
              })
            })
            const data = await resp.json()
            if (data.errors) throw new Error(data.errors[0].message)
            const httpEnd = Date.now()
            return { data, duration: httpEnd - httpStart }
          })(),
          
          // gRPC heavy payload test
          (async () => {
            const grpcStart = Date.now()
            const resp = await fetch(GQL_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: `query TestHeavyPayload($size_kb: Int!, $protocol: String) {
                  testHeavyPayload(size_kb: $size_kb, protocol: $protocol) { 
                    success protocol message timestamp total_size_bytes chunk_count error 
                  }
                }`,
                variables: { size_kb: sizeKb, protocol: 'grpc' }
              })
            })
            const data = await resp.json()
            if (data.errors) throw new Error(data.errors[0].message)
            const grpcEnd = Date.now()
            return { data, duration: grpcEnd - grpcStart }
          })()
        ])

        const endTime = Date.now()
        
        // Set performance metrics for heavy payload
        setPerformanceMetrics({
          http: httpResult.status === 'fulfilled' ? {
            startTime: startTime,
            endTime: startTime + httpResult.value.duration,
            duration: httpResult.value.duration
          } : undefined,
          grpc: grpcResult.status === 'fulfilled' ? {
            startTime: startTime,
            endTime: startTime + grpcResult.value.duration,
            duration: grpcResult.value.duration
          } : undefined
        })

        // Show results
        if (httpResult.status === 'fulfilled' && grpcResult.status === 'fulfilled') {
          console.log('Heavy payload test completed:', {
            http: httpResult.value.data.data.testHeavyPayload,
            grpc: grpcResult.value.data.data.testHeavyPayload
          })
        }
      } else {
        // Single protocol heavy payload test
        const startTime = Date.now()
        const resp = await fetch(GQL_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `query TestHeavyPayload($size_kb: Int!, $protocol: String) {
              testHeavyPayload(size_kb: $size_kb, protocol: $protocol) { 
                success protocol message timestamp total_size_bytes chunk_count error 
              }
            }`,
            variables: { size_kb: sizeKb, protocol }
          })
        })
        const data = await resp.json()
        if (data.errors) throw new Error(data.errors[0].message)
        
        const endTime = Date.now()
        setPerformanceMetrics({
          [protocol]: {
            startTime,
            endTime,
            duration: endTime - startTime
          }
        })
        
        console.log('Heavy payload test completed:', data.data.testHeavyPayload)
      }
    } catch (e: any) {
      setError(e.message || 'Heavy payload test failed')
    } finally {
      setLoading(false)
    }
  }, [protocol])

  const createUpdate = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Regular business logic - no performance measurement
      const resp = await fetch(GQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation CreateUpdate($input: CreateUpdateInput!) {
            createUpdate(input: $input) { id userId text summary createdAt }
          }`,
          variables: { input: { userId, text, protocol } }
        })
      })
      const data = await resp.json()
      if (data.errors) throw new Error(data.errors[0].message)
      
      await fetchSummaries()
    } catch (e: any) {
      setError(e.message || 'Failed to create update')
    } finally {
      setLoading(false)
    }
  }, [userId, text, protocol, fetchSummaries])

  useEffect(() => {
    fetchSummaries()
  }, [fetchSummaries])

  const sortedSummaries = useMemo(() => {
    return [...summaries].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [summaries])

  return {
    // State
    userId,
    text,
    summaries: sortedSummaries,
    loading,
    error,
    protocol,
    performanceMetrics,
    
    // Actions
    setUserId,
    setText,
    setProtocol,
    createUpdate,
    fetchSummaries,
    testPerformance,
    testHeavyPayload,
    
    // Computed
    hasSummaries: summaries.length > 0
  }
}
