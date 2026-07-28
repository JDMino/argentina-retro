import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../../../shared/components/ui/Button'
import { SearchInput } from '../../../shared/components/ui/SearchInput'
import { getDecadas, type Decada } from '../../../services/decadas.service'
import { getCategorias, type Categoria } from '../../../services/categorias.service'
import { getEtiquetas, createEtiqueta, type Etiqueta } from '../../../services/etiquetas.service'
import {
  createContenido,
  getContenidoPorId,
  updateContenido,
  type ContenidoInput,
  type ImagenInput,
  type VideoInput,
  type EnlaceExterno,
} from '../../../services/contenido.service'

const VALORES_INICIALES: ContenidoInput = {
  titulo: '',
  slug: '',
  descripcion: '',
  anio: undefined,
  decadaId: '',
  categoriaId: '',
  enlacesExternos: [],
  publicado: true,
  imagenes: [],
  videos: [],
  etiquetaIds: [],
}

const inputClass =
  'w-full px-3 py-2 rounded-md bg-bg-secondary border border-border text-text text-sm font-sans focus:outline-none focus:border-accent'

const labelClass = 'font-sans text-text-secondary text-xs uppercase tracking-wide'

export function ContenidoFormPage() {
  const { id } = useParams<{ id: string }>()
  const esEdicion = Boolean(id)
  const navigate = useNavigate()
  const { token } = useAuth()

  const [form, setForm] = useState<ContenidoInput>(VALORES_INICIALES)
  const [decadas, setDecadas] = useState<Decada[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([])
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('')
  const [busquedaEtiqueta, setBusquedaEtiqueta] = useState('')

  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function cargarBase() {
      try {
        const [decadasData, categoriasData, etiquetasData] = await Promise.all([
          getDecadas(),
          getCategorias(),
          getEtiquetas(),
        ])
        setDecadas(decadasData.sort((a, b) => a.orden - b.orden))
        setCategorias(categoriasData.sort((a, b) => a.orden - b.orden))
        setEtiquetas(etiquetasData)

        if (id) {
          const contenido = await getContenidoPorId(id)
          setForm({
            titulo: contenido.titulo,
            slug: contenido.slug,
            descripcion: contenido.descripcion ?? '',
            anio: contenido.anio ?? undefined,
            decadaId: contenido.decadaId,
            categoriaId: contenido.categoriaId,
            enlacesExternos: contenido.enlacesExternos ?? [],
            publicado: contenido.publicado,
            imagenes: contenido.imagenes.map((img) => ({
              url: img.url,
              textoAlternativo: img.textoAlternativo ?? '',
              orden: img.orden,
            })),
            videos: contenido.videos.map((vid) => ({
              youtubeVideoId: vid.youtubeVideoId,
              titulo: vid.titulo ?? '',
              orden: vid.orden,
            })),
            etiquetaIds: contenido.contenidoEtiquetas.map((ce) => ce.etiqueta.id),
          })
        } else if (decadasData[0] && categoriasData[0]) {
          setForm((f) => ({
            ...f,
            decadaId: decadasData[0].id,
            categoriaId: categoriasData[0].id,
          }))
        }
      } catch {
        setError('No se pudo cargar la información necesaria para el formulario.')
      } finally {
        setLoading(false)
      }
    }
    cargarBase()
  }, [id])

  // --- Imágenes ---
  function agregarImagen() {
    setForm((f) => ({
      ...f,
      imagenes: [...(f.imagenes ?? []), { url: '', textoAlternativo: '', orden: (f.imagenes?.length ?? 0) }],
    }))
  }
  function actualizarImagen(index: number, cambios: Partial<ImagenInput>) {
    setForm((f) => ({
      ...f,
      imagenes: f.imagenes?.map((img, i) => (i === index ? { ...img, ...cambios } : img)),
    }))
  }
  function quitarImagen(index: number) {
    setForm((f) => ({ ...f, imagenes: f.imagenes?.filter((_, i) => i !== index) }))
  }

  // --- Videos ---
  function agregarVideo() {
    setForm((f) => ({
      ...f,
      videos: [...(f.videos ?? []), { youtubeVideoId: '', titulo: '', orden: (f.videos?.length ?? 0) }],
    }))
  }
  function actualizarVideo(index: number, cambios: Partial<VideoInput>) {
    setForm((f) => ({
      ...f,
      videos: f.videos?.map((vid, i) => (i === index ? { ...vid, ...cambios } : vid)),
    }))
  }
  function quitarVideo(index: number) {
    setForm((f) => ({ ...f, videos: f.videos?.filter((_, i) => i !== index) }))
  }

  // --- Enlaces externos ---
  function agregarEnlace() {
    setForm((f) => ({
      ...f,
      enlacesExternos: [...(f.enlacesExternos ?? []), { etiqueta: '', url: '' }],
    }))
  }
  function actualizarEnlace(index: number, cambios: Partial<EnlaceExterno>) {
    setForm((f) => ({
      ...f,
      enlacesExternos: f.enlacesExternos?.map((enlace, i) =>
        i === index ? { ...enlace, ...cambios } : enlace,
      ),
    }))
  }
  function quitarEnlace(index: number) {
    setForm((f) => ({ ...f, enlacesExternos: f.enlacesExternos?.filter((_, i) => i !== index) }))
  }

  // --- Etiquetas ---
  function toggleEtiqueta(etiquetaId: string) {
    setForm((f) => {
      const actuales = f.etiquetaIds ?? []
      const yaEsta = actuales.includes(etiquetaId)
      return {
        ...f,
        etiquetaIds: yaEsta
          ? actuales.filter((eid) => eid !== etiquetaId)
          : [...actuales, etiquetaId],
      }
    })
  }

  async function handleCrearEtiqueta() {
    if (!token || !nuevaEtiqueta.trim()) return
    const nombre = nuevaEtiqueta.trim()
    const slug = nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    try {
      const creada = await createEtiqueta(token, { nombre, slug })
      setEtiquetas((prev) => [...prev, creada].sort((a, b) => a.nombre.localeCompare(b.nombre)))
      setForm((f) => ({ ...f, etiquetaIds: [...(f.etiquetaIds ?? []), creada.id] }))
      setNuevaEtiqueta('')
    } catch {
      window.alert('No se pudo crear la etiqueta (¿ya existe una con ese nombre?).')
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!token) return
    setGuardando(true)
    setError(null)

    const payload: ContenidoInput = {
      ...form,
      enlacesExternos: form.enlacesExternos?.map((enlace) => ({
        ...enlace,
        url: /^https?:\/\//i.test(enlace.url) ? enlace.url : `https://${enlace.url}`,
      })),
    }

    try {
      if (esEdicion && id) {
        await updateContenido(token, id, payload)
      } else {
        await createContenido(token, payload)
      }
      navigate('/admin/contenido')
    } catch (err: any) {
      const mensaje = err?.response?.data?.message
      setError(
        Array.isArray(mensaje)
          ? mensaje.join(', ')
          : mensaje ?? 'No se pudo guardar el contenido.',
      )
    } finally {
      setGuardando(false)
    }
  }

  if (loading) {
    return <p className="font-sans text-text-secondary text-sm">Cargando...</p>
  }

  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      <h1 className="font-sans font-semibold text-2xl text-text">
        {esEdicion ? 'Editar contenido' : 'Nuevo contenido'}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Datos base */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 col-span-2">
            <label className={labelClass}>Título</label>
            <input
              className={inputClass}
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Slug (kebab-case)</label>
            <input
              className={inputClass}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Año</label>
            <input
              type="number"
              className={inputClass}
              value={form.anio ?? ''}
              onChange={(e) =>
                setForm({ ...form, anio: e.target.value ? Number(e.target.value) : undefined })
              }
              min={1900}
              max={2100}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Década</label>
            <select
              className={inputClass}
              value={form.decadaId}
              onChange={(e) => setForm({ ...form, decadaId: e.target.value })}
              required
            >
              {decadas.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Categoría</label>
            <select
              className={inputClass}
              value={form.categoriaId}
              onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
              required
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass}>Descripción</label>
          <textarea
            className={inputClass}
            rows={4}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
        </div>

        <label className="flex items-center gap-2 font-sans text-sm text-text">
          <input
            type="checkbox"
            checked={form.publicado}
            onChange={(e) => setForm({ ...form, publicado: e.target.checked })}
          />
          Publicado (visible en el sitio público)
        </label>

        {/* Imágenes */}
        <fieldset className="border border-border rounded-lg p-4 flex flex-col gap-3">
          <legend className={labelClass}>Imágenes</legend>
          {form.imagenes?.map((img, i) => (
            <div key={i} className="grid grid-cols-[2fr_2fr_80px_auto] gap-2 items-center">
              <input
                className={inputClass}
                placeholder="URL de la imagen"
                value={img.url}
                onChange={(e) => actualizarImagen(i, { url: e.target.value })}
              />
              <input
                className={inputClass}
                placeholder="Texto alternativo"
                value={img.textoAlternativo}
                onChange={(e) => actualizarImagen(i, { textoAlternativo: e.target.value })}
              />
              <input
                type="number"
                className={inputClass}
                placeholder="Orden"
                value={img.orden ?? 0}
                onChange={(e) => actualizarImagen(i, { orden: Number(e.target.value) })}
              />
              <Button
                type="button"
                variant="ghost"
                className="px-2 py-1 text-xs text-red-400"
                onClick={() => quitarImagen(i)}
              >
                Quitar
              </Button>
            </div>
          ))}
          <Button type="button" variant="secondary" className="self-start px-3 py-1 text-xs" onClick={agregarImagen}>
            + Agregar imagen
          </Button>
        </fieldset>

        {/* Videos */}
        <fieldset className="border border-border rounded-lg p-4 flex flex-col gap-3">
          <legend className={labelClass}>Videos (YouTube)</legend>
          {form.videos?.map((vid, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_80px_auto] gap-2 items-center">
              <input
                className={inputClass}
                placeholder="ID del video (ej: dQw4w9WgXcQ)"
                value={vid.youtubeVideoId}
                onChange={(e) => actualizarVideo(i, { youtubeVideoId: e.target.value })}
              />
              <input
                className={inputClass}
                placeholder="Título"
                value={vid.titulo}
                onChange={(e) => actualizarVideo(i, { titulo: e.target.value })}
              />
              <input
                type="number"
                className={inputClass}
                placeholder="Orden"
                value={vid.orden ?? 0}
                onChange={(e) => actualizarVideo(i, { orden: Number(e.target.value) })}
              />
              <Button
                type="button"
                variant="ghost"
                className="px-2 py-1 text-xs text-red-400"
                onClick={() => quitarVideo(i)}
              >
                Quitar
              </Button>
            </div>
          ))}
          <Button type="button" variant="secondary" className="self-start px-3 py-1 text-xs" onClick={agregarVideo}>
            + Agregar video
          </Button>
        </fieldset>

        {/* Enlaces externos */}
        <fieldset className="border border-border rounded-lg p-4 flex flex-col gap-3">
          <legend className={labelClass}>Enlaces externos</legend>
          {form.enlacesExternos?.map((enlace, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-center">
              <input
                className={inputClass}
                placeholder="Etiqueta (ej: Wikipedia)"
                value={enlace.etiqueta}
                onChange={(e) => actualizarEnlace(i, { etiqueta: e.target.value })}
              />
              <input
                className={inputClass}
                placeholder="URL"
                value={enlace.url}
                onChange={(e) => actualizarEnlace(i, { url: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                className="px-2 py-1 text-xs text-red-400"
                onClick={() => quitarEnlace(i)}
              >
                Quitar
              </Button>
            </div>
          ))}
          <Button type="button" variant="secondary" className="self-start px-3 py-1 text-xs" onClick={agregarEnlace}>
            + Agregar enlace
          </Button>
        </fieldset>

        {/* Etiquetas */}
        <fieldset className="border border-border rounded-lg p-4 flex flex-col gap-3">
          <legend className={labelClass}>Etiquetas</legend>
          {etiquetas.length > 8 && (
            <SearchInput
              value={busquedaEtiqueta}
              onChange={setBusquedaEtiqueta}
              placeholder="Buscar etiqueta..."
              className="w-full max-w-xs"
            />
          )}
          <div className="flex flex-wrap gap-2">
            {etiquetas
              .filter((etiqueta) => {
                const activa = form.etiquetaIds?.includes(etiqueta.id)
                if (activa) return true // no ocultar selecciones activas al filtrar
                const q = busquedaEtiqueta.trim().toLowerCase()
                return !q || etiqueta.nombre.toLowerCase().includes(q)
              })
              .map((etiqueta) => {
                const activa = form.etiquetaIds?.includes(etiqueta.id)
                return (
                  <button
                    key={etiqueta.id}
                    type="button"
                    onClick={() => toggleEtiqueta(etiqueta.id)}
                    className={`px-3 py-1 rounded-full text-xs font-sans border transition-colors duration-150 cursor-pointer ${
                      activa
                        ? 'bg-accent text-bg border-accent'
                        : 'bg-transparent text-text-secondary border-border hover:border-accent'
                    }`}
                  >
                    {etiqueta.nombre}
                  </button>
                )
              })}
            {etiquetas.length === 0 && (
              <p className="font-sans text-text-secondary text-xs">Todavía no hay etiquetas creadas.</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              className={inputClass}
              placeholder="Nombre de una etiqueta nueva"
              value={nuevaEtiqueta}
              onChange={(e) => setNuevaEtiqueta(e.target.value)}
            />
            <Button type="button" variant="secondary" className="px-3 py-2 text-xs whitespace-nowrap" onClick={handleCrearEtiqueta}>
              + Crear
            </Button>
          </div>
        </fieldset>

        {error && <p className="font-sans text-red-400 text-sm">{error}</p>}

        <div className="flex items-center gap-3">
          <Button type="submit" variant="primary" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/contenido')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}