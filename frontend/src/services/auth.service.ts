import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export interface Usuario {
  id: string
  email: string
  nombre: string | null
  roles: string[]
}

export interface AuthResponse {
  accessToken: string
  usuario: Usuario
}

export interface RegisterPayload {
  email: string
  password: string
  nombre?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', payload)
  return data
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload)
  return data
}

export async function getMe(token: string): Promise<Usuario> {
  const { data } = await api.get<Usuario>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}