import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../modules/auth/AuthContext'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { usuario, loading, logout } = useAuth()

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-sans font-semibold text-lg text-text no-underline">
            Argentina <span className="text-accent">Retro</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {loading ? null : usuario ? (
              <>
                <Link to="/perfil" className="text-text-secondary">
                  Hola, {usuario.nombre ?? usuario.email}
                </Link>
                <Link to="/favoritos" className="text-text-secondary">
                  Mis favoritos
                </Link>
                <button onClick={logout} className="text-accent">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-text-secondary">
                  Ingresar
                </Link>
                <Link to="/registro" className="text-accent">
                  Registrarme
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
      </main>
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-text-secondary text-sm">
          Argentina Retro — un viaje por la historia reciente
        </div>
      </footer>
    </div>
  )
}