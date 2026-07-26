import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  getMe,
  login as loginRequest,
  register as registerRequest,
  type LoginPayload,
  type RegisterPayload,
  type Usuario,
} from '../../services/auth.service'

const TOKEN_STORAGE_KEY = 'argentina-retro:token'

interface AuthContextValue {
  usuario: Usuario | null
  loading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY))
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    let cancelled = false
    getMe(token)
      .then((data) => {
        if (!cancelled) setUsuario(data)
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_STORAGE_KEY)
          setToken(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
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

  return (
    <AuthContext.Provider value={{ usuario, loading, login, register, logout }}>
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