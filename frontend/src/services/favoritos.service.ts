import axios from 'axios'
import type { Contenido } from './contenido.service'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export interface Favorito {
  id: string
  usuarioId: string
  contenidoId: string
  createdAt: string
  contenido: Contenido
}

function authHeader(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } }
}

export async function getFavoritos(token: string): Promise<Favorito[]> {
  const { data } = await api.get<Favorito[]>('/favoritos', authHeader(token))
  return data
}

export async function addFavorito(token: string, contenidoId: string): Promise<Favorito> {
  const { data } = await api.post<Favorito>('/favoritos', { contenidoId }, authHeader(token))
  return data
}

export async function removeFavorito(token: string, contenidoId: string): Promise<void> {
  await api.delete(`/favoritos/${contenidoId}`, authHeader(token))
}