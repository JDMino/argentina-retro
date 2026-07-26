import { useState, type FormEvent } from 'react'
import { useAuth } from './AuthContext'
import { Button } from '../../shared/components/ui/Button'

export function PerfilPage() {
  const { usuario, actualizarPerfil, cambiarPassword } = useAuth()

  const [nombre, setNombre] = useState(usuario?.nombre ?? '')
  const [email, setEmail] = useState(usuario?.email ?? '')
  const [guardandoPerfil, setGuardandoPerfil] = useState(false)
  const [errorPerfil, setErrorPerfil] = useState<string | null>(null)
  const [exitoPerfil, setExitoPerfil] = useState(false)

  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [cambiandoPassword, setCambiandoPassword] = useState(false)
  const [errorPassword, setErrorPassword] = useState<string | null>(null)
  const [exitoPassword, setExitoPassword] = useState(false)

  async function handleGuardarPerfil(event: FormEvent) {
    event.preventDefault()
    setErrorPerfil(null)
    setExitoPerfil(false)
    setGuardandoPerfil(true)
    try {
      await actualizarPerfil({ nombre, email })
      setExitoPerfil(true)
    } catch {
      setErrorPerfil('No pudimos actualizar tu perfil. ¿El email ya está en uso?')
    } finally {
      setGuardandoPerfil(false)
    }
  }

  async function handleCambiarPassword(event: FormEvent) {
    event.preventDefault()
    setErrorPassword(null)
    setExitoPassword(false)
    setCambiandoPassword(true)
    try {
      await cambiarPassword({ passwordActual, passwordNueva })
      setPasswordActual('')
      setPasswordNueva('')
      setExitoPassword(true)
    } catch {
      setErrorPassword('No pudimos cambiar tu contraseña. Revisá la contraseña actual.')
    } finally {
      setCambiandoPassword(false)
    }
  }

  return (
    <div className="max-w-sm">
      <h1 className="text-2xl font-semibold text-text mb-6">Mi perfil</h1>

      <form onSubmit={handleGuardarPerfil} className="flex flex-col gap-4 mb-10">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-text-secondary">Nombre</span>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={100}
            className="bg-bg-secondary border border-border rounded px-3 py-2 text-text"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-text-secondary">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-bg-secondary border border-border rounded px-3 py-2 text-text"
          />
        </label>
        {errorPerfil && <p className="text-sm text-red-400">{errorPerfil}</p>}
        {exitoPerfil && <p className="text-sm text-accent">Perfil actualizado.</p>}
        <Button type="submit" disabled={guardandoPerfil}>
          {guardandoPerfil ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </form>

      <h2 className="text-xl font-semibold text-text mb-4">Cambiar contraseña</h2>
      <form onSubmit={handleCambiarPassword} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-text-secondary">Contraseña actual</span>
          <input
            type="password"
            value={passwordActual}
            onChange={(e) => setPasswordActual(e.target.value)}
            required
            className="bg-bg-secondary border border-border rounded px-3 py-2 text-text"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-text-secondary">Contraseña nueva</span>
          <input
            type="password"
            value={passwordNueva}
            onChange={(e) => setPasswordNueva(e.target.value)}
            required
            minLength={8}
            className="bg-bg-secondary border border-border rounded px-3 py-2 text-text"
          />
        </label>
        {errorPassword && <p className="text-sm text-red-400">{errorPassword}</p>}
        {exitoPassword && <p className="text-sm text-accent">Contraseña actualizada.</p>}
        <Button type="submit" variant="secondary" disabled={cambiandoPassword}>
          {cambiandoPassword ? 'Actualizando...' : 'Cambiar contraseña'}
        </Button>
      </form>

      <p className="text-text-secondary mt-6">Roles: {usuario?.roles.join(', ')}</p>
    </div>
  )
}