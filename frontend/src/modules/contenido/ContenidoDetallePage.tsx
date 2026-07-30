import { useParams } from 'react-router-dom'
import { useContenido } from './useContenido'
import { decadaThemeVars } from '../decadas/decadas.theme'
import { useDecadas } from '../decadas/useDecadas'
import { FavoritoButton } from '../../shared/components/ui/FavoritoButton'
import { ComentariosSection } from './ComentariosSection'
import { ImagenesCarousel } from './ImagenesCarousel'
import { VideosPlaylist } from './VideosPlaylist'

export function ContenidoDetallePage() {
  const { contenidoSlug } = useParams<{ contenidoSlug: string }>()
  const { contenido, loading, error } = useContenido(contenidoSlug)
  const { decadas } = useDecadas()

  if (loading) return <p>Cargando...</p>
  if (error) return <p className="text-error">{error}</p>
  if (!contenido) return <p>Contenido no encontrado.</p>

  const decada = decadas.find((d) => d.id === contenido.decadaId)
  const imagenes = [...contenido.imagenes].sort((a, b) => a.orden - b.orden)
  const videos = [...contenido.videos].sort((a, b) => a.orden - b.orden)
  const etiquetas = contenido.contenidoEtiquetas.map((ce) => ce.etiqueta)

  return (
    <div
      data-decada={decada?.slug}
      style={decada ? decadaThemeVars(decada.paleta) : undefined}
      className="relative -mx-4 px-4"
    >
      <div className="flex flex-wrap items-center gap-4 relative z-10">
        <h1 className="font-heading">{contenido.titulo}</h1>
        <FavoritoButton contenidoId={contenido.id} />
      </div>
      {contenido.anio && <p className="text-text-secondary">{contenido.anio}</p>}

      {contenido.descripcion && (
        <p className="text-text-secondary mt-4 max-w-2xl">{contenido.descripcion}</p>
      )}

      {imagenes.length > 0 && (
        <ImagenesCarousel imagenes={imagenes} tituloContenido={contenido.titulo} />
      )}

      {videos.length > 0 && (
        <VideosPlaylist videos={videos} tituloContenido={contenido.titulo} />
      )}

      {etiquetas.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {etiquetas.map((etiqueta) => (
            <span
              key={etiqueta.id}
              className="text-xs px-2 py-1 rounded-full bg-bg-secondary border border-border text-text-secondary"
            >
              {etiqueta.nombre}
            </span>
          ))}
        </div>
      )}

      {contenido.enlacesExternos && contenido.enlacesExternos.length > 0 && (
        <div className="flex flex-col gap-1 mt-6">
          {contenido.enlacesExternos.map((enlace) => (
            <a
              key={enlace.url}
              href={enlace.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              {enlace.etiqueta}
            </a>
          ))}
        </div>
      )}

      <ComentariosSection contenidoId={contenido.id} />
    </div>
  )
}