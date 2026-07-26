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

function authHeader(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } }
}

export async function getComentarios(contenidoId: string): Promise<Comentario[]> {
  const { data } = await api.get<Comentario[]>('/comentarios', {
    params: { contenidoId },
  })
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