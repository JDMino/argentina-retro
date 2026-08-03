import { useParams, useNavigate } from 'react-router-dom'
import { useDecadas } from '../decadas/useDecadas'
import { useCategorias } from './useCategorias'
import { useContenidoPorCategoria } from './useContenidoPorCategoria'
import { decadaThemeVars } from '../decadas/decadas.theme'
import { Card } from '../../shared/components/ui/Card'
import { DecadaAccentBar } from '../../shared/components/ui/DecadaAccentBar'
import { useDocumentMeta } from '../../shared/hooks/useDocumentMeta'

export function CategoriaPage() {
  const { slug, categoriaSlug } = useParams<{ slug: string; categoriaSlug: string }>()
  const navigate = useNavigate()

  const { decadas, loading: loadingDecadas, error: errorDecadas } = useDecadas()
  const decada = decadas.find((d) => d.slug === slug)

  const { categorias, loading: loadingCategorias, error: errorCategorias } = useCategorias(decada?.id)
  const categoria = categorias.find((c) => c.slug === categoriaSlug)

  const {
    contenidos,
    loading: loadingContenidos,
    error: errorContenidos,
  } = useContenidoPorCategoria(decada?.id, categoria?.id)

  useDocumentMeta({
    title: categoria && decada ? `${categoria.nombre} en ${decada.nombre}` : 'Categoría',
  })

  if (loadingDecadas || loadingCategorias) return <p>Cargando...</p>
  if (errorDecadas) return <p className="text-error">{errorDecadas}</p>
  if (errorCategorias) return <p className="text-error">{errorCategorias}</p>
  if (!decada) return <p>Década no encontrada.</p>
  if (!categoria) return <p>Categoría no encontrada en esta década.</p>

  return (
    <div
      data-decada={decada.slug}
      style={decadaThemeVars(decada.paleta)}
      className="relative min-h-[60vh] -mx-4 px-4"
    >
      <h1 className="font-heading relative z-10">{categoria.nombre}</h1>
      <DecadaAccentBar />
      <p className="text-accent-secondary relative z-10">{decada.nombre}</p>

      <div className="relative z-10 mt-8">
        {loadingContenidos && <p>Cargando contenido...</p>}
        {errorContenidos && <p className="text-error">{errorContenidos}</p>}
        {!loadingContenidos && !errorContenidos && contenidos.length === 0 && (
          <p className="text-text-secondary">
            Todavía no hay contenido cargado en esta categoría.
          </p>
        )}
        {contenidos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {contenidos.map((contenido) => {
              const thumbnail = [...contenido.imagenes].sort((a, b) => a.orden - b.orden)[0]
              return (
                <Card
                  key={contenido.id}
                  title={contenido.titulo}
                  description={contenido.descripcion ?? undefined}
                  image={thumbnail?.url}
                  imageAlt={thumbnail?.textoAlternativo ?? ''}
                  onClick={() =>
                    navigate(`/decada/${decada.slug}/categoria/${categoria.slug}/${contenido.slug}`)
                  }
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}