import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'
import {
  getFavoritos,
  addFavorito,
  removeFavorito,
  type Favorito,
} from '../../services/favoritos.service'

interface FavoritosContextValue {
  favoritos: Favorito[]
  loading: boolean
  estaEnFavoritos: (contenidoId: string) => boolean
  toggleFavorito: (contenidoId: string) => Promise<void>
}

const FavoritosContext = createContext<FavoritosContextValue | undefined>(undefined)

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const { usuario, token } = useAuth()
  const [favoritos, setFavoritos] = useState<Favorito[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function cargar() {
      if (!usuario || !token) {
        setFavoritos([])
        return
      }
      setLoading(true)
      try {
        const data = await getFavoritos(token)
        if (!cancelled) setFavoritos(data)
      } catch {
        if (!cancelled) setFavoritos([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    cargar()

    return () => {
      cancelled = true
    }
  }, [usuario, token])

  function estaEnFavoritos(contenidoId: string): boolean {
    return favoritos.some((f) => f.contenidoId === contenidoId)
  }

  async function toggleFavorito(contenidoId: string) {
    if (!token) return

    if (estaEnFavoritos(contenidoId)) {
      await removeFavorito(token, contenidoId)
      setFavoritos((prev) => prev.filter((f) => f.contenidoId !== contenidoId))
    } else {
      await addFavorito(token, contenidoId)
      // Recargamos la lista completa en vez de mergear la respuesta del POST:
      // el POST no devuelve el "contenido" embebido (el service de favoritos no
      // carga esa relación al crear), y sin él la miniatura en "Mis favoritos"
      // quedaría rota hasta el próximo refresh.
      const actualizados = await getFavoritos(token)
      setFavoritos(actualizados)
    }
  }

  return (
    <FavoritosContext.Provider value={{ favoritos, loading, estaEnFavoritos, toggleFavorito }}>
      {children}
    </FavoritosContext.Provider>
  )
}

export function useFavoritos(): FavoritosContextValue {
  const context = useContext(FavoritosContext)
  if (!context) {
    throw new Error('useFavoritos debe usarse dentro de un FavoritosProvider')
  }
  return context
}