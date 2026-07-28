import { useEffect, useState } from 'react'
import { getContenidoPorCategoria, type Contenido } from '../../services/contenido.service'

interface UseContenidoResult {
  contenidos: Contenido[]
  loading: boolean
  error: string | null
}

export function useContenidoPorCategoria(
  decadaId: string | undefined,
  categoriaId: string | undefined,
): UseContenidoResult {
  const [contenidos, setContenidos] = useState<Contenido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function cargar() {
      if (!decadaId || !categoriaId) {
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const data = await getContenidoPorCategoria(decadaId, categoriaId)
        if (!cancelled) setContenidos(data)
      } catch {
        if (!cancelled) setError('No pudimos cargar el contenido.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    cargar()

    return () => {
      cancelled = true
    }
  }, [decadaId, categoriaId])

  return { contenidos, loading, error }
}