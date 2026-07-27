import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export interface UsuarioAdmin {
  id: string
  email: string
  nombre: string | null
  activo: boolean
  debeCambiarPassword: boolean
  roles: string[]
  createdAt: string
}

export interface UsuarioAdminInput {
  email?: string
  nombre?: string
  activo?: boolean
  roles?: string[]
}

function authHeader(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } }
}

export async function getUsuariosAdmin(token: string): Promise<UsuarioAdmin[]> {
  const { data } = await api.get<UsuarioAdmin[]>('/usuarios', authHeader(token))
  return data
}

export async function getUsuarioAdmin(token: string, id: string): Promise<UsuarioAdmin> {
  const { data } = await api.get<UsuarioAdmin>(`/usuarios/${id}`, authHeader(token))
  return data
}

export async function updateUsuarioAdmin(
  token: string,
  id: string,
  dto: UsuarioAdminInput,
): Promise<UsuarioAdmin> {
  const { data } = await api.patch<UsuarioAdmin>(`/usuarios/${id}`, dto, authHeader(token))
  return data
}

export async function deleteUsuarioAdmin(token: string, id: string): Promise<void> {
  await api.delete(`/usuarios/${id}`, authHeader(token))
}

export async function resetearPasswordUsuario(
  token: string,
  id: string,
): Promise<{ passwordTemporal: string }> {
  const { data } = await api.post<{ passwordTemporal: string }>(
    `/usuarios/${id}/resetear-password`,
    {},
    authHeader(token),
  )
  return data
}