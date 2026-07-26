import { useParams } from 'react-router-dom'
import { useContenido } from './useContenido'
import { decadaThemeVars } from '../decadas/decadas.theme'
import { useDecadas } from '../decadas/useDecadas'
import { FavoritoButton } from '../../shared/components/ui/FavoritoButton'
import { ComentariosSection } from './ComentariosSection'

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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {imagenes.map((imagen) => (
            <img
              key={imagen.id}
              src={imagen.url}
              alt={imagen.textoAlternativo ?? ''}
              className="w-full h-auto rounded-lg border border-border"
            />
          ))}
        </div>
      )}

      {videos.length > 0 && (
        <div className="flex flex-col gap-6 mt-6">
          {videos.map((video) => (
            <div key={video.id}>
              {video.titulo && <p className="text-text-secondary mb-2">{video.titulo}</p>}
              <div className="aspect-video">
                <iframe
                  className="w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${video.youtubeVideoId}`}
                  title={video.titulo ?? contenido.titulo}
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>
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