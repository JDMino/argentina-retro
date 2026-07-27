import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/decadas', label: 'Décadas' },
  { to: '/admin/categorias', label: 'Categorías' },
  { to: '/admin/contenido', label: 'Contenido' },
  { to: '/admin/playlists', label: 'Playlists' },
  { to: '/admin/comentarios', label: 'Comentarios' },
]

export function AdminLayout() {
  const { usuario, logout } = useAuth()

  return (
    <div className="min-h-screen bg-bg text-text flex">
      <aside className="w-56 shrink-0 border-r border-border flex flex-col">
        <div className="px-4 py-4 border-b border-border">
          <Link to="/" className="font-sans font-semibold text-base text-text no-underline">
            Argentina <span className="text-accent">Retro</span>
          </Link>
          <p className="font-sans text-text-secondary text-xs mt-1">Panel administrativo</p>
        </div>

        <nav className="flex-1 flex flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md font-sans text-sm no-underline transition-colors duration-150 ${
                  isActive
                    ? 'bg-accent text-bg font-medium'
                    : 'text-text-secondary hover:bg-bg-secondary hover:text-text'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-border flex flex-col gap-2">
          <Link to="/" className="font-sans text-text-secondary text-xs no-underline hover:text-text">
            ← Volver al sitio
          </Link>
          <div className="flex items-center justify-between gap-2">
            <span className="font-sans text-text-secondary text-xs truncate">
              {usuario?.nombre ?? usuario?.email}
            </span>
            <button
              onClick={logout}
              className="font-sans text-accent text-xs cursor-pointer shrink-0"
            >
              Salir
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}