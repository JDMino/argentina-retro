import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Button } from '../../shared/components/ui/Button'

const EMAIL_SOPORTE = 'soporte@argentinaretro.com'

interface ModalInfo {
  titulo: string
  mensaje: string
}

export function LoginPage() {
  const { login, usuario } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [modal, setModal] = useState<ModalInfo | null>(null)

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/'

  useEffect(() => {
    if (usuario) {
      navigate(redirectTo, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login({ email, password })
      // la redirección la dispara el useEffect al reaccionar al cambio de "usuario"
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setModal({
          titulo: 'Cuenta suspendida',
          mensaje:
            err.response.data?.message ??
            'Tu cuenta está suspendida. Contactate con soporte para más información.',
        })
      } else {
        setError('Email o contraseña incorrectos.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handleOlvideContraseña() {
    setModal({
      titulo: '¿Olvidaste tu contraseña?',
      mensaje: 'Escribinos desde el email con el que te registraste, y te ayudamos a recuperar el acceso a tu cuenta.',
    })
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold text-text mb-6">Iniciar sesión</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-text-secondary">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-bg-secondary border border-border rounded px-3 py-2 text-text"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-text-secondary">Contraseña</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-bg-secondary border border-border rounded px-3 py-2 text-text"
          />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>
      <button
        type="button"
        onClick={handleOlvideContraseña}
        className="text-sm text-text-secondary mt-3 underline cursor-pointer"
      >
        ¿Olvidaste tu contraseña?
      </button>
      <p className="text-sm text-text-secondary mt-4">
        ¿No tenés cuenta?{' '}
        <Link to="/registro" className="text-accent">
          Registrate
        </Link>
      </p>

      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-50">
          <div className="bg-bg border border-border rounded-lg p-6 max-w-sm flex flex-col gap-4">
            <h2 className="font-sans font-semibold text-lg text-text">{modal.titulo}</h2>
            <p className="font-sans text-text-secondary text-sm">{modal.mensaje}</p>
            <p className="font-sans text-text-secondary text-sm">
              Email de soporte:{' '}
              <a href={`mailto:${EMAIL_SOPORTE}`} className="text-accent underline">
                {EMAIL_SOPORTE}
              </a>
            </p>
            <Button variant="secondary" onClick={() => setModal(null)}>
              Entendido
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}