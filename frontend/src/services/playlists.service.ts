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

export async function getPlaylists(): Promise<Playlist[]> {
  const { data } = await api.get<Playlist[]>('/playlists')
  return data
}

export interface PlaylistInput {
  nombre: string
  youtubePlaylistId?: string
  descripcion?: string
  decadaId?: string | null
  categoriaId?: string | null
}

function authHeader(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } }
}

export async function getPlaylist(id: string): Promise<Playlist> {
  const { data } = await api.get<Playlist>(`/playlists/${id}`)
  return data
}

export async function createPlaylist(token: string, dto: PlaylistInput): Promise<Playlist> {
  const { data } = await api.post<Playlist>('/playlists', dto, authHeader(token))
  return data
}

export async function updatePlaylist(
  token: string,
  id: string,
  dto: Partial<PlaylistInput>,
): Promise<Playlist> {
  const { data } = await api.patch<Playlist>(`/playlists/${id}`, dto, authHeader(token))
  return data
}

export async function deletePlaylist(token: string, id: string): Promise<void> {
  await api.delete(`/playlists/${id}`, authHeader(token))
}