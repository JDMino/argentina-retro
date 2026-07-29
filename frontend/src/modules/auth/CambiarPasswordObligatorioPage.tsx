import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Button } from '../../shared/components/ui/Button'
import { useDocumentMeta } from '../../shared/hooks/useDocumentMeta'

export function CambiarPasswordObligatorioPage() {
  const { cambiarPassword, logout, usuario, loading } = useAuth()
  const navigate = useNavigate()

  useDocumentMeta({ title: 'Cambiar contraseña', noindex: true })
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (!loading && !usuario) {
      navigate('/login', { replace: true })
    }
  }, [loading, usuario, navigate])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      await cambiarPassword({ passwordActual, passwordNueva })
      navigate('/', { replace: true })
    } catch {
      setError('No pudimos cambiar tu contraseña. Revisá la contraseña temporal.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center px-4">
      <div className="max-w-sm w-full flex flex-col gap-4">
        <h1 className="font-sans font-semibold text-xl text-text">Cambiá tu contraseña</h1>
        <p className="font-sans text-text-secondary text-sm">
          Hola{usuario?.nombre ? `, ${usuario.nombre}` : ''}. Un administrador te asignó una
          contraseña temporal. Por seguridad, tenés que elegir una nueva antes de seguir
          navegando.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-text-secondary">Contraseña temporal</span>
            <input
              type="password"
              required
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              className="bg-bg-secondary border border-border rounded px-3 py-2 text-text"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-text-secondary">Contraseña nueva</span>
            <input
              type="password"
              required
              minLength={8}
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              className="bg-bg-secondary border border-border rounded px-3 py-2 text-text"
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={enviando}>
            {enviando ? 'Guardando...' : 'Cambiar contraseña'}
          </Button>
        </form>

        <button
          type="button"
          onClick={logout}
          className="font-sans text-text-secondary text-xs underline cursor-pointer self-center"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}