import { useEffect, useState } from 'react'
import { getDecadas, type Decada } from '../../services/decadas.service'

interface UseDecadasResult {
  decadas: Decada[]
  loading: boolean
  error: string | null
}

export function useDecadas(): UseDecadasResult {
  const [decadas, setDecadas] = useState<Decada[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    getDecadas()
      .then((data) => {
        if (!cancelled) setDecadas(data)
      })
      .catch(() => {
        if (!cancelled) setError('No pudimos cargar las décadas.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { decadas, loading, error }
}