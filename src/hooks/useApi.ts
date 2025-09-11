import { useState, useCallback } from 'react'
import { apiUtils } from '../lib/utils'

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export const useApi = <T = any>(options: UseApiOptions = {}) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall()
      setData(result)
      options.onSuccess?.(result)
      return result
    } catch (err) {
      const errorMessage = apiUtils.handleApiError(err)
      setError(errorMessage)
      options.onError?.(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [options])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    loading,
    error,
    execute,
    reset
  }
}