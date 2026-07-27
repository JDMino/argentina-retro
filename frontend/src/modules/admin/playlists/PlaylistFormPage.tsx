import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../../../shared/components/ui/Button'
import { getDecadas, type Decada } from '../../../services/decadas.service'
import { getCategorias, type Categoria } from '../../../services/categorias.service'
import {
  createPlaylist,
  getPlaylist,
  updatePlaylist,
  type PlaylistInput,
} from '../../../services/playlists.service'

const VALORES_INICIALES: PlaylistInput = {
  nombre: '',
  youtubePlaylistId: '',
  descripcion: '',
  decadaId: '',
  categoriaId: '',
}

const inputClass =
  'w-full px-3 py-2 rounded-md bg-bg-secondary border border-border text-text text-sm font-sans focus:outline-none focus:border-accent'

const labelClass = 'font-sans text-text-secondary text-xs uppercase tracking-wide'

export function PlaylistFormPage() {
  const { id } = useParams<{ id: string }>()
  const esEdicion = Boolean(id)
  const navigate = useNavigate()
  const { token } = useAuth()

  const [form, setForm] = useState<PlaylistInput>(VALORES_INICIALES)
  const [decadas, setDecadas] = useState<Decada[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function cargarBase() {
      try {
        const [decadasData, categoriasData] = await Promise.all([getDecadas(), getCategorias()])
        setDecadas(decadasData.sort((a, b) => a.orden - b.orden))
        setCategorias(categoriasData.sort((a, b) => a.orden - b.orden))

        if (id) {
          const playlist = await getPlaylist(id)
          setForm({
            nombre: playlist.nombre,
            youtubePlaylistId: playlist.youtubePlaylistId ?? '',
            descripcion: playlist.descripcion ?? '',
            decadaId: playlist.decadaId ?? '',
            categoriaId: playlist.categoriaId ?? '',
          })
        }
      } catch {
        setError('No se pudo cargar la información necesaria para el formulario.')
      } finally {
        setLoading(false)
      }
    }
    cargarBase()
  }, [id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!token) return
    setGuardando(true)
    setError(null)

    const payload: PlaylistInput = {
      ...form,
      decadaId: form.decadaId || null,
      categoriaId: form.categoriaId || null,
    }

    try {
      if (esEdicion && id) {
        await updatePlaylist(token, id, payload)
      } else {
        await createPlaylist(token, payload)
      }
      navigate('/admin/playlists')
    } catch (err: any) {
      const mensaje = err?.response?.data?.message
      setError(
        Array.isArray(mensaje)
          ? mensaje.join(', ')
          : mensaje ?? 'No se pudo guardar la playlist.',
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
        {esEdicion ? 'Editar playlist' : 'Nueva playlist'}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <label className={labelClass}>ID de playlist de YouTube</label>
          <input
            className={inputClass}
            value={form.youtubePlaylistId}
            onChange={(e) => setForm({ ...form, youtubePlaylistId: e.target.value })}
            placeholder="PLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          />
          <p className="font-sans text-text-secondary text-xs">
            Es el valor del parámetro <code>list=</code> en la URL de la playlist de YouTube.
          </p>
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

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Década (opcional)</label>
            <select
              className={inputClass}
              value={form.decadaId ?? ''}
              onChange={(e) => setForm({ ...form, decadaId: e.target.value })}
            >
              <option value="">Ninguna</option>
              {decadas.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Categoría (opcional)</label>
            <select
              className={inputClass}
              value={form.categoriaId ?? ''}
              onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
            >
              <option value="">Ninguna</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="font-sans text-red-400 text-sm">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" variant="primary" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/playlists')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}