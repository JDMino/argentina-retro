import { useEffect, useRef, useState } from 'react'
import type { Video } from '../../services/contenido.service'
import { useMediaQuery } from '../../shared/hooks/useMediaQuery'

interface VideosPlaylistProps {
  videos: Video[]
  tituloContenido: string
}

const ALTURA_SCROLL_MOBILE = 320

export function VideosPlaylist({ videos, tituloContenido }: VideosPlaylistProps) {
  const [indice, setIndice] = useState(0)
  const videoColumnaRef = useRef<HTMLDivElement>(null)
  const [alturaVideo, setAlturaVideo] = useState<number | undefined>(undefined)
  const esDesktop = useMediaQuery('(min-width: 1024px)')

  useEffect(() => {
    const elemento = videoColumnaRef.current
    if (!elemento) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setAlturaVideo(entry.contentRect.height)
    })
    observer.observe(elemento)

    return () => observer.disconnect()
  }, [])

  if (videos.length === 0) return null

  const videoActual = videos[indice]
  const hayVarios = videos.length > 1

  let estiloSidebar: React.CSSProperties | undefined
  if (esDesktop) {
    estiloSidebar = alturaVideo ? { maxHeight: alturaVideo, overflowY: 'auto' } : undefined
  } else if (videos.length > 2) {
    estiloSidebar = { maxHeight: ALTURA_SCROLL_MOBILE, overflowY: 'auto' }
  }

  return (
    <div className="mt-6 relative z-10 bg-bg/80 backdrop-blur-sm rounded-lg p-4">
      <div
        className={
          hayVarios
            ? 'grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 lg:items-start'
            : 'lg:max-w-xl lg:mx-auto'
        }
      >
        <div ref={videoColumnaRef}>
          {videoActual.titulo && (
            <p className="text-text-secondary mb-2">{videoActual.titulo}</p>
          )}
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube-nocookie.com/embed/${videoActual.youtubeVideoId}`}
              title={videoActual.titulo ?? tituloContenido}
              allowFullScreen
            />
          </div>
        </div>

        {hayVarios && (
          <div
            className="flex flex-col gap-2 lg:pr-1 bg-bg-secondary/50 rounded-lg p-2"
            style={estiloSidebar}
          >
            {videos.map((video, i) => (
              <button
                key={video.id}
                type="button"
                onClick={() => setIndice(i)}
                aria-label={video.titulo ?? `Video ${i + 1}`}
                className={
                  i === indice
                    ? 'flex items-center gap-2 p-2 rounded-lg border border-accent bg-bg-secondary text-left'
                    : 'flex items-center gap-2 p-2 rounded-lg border border-border hover:border-accent/50 text-left transition-colors'
                }
              >
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeVideoId}/mqdefault.jpg`}
                  alt=""
                  className="w-24 aspect-video object-cover rounded-md flex-shrink-0"
                />
                <span className="text-sm text-text line-clamp-2">
                  {video.titulo ?? `Video ${i + 1}`}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}