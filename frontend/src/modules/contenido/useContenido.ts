import { useEffect, useState } from 'react'
import axios from 'axios'
import { getContenidoPorSlug, type Contenido } from '../../services/contenido.service'

interface UseContenidoResult {
  contenido: Contenido | null
  loading: boolean
  error: string | null
}

export function useContenido(slug: string | undefined): UseContenidoResult {
  const [contenido, setContenido] = useState<Contenido | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    getContenidoPorSlug(slug)
      .then((data) => {
        if (!cancelled) setContenido(data)
      })
      .catch((err) => {
        if (cancelled) return
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError('Este contenido no está disponible.')
        } else {
          setError('No pudimos cargar el contenido.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  return { contenido, loading, error }
}