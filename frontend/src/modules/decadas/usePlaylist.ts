import { useEffect, useState } from 'react'
import { getPlaylistPorDecada, type Playlist } from '../../services/playlists.service'

interface UsePlaylistResult {
  playlist: Playlist | null
  loading: boolean
  error: string | null
}

export function usePlaylist(decadaId: string | undefined): UsePlaylistResult {
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function cargar() {
      if (!decadaId) {
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const data = await getPlaylistPorDecada(decadaId)
        if (!cancelled) setPlaylist(data[0] ?? null)
      } catch {
        if (!cancelled) setError('No pudimos cargar la playlist.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    cargar()

    return () => {
      cancelled = true
    }
  }, [decadaId])

  return { playlist, loading, error }
}