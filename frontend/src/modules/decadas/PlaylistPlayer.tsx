import type { Playlist } from '../../services/playlists.service'

interface PlaylistPlayerProps {
  playlist: Playlist
}

export function PlaylistPlayer({ playlist }: PlaylistPlayerProps) {
  if (!playlist.youtubePlaylistId) return null

  return (
    <div className="mb-10">
      <h2 className="relative z-10">{playlist.nombre}</h2>
      {playlist.descripcion && (
        <p className="text-text-secondary relative z-10 mb-4">{playlist.descripcion}</p>
      )}
      <div className="aspect-video relative z-10 rounded-lg overflow-hidden border border-border bg-bg-secondary">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/videoseries?list=${playlist.youtubePlaylistId}`}
          title={playlist.nombre}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}