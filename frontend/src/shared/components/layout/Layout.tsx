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
            <Link to="/buscar" aria-label="Buscar" className="text-text-secondary">
              <span className="md:hidden" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <span className="hidden md:inline">Buscar</span>
            </Link>
            {loading ? null : usuario ? (
              <>
                <Link to="/perfil" className="text-text-secondary">
                  Hola, {usuario.nombre ?? usuario.email}
                </Link>
                <Link to="/favoritos" className="text-text-secondary">
                  Mis favoritos
                </Link>
                {usuario.roles.includes('admin') && (
                  <Link to="/admin" className="text-text-secondary">
                    Panel admin
                  </Link>
                )}
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