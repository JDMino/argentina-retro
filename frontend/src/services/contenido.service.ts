import axios from 'axios'

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
  imagenes: Imagen[]
  videos: Video[]
  contenidoEtiquetas: ContenidoEtiqueta[]
}

interface ContenidoListResponse {
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
    params: { decadaId, categoriaId, limite: 100 },
  })
  return data.items
}

export async function getContenidoPorSlug(slug: string): Promise<Contenido> {
  const { data } = await api.get<Contenido>(`/contenido/slug/${slug}`)
  return data
}