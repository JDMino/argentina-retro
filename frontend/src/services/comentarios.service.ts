import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export interface ComentarioUsuario {
  id: string
  nombre: string | null
  email: string
}

export interface Comentario {
  id: string
  texto: string
  createdAt: string
  updatedAt: string
  usuarioId: string
  usuario: ComentarioUsuario
}

interface ComentariosResponse {
  items: Comentario[]
  total: number
  pagina: number
  limite: number
}

function authHeader(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } }
}

export async function getComentarios(
  contenidoId: string,
  pagina = 1,
  limite = 10,
): Promise<ComentariosResponse> {
  const { data } = await api.get<ComentariosResponse>('/comentarios', {
    params: { contenidoId, pagina, limite },
  })
  return data
}

export interface ComentarioAdmin extends Comentario {
  aprobado: boolean
  contenidoId: string
  contenido: { id: string; titulo: string; slug: string }
}

interface ComentariosAdminResponse {
  items: ComentarioAdmin[]
  total: number
  pagina: number
  limite: number
}

export interface ComentariosAdminFiltros {
  aprobado?: boolean
  contenidoId?: string
  q?: string
}

export async function getComentariosAdmin(
  token: string,
  pagina = 1,
  limite = 20,
  filtros: ComentariosAdminFiltros = {},
): Promise<ComentariosAdminResponse> {
  const { data } = await api.get<ComentariosAdminResponse>('/comentarios/admin', {
    params: { pagina, limite, ...filtros },
    ...authHeader(token),
  })
  return data
}

export async function moderarComentario(
  token: string,
  id: string,
  aprobado: boolean,
): Promise<ComentarioAdmin> {
  const { data } = await api.patch<ComentarioAdmin>(
    `/comentarios/${id}/moderacion`,
    { aprobado },
    authHeader(token),
  )
  return data
}

export async function crearComentario(
  token: string,
  contenidoId: string,
  texto: string,
): Promise<Comentario> {
  const { data } = await api.post<Comentario>(
    '/comentarios',
    { contenidoId, texto },
    authHeader(token),
  )
  return data
}

export async function editarComentario(
  token: string,
  id: string,
  texto: string,
): Promise<Comentario> {
  const { data } = await api.patch<Comentario>(`/comentarios/${id}`, { texto }, authHeader(token))
  return data
}

export async function borrarComentario(token: string, id: string): Promise<void> {
  await api.delete(`/comentarios/${id}`, authHeader(token))
}