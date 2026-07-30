import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export interface Configuracion {
  id: string
  homeFondoDesktopUrl: string | null
  homeFondoMobileUrl: string | null
}

export interface ConfiguracionInput {
  homeFondoDesktopUrl?: string | null
  homeFondoMobileUrl?: string | null
}

function authHeader(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } }
}

export async function getConfiguracion(): Promise<Configuracion> {
  const { data } = await api.get<Configuracion>('/configuracion')
  return data
}

export async function updateConfiguracion(
  token: string,
  dto: ConfiguracionInput,
): Promise<Configuracion> {
  const { data } = await api.patch<Configuracion>('/configuracion', dto, authHeader(token))
  return data
}