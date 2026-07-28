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
    let cancelled = false

    async function cargar() {
      if (!decadaId) {
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const data = await getCategoriasPorDecada(decadaId)
        if (!cancelled) setCategorias(data)
      } catch {
        if (!cancelled) setError('No pudimos cargar las categorías.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    cargar()

    return () => {
      cancelled = true
    }
  }, [decadaId])

  return { categorias, loading, error }
}