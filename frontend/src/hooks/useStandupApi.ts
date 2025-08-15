import { useCallback, useEffect, useMemo, useState } from 'react'
import { Update, CreateUpdateInput } from '../types'

const GQL_URL = 'http://localhost:3001/graphql'

export const useStandupApi = () => {
  const [userId, setUserId] = useState('u123')
  const [text, setText] = useState('Yesterday: fixed login bug\nToday: implement caching\nBlockers: flaky test in payments')
  const [summaries, setSummaries] = useState<Update[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const createUpdate = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const resp = await fetch(GQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation CreateUpdate($input: CreateUpdateInput!) {
            createUpdate(input: $input) { id userId text summary createdAt }
          }`,
          variables: { input: { userId, text } }
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
  }, [userId, text, fetchSummaries])

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
    
    // Actions
    setUserId,
    setText,
    createUpdate,
    fetchSummaries,
    
    // Computed
    hasSummaries: summaries.length > 0
  }
}
