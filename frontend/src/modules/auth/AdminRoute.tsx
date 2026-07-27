import type { ReactNode } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function AdminRoute({ children }: { children: ReactNode }) {
  const { usuario, loading, logout } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!usuario) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (!usuario.roles.includes('admin')) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center px-4">
        <div className="max-w-md text-center flex flex-col gap-4">
          <h1 className="font-sans font-semibold text-xl text-text">
            Acceso restringido
          </h1>
          <p className="font-sans text-text-secondary text-sm">
            Esta sección es solo para administradores. Tu cuenta ({usuario.email}) no
            tiene ese permiso.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/" className="font-sans text-sm text-accent no-underline">
              Volver al inicio
            </Link>
            <button
              onClick={logout}
              className="font-sans text-sm text-text-secondary cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}