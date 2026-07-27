import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export interface Rol {
  id: string
  nombre: string
  descripcion: string | null
}

export async function getRoles(token: string): Promise<Rol[]> {
  const { data } = await api.get<Rol[]>('/roles', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}