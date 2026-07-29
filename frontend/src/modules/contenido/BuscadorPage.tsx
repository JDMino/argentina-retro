import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDecadas } from '../decadas/useDecadas'
import { decadaThemeVars } from '../decadas/decadas.theme'
import { getCategorias, type Categoria } from '../../services/categorias.service'
import { getEtiquetas, type Etiqueta } from '../../services/etiquetas.service'
import { useBuscarContenido, FILTROS_VACIOS, type FiltrosBusqueda } from './useBuscarContenido'
import { Card } from '../../shared/components/ui/Card'
import { Badge } from '../../shared/components/ui/Badge'
import { Button } from '../../shared/components/ui/Button'
import { useDocumentMeta } from '../../shared/hooks/useDocumentMeta'

export function BuscadorPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useDocumentMeta({ title: 'Buscar', noindex: true })

  const [filtros, setFiltros] = useState<FiltrosBusqueda>({
    ...FILTROS_VACIOS,
    q: searchParams.get('q') ?? '',
  })
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)

  const { decadas } = useDecadas()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([])

  useEffect(() => {
    getCategorias()
      .then((data) => setCategorias(data.sort((a, b) => a.orden - b.orden)))
      .catch(() => {
        /* filtros opcionales: si fallan, el buscador sigue usable sin ellos */
      })
    getEtiquetas()
      .then((data) => setEtiquetas(data))
      .catch(() => {})
  }, [])

  const { items, total, loading, error, huboBusqueda } = useBuscarContenido(filtros)

  function actualizarFiltro<K extends keyof FiltrosBusqueda>(clave: K, valor: FiltrosBusqueda[K]) {
    setFiltros((prev) => ({ ...prev, [clave]: valor }))
  }

  const hayFiltrosSecundariosActivos =
    filtros.decadaId !== '' || filtros.categoriaId !== '' || filtros.etiquetaId !== '' || filtros.anio !== ''

  return (
    <div>
      <h1 className="font-heading">Buscar</h1>
      <p className="text-text-secondary">
        Recorré todas las décadas a la vez por título, categoría, etiqueta o año.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <input
          type="text"
          value={filtros.q}
          onChange={(e) => actualizarFiltro('q', e.target.value)}
          placeholder="Buscar por título o descripción..."
          className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-text placeholder:text-text-secondary focus:outline-none focus:border-accent"
          autoFocus
        />

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => setFiltrosAbiertos((v) => !v)}
            aria-expanded={filtrosAbiertos}
          >
            Filtros{hayFiltrosSecundariosActivos ? ' •' : ''}
          </Button>
          {hayFiltrosSecundariosActivos && (
            <button
              onClick={() => setFiltros({ ...FILTROS_VACIOS, q: filtros.q })}
              className="text-xs text-text-secondary underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {filtrosAbiertos && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-bg-secondary border border-border rounded-md p-4">
            <label className="flex flex-col gap-1 text-sm">
              Década
              <select
                value={filtros.decadaId}
                onChange={(e) => actualizarFiltro('decadaId', e.target.value)}
                className="bg-bg border border-border rounded-md px-2 py-1.5 text-text"
              >
                <option value="">Todas</option>
                {decadas.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Categoría
              <select
                value={filtros.categoriaId}
                onChange={(e) => actualizarFiltro('categoriaId', e.target.value)}
                className="bg-bg border border-border rounded-md px-2 py-1.5 text-text"
              >
                <option value="">Todas</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Etiqueta
              <select
                value={filtros.etiquetaId}
                onChange={(e) => actualizarFiltro('etiquetaId', e.target.value)}
                className="bg-bg border border-border rounded-md px-2 py-1.5 text-text"
              >
                <option value="">Todas</option>
                {etiquetas.map((et) => (
                  <option key={et.id} value={et.id}>
                    {et.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Año
              <input
                type="number"
                value={filtros.anio}
                onChange={(e) => actualizarFiltro('anio', e.target.value)}
                placeholder="Ej: 1985"
                className="bg-bg border border-border rounded-md px-2 py-1.5 text-text"
              />
            </label>
          </div>
        )}
      </div>

      <div className="mt-8">
        {!huboBusqueda && (
          <p className="text-text-secondary">
            Escribí algo o elegí un filtro para empezar a buscar.
          </p>
        )}
        {loading && <p>Buscando...</p>}
        {error && <p className="text-error">{error}</p>}
        {!loading && !error && huboBusqueda && items.length === 0 && (
          <p className="text-text-secondary">No encontramos contenido con esos criterios.</p>
        )}
        {!loading && items.length > 0 && (
          <>
            <p className="text-text-secondary text-sm mb-4">
              {total} resultado{total !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((contenido) => {
                const thumbnail = [...contenido.imagenes].sort((a, b) => a.orden - b.orden)[0]
                const decada = contenido.decada
                return (
                  <div
                    key={contenido.id}
                    style={decada ? decadaThemeVars(decada.paleta) : undefined}
                    className="rounded-lg overflow-hidden"
                  >
                    <div
                      className="h-1"
                      style={{ backgroundColor: decada?.paleta.primario ?? 'var(--color-accent)' }}
                    />
                    <Card
                      title={contenido.titulo}
                      description={contenido.descripcion ?? undefined}
                      image={thumbnail?.url}
                      imageAlt={thumbnail?.textoAlternativo ?? ''}
                      onClick={() => {
                        if (!decada || !contenido.categoria) return
                        navigate(
                          `/decada/${decada.slug}/categoria/${contenido.categoria.slug}/${contenido.slug}`,
                        )
                      }}
                      meta={
                        <>
                          {decada && <Badge variant="accent">{decada.nombre}</Badge>}
                          {contenido.anio && <Badge variant="outline">{contenido.anio}</Badge>}
                        </>
                      }
                      className="rounded-t-none"
                    />
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}