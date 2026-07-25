import { useParams, useNavigate } from 'react-router-dom'
import { useDecadas } from './useDecadas'
import { useCategorias } from '../categorias/useCategorias'
import { decadaThemeVars } from './decadas.theme'
import { EpocaEffect } from './effects/EpocaEffect'
import { WindowFrame } from '../../shared/components/ui/WindowFrame'
import { Card } from '../../shared/components/ui/Card'
import { usePlaylist } from './usePlaylist'
import { PlaylistPlayer } from './PlaylistPlayer'

export function DecadaPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { decadas, loading, error } = useDecadas()
  const decada = decadas.find((d) => d.slug === slug)
  const {
    categorias,
    loading: loadingCategorias,
    error: errorCategorias,
  } = useCategorias(decada?.id)
  const { playlist, loading: loadingPlaylist } = usePlaylist(decada?.id)

  if (loading) return <p>Cargando...</p>
  if (error) return <p className="text-error">{error}</p>
  if (!decada) return <p>Década no encontrada.</p>

  const descripcion = decada.slug === 'los-2000'
    ? <WindowFrame title={decada.nombre}><p>{decada.descripcion}</p></WindowFrame>
    : <p className="text-text-secondary relative z-10">{decada.descripcion}</p>

  return (
    <div
      data-decada={decada.slug}
      style={decadaThemeVars(decada.paleta)}
      className="relative min-h-[60vh] -mx-4 px-4 overflow-hidden"
    >
      <EpocaEffect slug={decada.slug} />
      <h1 className="font-heading relative z-10">{decada.nombre}</h1>
      {descripcion}

      <div className="relative z-10 mt-8">
        {!loadingPlaylist && playlist && <PlaylistPlayer playlist={playlist} />}
        {loadingCategorias && <p>Cargando categorías...</p>}

        {errorCategorias && <p className="text-error">{errorCategorias}</p>}

        {!loadingCategorias && !errorCategorias && categorias.length === 0 && (
          <p className="text-text-secondary">
            Todavía no hay categorías cargadas para esta década.
          </p>
        )}

        {categorias.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categorias.map((categoria) => (
              <Card
                key={categoria.id}
                title={categoria.nombre}
                description={categoria.descripcion ?? undefined}
                onClick={() =>
                  navigate(`/decada/${decada.slug}/categoria/${categoria.slug}`)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}