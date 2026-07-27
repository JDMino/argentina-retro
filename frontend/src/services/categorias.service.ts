import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export interface Categoria {
  id: string
  nombre: string
  slug: string
  icono: string | null
  descripcion: string | null
  orden: number
  activa: boolean
}

export async function getCategoriasPorDecada(decadaId: string): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>('/categorias', {
    params: { decadaId },
  })
  return data
}

export async function getCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>('/categorias')
  return data
}

export interface CategoriaInput {
  nombre: string
  slug: string
  icono?: string
  descripcion?: string
  orden?: number
  activa?: boolean
}

function authHeader(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } }
}

export async function getCategoria(id: string): Promise<Categoria> {
  const { data } = await api.get<Categoria>(`/categorias/${id}`)
  return data
}

export async function createCategoria(token: string, dto: CategoriaInput): Promise<Categoria> {
  const { data } = await api.post<Categoria>('/categorias', dto, authHeader(token))
  return data
}

export async function updateCategoria(
  token: string,
  id: string,
  dto: Partial<CategoriaInput>,
): Promise<Categoria> {
  const { data } = await api.patch<Categoria>(`/categorias/${id}`, dto, authHeader(token))
  return data
}

export async function deleteCategoria(token: string, id: string): Promise<void> {
  await api.delete(`/categorias/${id}`, authHeader(token))
}