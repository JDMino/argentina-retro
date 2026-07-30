import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export interface DecadaPaleta {
  acento: string
  primario: string
  secundario: string
}

export interface Decada {
  id: string
  nombre: string
  slug: string
  anioInicio: number
  anioFin: number
  descripcion: string
  paleta: DecadaPaleta
  imagenFondoDesktopUrl: string | null
  imagenFondoMobileUrl: string | null
  orden: number
  activa: boolean
}

export async function getDecadas(soloActivas?: boolean): Promise<Decada[]> {
  const { data } = await api.get<Decada[]>('/decadas', {
    params: soloActivas ? { activa: true } : undefined,
  })
  return data
}

export interface DecadaInput {
  nombre: string
  slug: string
  anioInicio: number
  anioFin: number
  descripcion?: string
  paleta?: Partial<DecadaPaleta>
  imagenFondoDesktopUrl: string | null
  imagenFondoMobileUrl: string | null
  orden?: number
  activa?: boolean
}

function authHeader(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } }
}

export async function getDecada(id: string): Promise<Decada> {
  const { data } = await api.get<Decada>(`/decadas/${id}`)
  return data
}

export async function createDecada(token: string, dto: DecadaInput): Promise<Decada> {
  const { data } = await api.post<Decada>('/decadas', dto, authHeader(token))
  return data
}

export async function updateDecada(
  token: string,
  id: string,
  dto: Partial<DecadaInput>,
): Promise<Decada> {
  const { data } = await api.patch<Decada>(`/decadas/${id}`, dto, authHeader(token))
  return data
}

export async function deleteDecada(token: string, id: string): Promise<void> {
  await api.delete(`/decadas/${id}`, authHeader(token))
}