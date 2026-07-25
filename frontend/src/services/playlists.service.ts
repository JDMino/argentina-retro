import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export interface Playlist {
  id: string
  nombre: string
  youtubePlaylistId: string | null
  descripcion: string | null
  decadaId: string | null
  categoriaId: string | null
}

export async function getPlaylistPorDecada(decadaId: string): Promise<Playlist[]> {
  const { data } = await api.get<Playlist[]>('/playlists', {
    params: { decadaId },
  })
  return data
}