import { useEffect, useState } from 'react'
import { getConfiguracion, type Configuracion } from '../../services/configuracion.service'

interface UseConfiguracionResult {
  configuracion: Configuracion | null
  loading: boolean
  error: string | null
}

export function useConfiguracion(): UseConfiguracionResult {
  const [configuracion, setConfiguracion] = useState<Configuracion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    getConfiguracion()
      .then((data) => {
        if (!cancelled) setConfiguracion(data)
      })
      .catch(() => {
        if (!cancelled) setError('No pudimos cargar la configuración.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { configuracion, loading, error }
}