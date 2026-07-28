import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export interface Etiqueta {
  id: string
  nombre: string
  slug: string
}

export interface EtiquetaAdmin extends Etiqueta {
  contadorUso: number
}

export interface EtiquetaInput {
  nombre: string
  slug: string
}

function authHeader(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } }
}

export async function getEtiquetas(): Promise<EtiquetaAdmin[]> {
  const { data } = await api.get<EtiquetaAdmin[]>('/etiquetas')
  return data
}

export async function createEtiqueta(token: string, dto: EtiquetaInput): Promise<Etiqueta> {
  const { data } = await api.post<Etiqueta>('/etiquetas', dto, authHeader(token))
  return data
}

export async function updateEtiqueta(
  token: string,
  id: string,
  dto: Partial<EtiquetaInput>,
): Promise<Etiqueta> {
  const { data } = await api.patch<Etiqueta>(`/etiquetas/${id}`, dto, authHeader(token))
  return data
}

export async function deleteEtiqueta(token: string, id: string): Promise<void> {
  await api.delete(`/etiquetas/${id}`, authHeader(token))
}