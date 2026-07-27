import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../../../shared/components/ui/Button'
import { getRoles, type Rol } from '../../../services/roles.service'
import {
  getUsuarioAdmin,
  updateUsuarioAdmin,
  type UsuarioAdminInput,
} from '../../../services/usuarios.service'

const inputClass =
  'w-full px-3 py-2 rounded-md bg-bg-secondary border border-border text-text text-sm font-sans focus:outline-none focus:border-accent disabled:opacity-50'

const labelClass = 'font-sans text-text-secondary text-xs uppercase tracking-wide'

export function UsuarioFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token, usuario: yo } = useAuth()
  const esUnoMismo = id === yo?.id

  const [form, setForm] = useState<UsuarioAdminInput>({})
  const [roles, setRoles] = useState<Rol[]>([])
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || !token) return
    Promise.all([getUsuarioAdmin(token, id), getRoles(token)])
      .then(([usuario, rolesData]) => {
        setForm({
          email: usuario.email,
          nombre: usuario.nombre ?? '',
          activo: usuario.activo,
          roles: usuario.roles,
        })
        setRoles(rolesData)
      })
      .catch(() => setError('No se pudo cargar la información del usuario.'))
      .finally(() => setLoading(false))
  }, [id, token])

  function toggleRol(nombreRol: string) {
    setForm((f) => {
      const actuales = f.roles ?? []
      const yaEsta = actuales.includes(nombreRol)
      return {
        ...f,
        roles: yaEsta ? actuales.filter((r) => r !== nombreRol) : [...actuales, nombreRol],
      }
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!token || !id) return
    setGuardando(true)
    setError(null)

    // Si es uno mismo, no mandamos roles/activo aunque estén en el estado
    // (el backend los rechazaría igual, pero evitamos el viaje de red innecesario).
    const payload: UsuarioAdminInput = esUnoMismo
      ? { email: form.email, nombre: form.nombre }
      : form

    try {
      await updateUsuarioAdmin(token, id, payload)
      navigate('/admin/usuarios')
    } catch (err: any) {
      const mensaje = err?.response?.data?.message
      setError(
        Array.isArray(mensaje) ? mensaje.join(', ') : mensaje ?? 'No se pudo guardar el usuario.',
      )
    } finally {
      setGuardando(false)
    }
  }

  if (loading) {
    return <p className="font-sans text-text-secondary text-sm">Cargando...</p>
  }

  return (
    <div className="flex flex-col gap-4 max-w-xl">
      <h1 className="font-sans font-semibold text-2xl text-text">Editar usuario</h1>

      {esUnoMismo && (
        <p className="font-sans text-text-secondary text-xs border border-border rounded-md p-3">
          Estás editando tu propia cuenta: no podés cambiar tus roles ni tu estado de cuenta
          desde acá, para evitar quedarte bloqueado por accidente.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Email</label>
          <input
            className={inputClass}
            type="email"
            value={form.email ?? ''}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass}>Nombre</label>
          <input
            className={inputClass}
            value={form.nombre ?? ''}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass}>Roles</label>
          <div className="flex flex-wrap gap-2">
            {roles.map((rol) => {
              const activo = form.roles?.includes(rol.nombre)
              return (
                <button
                  key={rol.id}
                  type="button"
                  disabled={esUnoMismo}
                  onClick={() => toggleRol(rol.nombre)}
                  className={`px-3 py-1 rounded-full text-xs font-sans border transition-colors duration-150 ${
                    esUnoMismo ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  } ${
                    activo
                      ? 'bg-accent text-bg border-accent'
                      : 'bg-transparent text-text-secondary border-border hover:border-accent'
                  }`}
                >
                  {rol.nombre}
                </button>
              )
            })}
          </div>
        </div>

        <label
          className={`flex items-center gap-2 font-sans text-sm text-text ${
            esUnoMismo ? 'opacity-50' : ''
          }`}
        >
          <input
            type="checkbox"
            checked={form.activo ?? true}
            disabled={esUnoMismo}
            onChange={(e) => setForm({ ...form, activo: e.target.checked })}
          />
          Cuenta activa (si se destilda, esta persona no podrá iniciar sesión)
        </label>

        {error && <p className="font-sans text-red-400 text-sm">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" variant="primary" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/usuarios')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}