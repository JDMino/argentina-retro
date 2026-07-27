import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../../../shared/components/ui/Button'
import {
  createDecada,
  getDecada,
  updateDecada,
  type DecadaInput,
} from '../../../services/decadas.service'

const VALORES_INICIALES: DecadaInput = {
  nombre: '',
  slug: '',
  anioInicio: 1970,
  anioFin: 1979,
  descripcion: '',
  paleta: { primario: '#f5a623', secundario: '#1a1a1a', acento: '#ffffff' },
  orden: 0,
  activa: true,
}

const inputClass =
  'w-full px-3 py-2 rounded-md bg-bg-secondary border border-border text-text text-sm font-sans focus:outline-none focus:border-accent'

const labelClass = 'font-sans text-text-secondary text-xs uppercase tracking-wide'

export function DecadaFormPage() {
  const { id } = useParams<{ id: string }>()
  const esEdicion = Boolean(id)
  const navigate = useNavigate()
  const { token } = useAuth()

  const [form, setForm] = useState<DecadaInput>(VALORES_INICIALES)
  const [loading, setLoading] = useState(esEdicion)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getDecada(id)
      .then((decada) =>
        setForm({
          nombre: decada.nombre,
          slug: decada.slug,
          anioInicio: decada.anioInicio,
          anioFin: decada.anioFin,
          descripcion: decada.descripcion ?? '',
          paleta: decada.paleta ?? VALORES_INICIALES.paleta,
          orden: decada.orden,
          activa: decada.activa,
        }),
      )
      .catch(() => setError('No se pudo cargar la década.'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!token) return
    setGuardando(true)
    setError(null)

    try {
      if (esEdicion && id) {
        await updateDecada(token, id, form)
      } else {
        await createDecada(token, form)
      }
      navigate('/admin/decadas')
    } catch (err: any) {
      const mensaje = err?.response?.data?.message
      setError(
        Array.isArray(mensaje)
          ? mensaje.join(', ')
          : mensaje ?? 'No se pudo guardar la década.',
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
        {esEdicion ? 'Editar década' : 'Nueva década'}
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
            <label className={labelClass}>Slug (kebab-case, ej: los-80)</label>
            <input
              className={inputClass}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Año inicio</label>
            <input
              type="number"
              className={inputClass}
              value={form.anioInicio}
              onChange={(e) => setForm({ ...form, anioInicio: Number(e.target.value) })}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Año fin</label>
            <input
              type="number"
              className={inputClass}
              value={form.anioFin}
              onChange={(e) => setForm({ ...form, anioFin: Number(e.target.value) })}
              required
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

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Color primario</label>
            <input
              type="color"
              className="h-10 w-full rounded-md border border-border bg-bg-secondary"
              value={form.paleta?.primario ?? '#f5a623'}
              onChange={(e) =>
                setForm({ ...form, paleta: { ...form.paleta, primario: e.target.value } })
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Color secundario</label>
            <input
              type="color"
              className="h-10 w-full rounded-md border border-border bg-bg-secondary"
              value={form.paleta?.secundario ?? '#1a1a1a'}
              onChange={(e) =>
                setForm({ ...form, paleta: { ...form.paleta, secundario: e.target.value } })
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Color acento</label>
            <input
              type="color"
              className="h-10 w-full rounded-md border border-border bg-bg-secondary"
              value={form.paleta?.acento ?? '#ffffff'}
              onChange={(e) =>
                setForm({ ...form, paleta: { ...form.paleta, acento: e.target.value } })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Orden</label>
            <input
              type="number"
              className={inputClass}
              value={form.orden}
              onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })}
            />
          </div>
          <label className="flex items-center gap-2 font-sans text-sm text-text pb-2">
            <input
              type="checkbox"
              checked={form.activa}
              onChange={(e) => setForm({ ...form, activa: e.target.checked })}
            />
            Activa (visible en el sitio público)
          </label>
        </div>

        {error && <p className="font-sans text-red-400 text-sm">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" variant="primary" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/admin/decadas')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}