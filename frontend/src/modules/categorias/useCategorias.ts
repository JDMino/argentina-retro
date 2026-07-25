import { useEffect, useState } from 'react'
import { getCategoriasPorDecada, type Categoria } from '../../services/categorias.service'

interface UseCategoriasResult {
  categorias: Categoria[]
  loading: boolean
  error: string | null
}

export function useCategorias(decadaId: string | undefined): UseCategoriasResult {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!decadaId) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    getCategoriasPorDecada(decadaId)
      .then((data) => {
        if (!cancelled) setCategorias(data)
      })
      .catch(() => {
        if (!cancelled) setError('No pudimos cargar las categorías.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [decadaId])

  return { categorias, loading, error }
}