import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../../../shared/components/ui/Button'
import { Badge } from '../../../shared/components/ui/Badge'
import { SearchInput } from '../../../shared/components/ui/SearchInput'
import {
  deleteUsuarioAdmin,
  getUsuariosAdmin,
  resetearPasswordUsuario,
  type UsuarioAdmin,
} from '../../../services/usuarios.service'

export function AdminUsuariosPage() {
  const { token, usuario: yo } = useAuth()
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [passwordGenerada, setPasswordGenerada] = useState<{ email: string; password: string } | null>(
    null,
  )

  async function cargar() {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const data = await getUsuariosAdmin(token)
      setUsuarios(data)
    } catch {
      setError('No se pudieron cargar los usuarios.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function cargarInicial() {
      await cargar()
    }
    cargarInicial()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleEliminar(usuario: UsuarioAdmin) {
    if (!token) return
    const confirmado = window.confirm(
      `¿Eliminar a "${usuario.email}"? Esto también borra sus comentarios y favoritos. No se puede deshacer.`,
    )
    if (!confirmado) return

    try {
      await deleteUsuarioAdmin(token, usuario.id)
      setUsuarios((prev) => prev.filter((u) => u.id !== usuario.id))
    } catch {
      window.alert('No se pudo eliminar el usuario.')
    }
  }

  async function handleResetearPassword(usuario: UsuarioAdmin) {
    if (!token) return
    const confirmado = window.confirm(
      `¿Generar una contraseña temporal para "${usuario.email}"? Su contraseña actual dejará de funcionar.`,
    )
    if (!confirmado) return

    try {
      const { passwordTemporal } = await resetearPasswordUsuario(token, usuario.id)
      setPasswordGenerada({ email: usuario.email, password: passwordTemporal })
      cargar()
    } catch {
      window.alert('No se pudo resetear la contraseña.')
    }
  }

  async function copiarPassword() {
    if (!passwordGenerada) return
    try {
      await navigator.clipboard.writeText(passwordGenerada.password)
    } catch {
      // si el navegador no permite clipboard, no pasa nada: el valor sigue visible en pantalla
    }
  }

  const qNormalizado = q.trim().toLowerCase()
  const usuariosFiltrados = qNormalizado
    ? usuarios.filter(
        (u) =>
          u.email.toLowerCase().includes(qNormalizado) ||
          (u.nombre ?? '').toLowerCase().includes(qNormalizado),
      )
    : usuarios

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-sans font-semibold text-2xl text-text">Usuarios</h1>

      <SearchInput value={q} onChange={setQ} placeholder="Buscar por email o nombre..." className="w-full max-w-sm" />

      {passwordGenerada && (
        <div className="border border-accent rounded-lg p-4 flex flex-col gap-2 bg-bg-secondary">
          <p className="font-sans text-sm text-text">
            Contraseña temporal generada para <strong>{passwordGenerada.email}</strong>. Copiala y
            enviásela por fuera de la app (por ejemplo, al correo de soporte que te haya
            escrito). Esta persona va a tener que cambiarla en su próximo inicio de sesión.
          </p>
          <div className="flex items-center gap-2">
            <code className="px-3 py-2 rounded-md bg-bg border border-border text-accent text-sm font-mono">
              {passwordGenerada.password}
            </code>
            <Button variant="secondary" className="px-3 py-1 text-xs" onClick={copiarPassword}>
              Copiar
            </Button>
            <Button
              variant="ghost"
              className="px-3 py-1 text-xs"
              onClick={() => setPasswordGenerada(null)}
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}

      {loading && <p className="font-sans text-text-secondary text-sm">Cargando...</p>}
      {error && <p className="font-sans text-red-400 text-sm">{error}</p>}

      {!loading && !error && (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans min-w-[640px]">
            <thead>
              <tr className="bg-bg-secondary text-text-secondary text-left">
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Nombre</th>
                <th className="px-4 py-2 font-medium">Roles</th>
                <th className="px-4 py-2 font-medium">Estado</th>
                <th className="px-4 py-2 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => {
                const esUnoMismo = usuario.id === yo?.id
                return (
                  <tr key={usuario.id} className="border-t border-border">
                    <td className="px-4 py-2 text-text">
                      {usuario.email}
                      {esUnoMismo && (
                        <span className="ml-2 font-sans text-text-secondary text-xs">(vos)</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-text-secondary">{usuario.nombre ?? '—'}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-1 flex-wrap">
                        {usuario.roles.map((rol) => (
                          <Badge key={rol} variant={rol === 'admin' ? 'accent' : 'outline'}>
                            {rol}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <Badge variant={usuario.activo ? 'accent' : 'outline'}>
                        {usuario.activo ? 'Activo' : 'Suspendido'}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/usuarios/${usuario.id}/editar`}>
                          <Button variant="secondary" className="px-3 py-1 text-xs">
                            Editar
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="px-3 py-1 text-xs"
                          onClick={() => handleResetearPassword(usuario)}
                        >
                          Resetear contraseña
                        </Button>
                        {!esUnoMismo && (
                          <Button
                            variant="ghost"
                            className="px-3 py-1 text-xs text-red-400"
                            onClick={() => handleEliminar(usuario)}
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-text-secondary">
                    {qNormalizado ? 'No encontramos usuarios con esos criterios.' : 'No hay usuarios registrados.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  )
}