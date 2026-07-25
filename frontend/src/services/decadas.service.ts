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
  orden: number
  activa: boolean
}

export async function getDecadas(): Promise<Decada[]> {
  const { data } = await api.get<Decada[]>('/decadas')
  return data
}