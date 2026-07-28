import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  getMe,
  login as loginRequest,
  register as registerRequest,
  actualizarPerfil as actualizarPerfilRequest,
  cambiarPassword as cambiarPasswordRequest,
  type LoginPayload,
  type RegisterPayload,
  type Usuario,
  type UpdatePerfilPayload,
  type CambiarPasswordPayload,
} from '../../services/auth.service'
const TOKEN_STORAGE_KEY = 'argentina-retro:token'

interface AuthContextValue {
  usuario: Usuario | null
  token: string | null
  loading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  actualizarPerfil: (payload: UpdatePerfilPayload) => Promise<void>
  cambiarPassword: (payload: CambiarPasswordPayload) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY))
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function cargarSesion() {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const data = await getMe(token)
        if (!cancelled) setUsuario(data)
      } catch {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_STORAGE_KEY)
          setToken(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    cargarSesion()

    return () => {
      cancelled = true
    }
  }, [token])

  function persistSession(accessToken: string, usuarioData: Usuario) {
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken)
    setToken(accessToken)
    setUsuario(usuarioData)
  }

  async function login(payload: LoginPayload) {
    const data = await loginRequest(payload)
    persistSession(data.accessToken, data.usuario)
  }

  async function register(payload: RegisterPayload) {
    const data = await registerRequest(payload)
    persistSession(data.accessToken, data.usuario)
  }

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken(null)
    setUsuario(null)
  }

  async function actualizarPerfil(payload: UpdatePerfilPayload) {
    if (!token) return
    const actualizado = await actualizarPerfilRequest(token, payload)
    setUsuario(actualizado)
  }

  async function cambiarPassword(payload: CambiarPasswordPayload) {
    if (!token) return
    await cambiarPasswordRequest(token, payload)
    setUsuario((prev) => (prev ? { ...prev, debeCambiarPassword: false } : prev))
  }

  return (
    <AuthContext.Provider
      value={{ usuario, token, loading, login, register, logout, actualizarPerfil, cambiarPassword }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}