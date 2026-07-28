import axios from 'axios'
import type { DecadaPaleta } from './decadas.service'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export interface Imagen {
  id: string
  url: string
  textoAlternativo: string | null
  orden: number
}

export interface Video {
  id: string
  youtubeVideoId: string
  titulo: string | null
  orden: number
}

export interface EnlaceExterno {
  etiqueta: string
  url: string
}

export interface Etiqueta {
  id: string
  nombre: string
  slug: string
}

export interface ContenidoEtiqueta {
  etiqueta: Etiqueta
}

export interface Contenido {
  id: string
  titulo: string
  slug: string
  descripcion: string | null
  anio: number | null
  enlacesExternos: EnlaceExterno[] | null
  publicado: boolean
  decadaId: string
  categoriaId: string
  decada?: { id: string; nombre: string; slug: string; paleta: DecadaPaleta }
  categoria?: { id: string; nombre: string; slug: string }
  imagenes: Imagen[]
  videos: Video[]
  contenidoEtiquetas: ContenidoEtiqueta[]
}

export interface ContenidoListResponse {
  items: Contenido[]
  total: number
  pagina: number
  limite: number
}

export async function getContenidoPorCategoria(
  decadaId: string,
  categoriaId: string,
): Promise<Contenido[]> {
  const { data } = await api.get<ContenidoListResponse>('/contenido', {
    params: { decadaId, categoriaId, publicado: true, limite: 100 },
  })
  return data.items
}

export interface BuscarContenidoFiltros {
  q?: string
  decadaId?: string
  categoriaId?: string
  etiquetaId?: string
  anio?: number
  pagina?: number
  limite?: number
}

export async function buscarContenido(
  filtros: BuscarContenidoFiltros,
): Promise<ContenidoListResponse> {
  const { data } = await api.get<ContenidoListResponse>('/contenido', {
    params: { ...filtros, publicado: true },
  })
  return data
}

export async function getContenidoPorSlug(slug: string): Promise<Contenido> {
  const { data } = await api.get<Contenido>(`/contenido/slug/${slug}`)
  return data
}

export interface ContenidoAdminFiltros {
  q?: string
  decadaId?: string
  categoriaId?: string
  anio?: number
}

export async function getContenidoAdmin(
  pagina = 1,
  limite = 20,
  filtros: ContenidoAdminFiltros = {},
): Promise<ContenidoListResponse> {
  const { data } = await api.get<ContenidoListResponse>('/contenido', {
    params: { pagina, limite, ...filtros },
  })
  return data
}

export async function getContenidoPorId(id: string): Promise<Contenido> {
  const { data } = await api.get<Contenido>(`/contenido/${id}`)
  return data
}

export interface ImagenInput {
  url: string
  textoAlternativo?: string
  orden?: number
}

export interface VideoInput {
  youtubeVideoId: string
  titulo?: string
  orden?: number
}

export interface ContenidoInput {
  titulo: string
  slug: string
  descripcion?: string
  anio?: number
  decadaId: string
  categoriaId: string
  enlacesExternos?: EnlaceExterno[]
  publicado?: boolean
  imagenes?: ImagenInput[]
  videos?: VideoInput[]
  etiquetaIds?: string[]
}

function authHeader(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } }
}

export async function createContenido(token: string, dto: ContenidoInput): Promise<Contenido> {
  const { data } = await api.post<Contenido>('/contenido', dto, authHeader(token))
  return data
}

export async function updateContenido(
  token: string,
  id: string,
  dto: Partial<ContenidoInput>,
): Promise<Contenido> {
  const { data } = await api.patch<Contenido>(`/contenido/${id}`, dto, authHeader(token))
  return data
}

export async function deleteContenido(token: string, id: string): Promise<void> {
  await api.delete(`/contenido/${id}`, authHeader(token))
}