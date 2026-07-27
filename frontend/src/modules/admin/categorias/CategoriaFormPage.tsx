import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../../../shared/components/ui/Button'
import {
  createCategoria,
  getCategoria,
  updateCategoria,
  type CategoriaInput,
} from '../../../services/categorias.service'

const VALORES_INICIALES: CategoriaInput = {
  nombre: '',
  slug: '',
  icono: '',
  descripcion: '',
  orden: 0,
  activa: true,
}

const inputClass =
  'w-full px-3 py-2 rounded-md bg-bg-secondary border border-border text-text text-sm font-sans focus:outline-none focus:border-accent'

const labelClass = 'font-sans text-text-secondary text-xs uppercase tracking-wide'

export function CategoriaFormPage() {
  const { id } = useParams<{ id: string }>()
  const esEdicion = Boolean(id)
  const navigate = useNavigate()
  const { token } = useAuth()

  const [form, setForm] = useState<CategoriaInput>(VALORES_INICIALES)
  const [loading, setLoading] = useState(esEdicion)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getCategoria(id)
      .then((categoria) =>
        setForm({
          nombre: categoria.nombre,
          slug: categoria.slug,
          icono: categoria.icono ?? '',
          descripcion: categoria.descripcion ?? '',
          orden: categoria.orden,
          activa: categoria.activa,
        }),
      )
      .catch(() => setError('No se pudo cargar la categoría.'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!token) return
    setGuardando(true)
    setError(null)

    try {
      if (esEdicion && id) {
        await updateCategoria(token, id, form)
      } else {
        await createCategoria(token, form)
      }
      navigate('/admin/categorias')
    } catch (err: any) {
      const mensaje = err?.response?.data?.message
      setError(
        Array.isArray(mensaje)
          ? mensaje.join(', ')
          : mensaje ?? 'No se pudo guardar la categoría.',
      )
    } finally {
      setGuardando(false)
    }
  }

  if (loading) {
    return <p className="font-sans text-text-secondary text-sm">Cargando...</p>
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <h1 className="font-sans font-semibold text-2xl text-text">
        {esEdicion ? 'Editar categoría' : 'Nueva categoría'}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Nombre</label>
            <input
              className={inputClass}
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Slug (kebab-case, ej: musica)</label>
            <input
              className={inputClass}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Icono (emoji o nombre corto, opcional)</label>
            <input
              className={inputClass}
              value={form.icono}
              onChange={(e) => setForm({ ...form, icono: e.target.value })}
              maxLength={50}
              placeholder="🎵"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Orden</label>
            <input
              type="number"
              className={inputClass}
              value={form.orden}
              onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass}>Descripción</label>
          <textarea
            className={inputClass}
            rows={3}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
        </div>

        <label className="flex items-center gap-2 font-sans text-sm text-text">
          <input
            type="checkbox"
            checked={form.activa}
            onChange={(e) => setForm({ ...form, activa: e.target.checked })}
          />
          Activa (visible en el sitio público)
        </label>

        {error && <p className="font-sans text-red-400 text-sm">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" variant="primary" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/admin/categorias')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}