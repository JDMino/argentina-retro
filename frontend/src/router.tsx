import { Suspense, lazy, useEffect, useRef, useState, type ComponentType } from 'react'
import { createBrowserRouter, Navigate, Outlet, useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Layout } from './shared/components/layout/Layout'
import { HomePage } from './modules/home/HomePage'
import { DecadaPage } from './modules/decadas/DecadaPage'
import { WarpTunnel } from './shared/components/effects/WarpTunnel'
import { CategoriaPage } from './modules/categorias/CategoriaPage'
import { ContenidoDetallePage } from './modules/contenido/ContenidoDetallePage'
import { BuscadorPage } from './modules/contenido/BuscadorPage'
import { ProtectedRoute } from './modules/auth/ProtectedRoute'
import { AdminRoute } from './modules/auth/AdminRoute'
import { useAuth } from './modules/auth/AuthContext'
import { AdminLayout } from './modules/admin/AdminLayout'

// Helper para adaptar React.lazy() (que espera `{ default: Component }`) al
// patrón `export function X` (named export) que usa todo el proyecto.
function lazyNamed<P extends object>(
  loader: () => Promise<Record<string, ComponentType<P>>>,
  name: string,
) {
  return lazy(() => loader().then((m) => ({ default: m[name] })))
}

// Páginas de auth/perfil/favoritos: visitadas por una fracción de usuarios,
// no forman parte de la experiencia núcleo de "viaje en el tiempo".
const LoginPage = lazyNamed(() => import('./modules/auth/LoginPage'), 'LoginPage')
const RegisterPage = lazyNamed(() => import('./modules/auth/RegisterPage'), 'RegisterPage')
const PerfilPage = lazyNamed(() => import('./modules/auth/PerfilPage'), 'PerfilPage')
const CambiarPasswordObligatorioPage = lazyNamed(
  () => import('./modules/auth/CambiarPasswordObligatorioPage'),
  'CambiarPasswordObligatorioPage',
)
const MisFavoritosPage = lazyNamed(
  () => import('./modules/favoritos/MisFavoritosPage'),
  'MisFavoritosPage',
)

// Panel admin completo: nunca lo visita un usuario público, así que todo su
// código (13 páginas) queda en chunks separados que jamás se descargan
// fuera de /admin.
const AdminHomePage = lazyNamed(() => import('./modules/admin/AdminHomePage'), 'AdminHomePage')
const AdminDecadasPage = lazyNamed(
  () => import('./modules/admin/decadas/AdminDecadasPage'),
  'AdminDecadasPage',
)
const DecadaFormPage = lazyNamed(
  () => import('./modules/admin/decadas/DecadaFormPage'),
  'DecadaFormPage',
)
const AdminCategoriasPage = lazyNamed(
  () => import('./modules/admin/categorias/AdminCategoriasPage'),
  'AdminCategoriasPage',
)
const CategoriaFormPage = lazyNamed(
  () => import('./modules/admin/categorias/CategoriaFormPage'),
  'CategoriaFormPage',
)
const AdminContenidoPage = lazyNamed(
  () => import('./modules/admin/contenido/AdminContenidoPage'),
  'AdminContenidoPage',
)
const ContenidoFormPage = lazyNamed(
  () => import('./modules/admin/contenido/ContenidoFormPage'),
  'ContenidoFormPage',
)
const AdminPlaylistsPage = lazyNamed(
  () => import('./modules/admin/playlists/AdminPlaylistsPage'),
  'AdminPlaylistsPage',
)
const PlaylistFormPage = lazyNamed(
  () => import('./modules/admin/playlists/PlaylistFormPage'),
  'PlaylistFormPage',
)
const AdminEtiquetasPage = lazyNamed(
  () => import('./modules/admin/etiquetas/AdminEtiquetasPage'),
  'AdminEtiquetasPage',
)
const AdminComentariosPage = lazyNamed(
  () => import('./modules/admin/comentarios/AdminComentariosPage'),
  'AdminComentariosPage',
)
const AdminUsuariosPage = lazyNamed(
  () => import('./modules/admin/usuarios/AdminUsuariosPage'),
  'AdminUsuariosPage',
)
const UsuarioFormPage = lazyNamed(
  () => import('./modules/admin/usuarios/UsuarioFormPage'),
  'UsuarioFormPage',
)

const WARP_DURATION = 700

const DECADA_ACCENTS: Record<string, string> = {
  'los-70': '#FFD700',
  'los-80': '#FF00FF',
  'los-90': '#00CED1',
  'los-2000': '#6BC94B',
}

function esHome(pathname: string) {
  return pathname === '/'
}

function esDecadaLanding(pathname: string) {
  return /^\/decada\/[^/]+$/.test(pathname)
}

function useWarpActive(pathname: string, duration = 550) {
  const [active, setActive] = useState(false)
  const prevRef = useRef(pathname)

  useEffect(() => {
    const prev = prevRef.current
    prevRef.current = pathname
    if (prev === pathname) return

    // El viaje en el tiempo solo se siente al entrar a una década desde el
    // Home, o al volver de una década al Home — no en cada click interno
    // (Década→Categoría→Contenido, Buscar, etc.), para que no sea tedioso.
    const entrandoADecada = esHome(prev) && esDecadaLanding(pathname)
    const volviendoAHome = esDecadaLanding(prev) && esHome(pathname)
    if (!entrandoADecada && !volviendoAHome) return

    setActive(true)
    const timeout = setTimeout(() => setActive(false), duration)
    return () => clearTimeout(timeout)
  }, [pathname, duration])

  return active
}

function AppGate() {
  const { usuario } = useAuth()
  const location = useLocation()

  if (usuario?.debeCambiarPassword && location.pathname !== '/cambiar-password') {
    return <Navigate to="/cambiar-password" replace />
  }

  return <Outlet />
}

function RootLayout() {
  const location = useLocation()
  const outlet = useOutlet()
  const warpActive = useWarpActive(location.pathname)

  const slug = location.pathname.match(/^\/decada\/([^/]+)/)?.[1]
  const accentColor = slug ? DECADA_ACCENTS[slug] : '#f5a623'

  return (
    <Layout>
      <WarpTunnel active={warpActive} duration={WARP_DURATION} accentColor={accentColor} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.15, filter: 'blur(10px)' }}
          transition={{ duration: 0.25, ease: 'easeIn' }}
        >
          <Suspense fallback={null}>{outlet}</Suspense>
        </motion.div>
      </AnimatePresence>
    </Layout>
  )
}

export const router = createBrowserRouter([
  {
    element: <AppGate />,
    children: [
      {
        path: 'cambiar-password',
        element: (
          <Suspense fallback={null}>
            <CambiarPasswordObligatorioPage />
          </Suspense>
        ),
      },
      {
        path: '/',
        element: <RootLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'decada/:slug', element: <DecadaPage /> },
          { path: 'decada/:slug/categoria/:categoriaSlug', element: <CategoriaPage /> },
          { path: 'decada/:slug/categoria/:categoriaSlug/:contenidoSlug', element: <ContenidoDetallePage /> },
          { path: 'buscar', element: <BuscadorPage /> },
          { path: 'login', element: <LoginPage /> },
          { path: 'registro', element: <RegisterPage /> },
          {
            path: 'perfil',
            element: (
              <ProtectedRoute>
                <PerfilPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'favoritos',
            element: (
              <ProtectedRoute>
                <MisFavoritosPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'admin',
        element: (
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        ),
        children: [
          { index: true, element: <AdminHomePage /> },
          { path: 'decadas', element: <AdminDecadasPage /> },
          { path: 'decadas/nueva', element: <DecadaFormPage /> },
          { path: 'decadas/:id/editar', element: <DecadaFormPage /> },
          { path: 'categorias', element: <AdminCategoriasPage /> },
          { path: 'categorias/nueva', element: <CategoriaFormPage /> },
          { path: 'categorias/:id/editar', element: <CategoriaFormPage /> },
          { path: 'contenido', element: <AdminContenidoPage /> },
          { path: 'contenido/nuevo', element: <ContenidoFormPage /> },
          { path: 'contenido/:id/editar', element: <ContenidoFormPage /> },
          { path: 'playlists', element: <AdminPlaylistsPage /> },
          { path: 'playlists/nueva', element: <PlaylistFormPage /> },
          { path: 'playlists/:id/editar', element: <PlaylistFormPage /> },
          { path: 'etiquetas', element: <AdminEtiquetasPage /> },
          { path: 'comentarios', element: <AdminComentariosPage /> },
          { path: 'usuarios', element: <AdminUsuariosPage /> },
          { path: 'usuarios/:id/editar', element: <UsuarioFormPage /> },
        ],
      },
    ],
  },
])