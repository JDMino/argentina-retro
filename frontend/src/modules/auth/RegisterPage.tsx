import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Button } from '../../shared/components/ui/Button'
import { useDocumentMeta } from '../../shared/hooks/useDocumentMeta'

export function RegisterPage() {
  const { register, usuario } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useDocumentMeta({ title: 'Crear cuenta', noindex: true })
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

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
      await register({ email, password, nombre: nombre || undefined })
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err !== null && 'response' in err
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((err as any).response?.data?.message as string | undefined)
          : undefined
      setError(message ?? 'No pudimos completar el registro.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold text-text mb-6">Crear cuenta</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-text-secondary">Nombre (opcional)</span>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="bg-bg-secondary border border-border rounded px-3 py-2 text-text"
          />
        </label>
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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-bg-secondary border border-border rounded px-3 py-2 text-text"
          />
          <span className="text-xs text-text-secondary">Mínimo 8 caracteres.</span>
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </form>
      <p className="text-sm text-text-secondary mt-4">
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className="text-accent">
          Iniciá sesión
        </Link>
      </p>
    </div>
  )
}