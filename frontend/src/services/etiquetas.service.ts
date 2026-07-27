import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export interface Etiqueta {
  id: string
  nombre: string
  slug: string
}

export interface EtiquetaInput {
  nombre: string
  slug: string
}

function authHeader(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } }
}

export async function getEtiquetas(): Promise<Etiqueta[]> {
  const { data } = await api.get<Etiqueta[]>('/etiquetas')
  return data
}

export async function createEtiqueta(token: string, dto: EtiquetaInput): Promise<Etiqueta> {
  const { data } = await api.post<Etiqueta>('/etiquetas', dto, authHeader(token))
  return data
}