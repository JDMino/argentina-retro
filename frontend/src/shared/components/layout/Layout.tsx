import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../modules/auth/AuthContext'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { usuario, loading, logout } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const enlacesSesion = loading ? null : usuario ? (
    <>
      <Link to="/perfil" className="text-text-secondary" onClick={() => setMenuAbierto(false)}>
        Hola, {usuario.nombre ?? usuario.email}
      </Link>
      <Link to="/favoritos" className="text-text-secondary" onClick={() => setMenuAbierto(false)}>
        Mis favoritos
      </Link>
      {usuario.roles.includes('admin') && (
        <Link to="/admin" className="text-text-secondary" onClick={() => setMenuAbierto(false)}>
          Panel admin
        </Link>
      )}
      <button
        onClick={() => {
          logout()
          setMenuAbierto(false)
        }}
        className="text-accent text-left"
      >
        Cerrar sesión
      </button>
    </>
  ) : (
    <>
      <Link to="/login" className="text-text-secondary" onClick={() => setMenuAbierto(false)}>
        Ingresar
      </Link>
      <Link to="/registro" className="text-accent" onClick={() => setMenuAbierto(false)}>
        Registrarme
      </Link>
    </>
  )

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <header className="border-b border-border relative">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-sans font-semibold text-lg text-text no-underline" onClick={() => setMenuAbierto(false)}>
            Argentina <span className="text-accent">Retro</span>
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <Link to="/buscar" aria-label="Buscar" className="text-text-secondary" onClick={() => setMenuAbierto(false)}>
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

            {/* Desktop: enlaces siempre visibles */}
            <nav className="hidden md:flex items-center gap-4">{enlacesSesion}</nav>

            {/* Mobile: botón hamburguesa */}
            <button
              className="md:hidden text-text-secondary"
              aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuAbierto}
              onClick={() => setMenuAbierto((v) => !v)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuAbierto ? (
                  <>
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile: panel desplegable */}
        {menuAbierto && (
          <nav className="md:hidden border-t border-border px-4 py-3 flex flex-col gap-3 text-sm bg-bg">
            {enlacesSesion}
          </nav>
        )}
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