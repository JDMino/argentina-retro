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