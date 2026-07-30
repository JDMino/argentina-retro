import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Button } from '../../shared/components/ui/Button'
import {
  getConfiguracion,
  updateConfiguracion,
} from '../../services/configuracion.service'

const inputClass =
  'w-full px-3 py-2 rounded-md bg-bg-secondary border border-border text-text text-sm font-sans focus:outline-none focus:border-accent'

const labelClass = 'font-sans text-text-secondary text-xs uppercase tracking-wide'

export function AdminHomePage() {
  const { token } = useAuth()

  const [homeFondoDesktopUrl, setHomeFondoDesktopUrl] = useState('')
  const [homeFondoMobileUrl, setHomeFondoMobileUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guardadoOk, setGuardadoOk] = useState(false)

  useEffect(() => {
    let cancelled = false

    getConfiguracion()
      .then((data) => {
        if (cancelled) return
        setHomeFondoDesktopUrl(data.homeFondoDesktopUrl ?? '')
        setHomeFondoMobileUrl(data.homeFondoMobileUrl ?? '')
      })
      .catch(() => {
        if (!cancelled) setError('No se pudo cargar la configuración.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!token) return
    setGuardando(true)
    setError(null)
    setGuardadoOk(false)

    try {
      // Mandamos siempre las dos claves con string o null explícito —
      // nunca undefined, para no repetir el bug de Etapa 8 donde
      // JSON.stringify descartaba las claves undefined y el backend
      // nunca se enteraba de que había que borrar el valor.
      await updateConfiguracion(token, {
        homeFondoDesktopUrl: homeFondoDesktopUrl.trim() || null,
        homeFondoMobileUrl: homeFondoMobileUrl.trim() || null,
      })
      setGuardadoOk(true)
    } catch (err: any) {
      const mensaje = err?.response?.data?.message
      setError(
        Array.isArray(mensaje)
          ? mensaje.join(', ')
          : mensaje ?? 'No se pudo guardar la configuración.',
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-sans font-semibold text-2xl text-text">Panel administrativo</h1>
        <p className="font-sans text-text-secondary text-sm">
          Elegí una sección en el menú de la izquierda para administrar el contenido de
          Argentina Retro.
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-2xl border-t border-border pt-6">
        <div>
          <h2 className="font-sans font-semibold text-lg text-text">Fondo del Home</h2>
          <p className="font-sans text-text-secondary text-sm">
            Imagen de fondo de la pantalla principal, con variantes para desktop y mobile
            (breakpoint 768px). Dejá el campo vacío para no mostrar fondo.
          </p>
        </div>

        {loading ? (
          <p className="font-sans text-text-secondary text-sm">Cargando...</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className={labelClass}>URL fondo desktop</label>
              <input
                className={inputClass}
                type="url"
                placeholder="https://..."
                value={homeFondoDesktopUrl}
                onChange={(e) => setHomeFondoDesktopUrl(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className={labelClass}>URL fondo mobile</label>
              <input
                className={inputClass}
                type="url"
                placeholder="https://..."
                value={homeFondoMobileUrl}
                onChange={(e) => setHomeFondoMobileUrl(e.target.value)}
              />
            </div>

            {error && <p className="font-sans text-red-400 text-sm">{error}</p>}
            {guardadoOk && (
              <p className="font-sans text-sm text-accent">Configuración guardada.</p>
            )}

            <div>
              <Button type="submit" variant="primary" disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}