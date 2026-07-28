import { useEffect, useState } from 'react'
import {
  buscarContenido,
  type BuscarContenidoFiltros,
  type Contenido,
} from '../../services/contenido.service'

const DEBOUNCE_MS = 400

export interface FiltrosBusqueda {
  q: string
  decadaId: string
  categoriaId: string
  etiquetaId: string
  anio: string
}

export const FILTROS_VACIOS: FiltrosBusqueda = {
  q: '',
  decadaId: '',
  categoriaId: '',
  etiquetaId: '',
  anio: '',
}

interface UseBuscarContenidoResult {
  items: Contenido[]
  total: number
  loading: boolean
  error: string | null
  huboBusqueda: boolean
}

function hayFiltrosActivos(filtros: FiltrosBusqueda): boolean {
  return Object.values(filtros).some((valor) => valor.trim() !== '')
}

export function useBuscarContenido(filtros: FiltrosBusqueda): UseBuscarContenidoResult {
  const [items, setItems] = useState<Contenido[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // El texto libre se debounce (evita un fetch por tecla); el resto de los
  // filtros (selects/año) dispara la búsqueda de inmediato al cambiar.
  const [qDebounced, setQDebounced] = useState(filtros.q)

  useEffect(() => {
    const timeout = setTimeout(() => setQDebounced(filtros.q), DEBOUNCE_MS)
    return () => clearTimeout(timeout)
  }, [filtros.q])

  useEffect(() => {
    let cancelled = false

    async function buscar() {
      const activos = hayFiltrosActivos({ ...filtros, q: qDebounced })
      if (!activos) {
        setItems([])
        setTotal(0)
        setLoading(false)
        setError(null)
        return
      }

      setLoading(true)
      setError(null)

      const params: BuscarContenidoFiltros = {
        limite: 30,
      }
      if (qDebounced.trim()) params.q = qDebounced.trim()
      if (filtros.decadaId) params.decadaId = filtros.decadaId
      if (filtros.categoriaId) params.categoriaId = filtros.categoriaId
      if (filtros.etiquetaId) params.etiquetaId = filtros.etiquetaId
      if (filtros.anio.trim()) params.anio = Number(filtros.anio)

      try {
        const data = await buscarContenido(params)
        if (cancelled) return
        setItems(data.items)
        setTotal(data.total)
      } catch {
        if (!cancelled) setError('No pudimos completar la búsqueda.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    buscar()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qDebounced, filtros.decadaId, filtros.categoriaId, filtros.etiquetaId, filtros.anio])

  return { items, total, loading, error, huboBusqueda: hayFiltrosActivos({ ...filtros, q: qDebounced }) }
}