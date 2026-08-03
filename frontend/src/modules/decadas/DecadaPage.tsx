import { useParams, useNavigate } from 'react-router-dom'
import { useDecadas } from './useDecadas'
import { useCategorias } from '../categorias/useCategorias'
import { decadaThemeVars } from './decadas.theme'
import { EpocaEffect } from './effects/EpocaEffect'
import { WindowFrame } from '../../shared/components/ui/WindowFrame'
import { Card } from '../../shared/components/ui/Card'
import { DecadaAccentBar } from '../../shared/components/ui/DecadaAccentBar'
import { usePlaylist } from './usePlaylist'
import { PlaylistPlayer } from './PlaylistPlayer'
import { useDocumentMeta } from '../../shared/hooks/useDocumentMeta'

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

  useDocumentMeta({
    title: decada?.nombre ?? 'Década',
    description: decada?.descripcion,
  })

  if (loading) return <p>Cargando...</p>
  if (error) return <p className="text-error">{error}</p>
  if (!decada) return <p>Década no encontrada.</p>

  const descripcion = decada.slug === 'los-2000'
    ? <WindowFrame title={decada.nombre}><p className="text-accent-secondary">{decada.descripcion}</p></WindowFrame>
    : <p className="text-accent-secondary relative z-10">{decada.descripcion}</p>

  const fondoDesktop = decada.imagenFondoDesktopUrl ?? undefined
  const fondoMobile = decada.imagenFondoMobileUrl ?? fondoDesktop

  return (
    <div
      data-decada={decada.slug}
      style={decadaThemeVars(decada.paleta)}
      className="relative min-h-[60vh] -mx-4 px-4 overflow-hidden"
    >
      {/* Fondo: imagen configurada para el breakpoint, o el color sólido
          de la década (--color-bg, redefinido por data-decada) si no hay. */}
      <div
        className={
          fondoMobile
            ? 'absolute inset-0 md:hidden bg-cover bg-center'
            : 'absolute inset-0 md:hidden bg-bg'
        }
        style={fondoMobile ? { backgroundImage: `url(${fondoMobile})` } : undefined}
        aria-hidden="true"
      />
      <div
        className={
          fondoDesktop
            ? 'absolute inset-0 hidden md:block bg-cover bg-center'
            : 'absolute inset-0 hidden md:block bg-bg'
        }
        style={fondoDesktop ? { backgroundImage: `url(${fondoDesktop})` } : undefined}
        aria-hidden="true"
      />

      <EpocaEffect slug={decada.slug} />
      <h1 className="font-heading relative z-10">{decada.nombre}</h1>
      <DecadaAccentBar />
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