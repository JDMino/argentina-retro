import { useEffect, useRef, useState } from 'react'
import { createBrowserRouter, Navigate, Outlet, useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Layout } from './shared/components/layout/Layout'
import { HomePage } from './modules/home/HomePage'
import { DecadaPage } from './modules/decadas/DecadaPage'
import { WarpTunnel } from './shared/components/effects/WarpTunnel'
import { CategoriaPage } from './modules/categorias/CategoriaPage'
import { ContenidoDetallePage } from './modules/contenido/ContenidoDetallePage'
import { BuscadorPage } from './modules/contenido/BuscadorPage'
import { LoginPage } from './modules/auth/LoginPage'
import { RegisterPage } from './modules/auth/RegisterPage'
import { ProtectedRoute } from './modules/auth/ProtectedRoute'
import { AdminRoute } from './modules/auth/AdminRoute'
import { PerfilPage } from './modules/auth/PerfilPage'
import { CambiarPasswordObligatorioPage } from './modules/auth/CambiarPasswordObligatorioPage'
import { useAuth } from './modules/auth/AuthContext'
import { MisFavoritosPage } from './modules/favoritos/MisFavoritosPage'
import { AdminLayout } from './modules/admin/AdminLayout'
import { AdminHomePage } from './modules/admin/AdminHomePage'
import { AdminDecadasPage } from './modules/admin/decadas/AdminDecadasPage'
import { DecadaFormPage } from './modules/admin/decadas/DecadaFormPage'
import { AdminCategoriasPage } from './modules/admin/categorias/AdminCategoriasPage'
import { CategoriaFormPage } from './modules/admin/categorias/CategoriaFormPage'
import { AdminContenidoPage } from './modules/admin/contenido/AdminContenidoPage'
import { ContenidoFormPage } from './modules/admin/contenido/ContenidoFormPage'
import { AdminPlaylistsPage } from './modules/admin/playlists/AdminPlaylistsPage'
import { PlaylistFormPage } from './modules/admin/playlists/PlaylistFormPage'
import { AdminComentariosPage } from './modules/admin/comentarios/AdminComentariosPage'
import { AdminEtiquetasPage } from './modules/admin/etiquetas/AdminEtiquetasPage'
import { AdminUsuariosPage } from './modules/admin/usuarios/AdminUsuariosPage'
import { UsuarioFormPage } from './modules/admin/usuarios/UsuarioFormPage'

const WARP_DURATION = 700

const DECADA_ACCENTS: Record<string, string> = {
  'los-70': '#FFD700',
  'los-80': '#FF00FF',
  'los-90': '#00CED1',
  'los-2000': '#6BC94B',
}

function useWarpActive(pathname: string, duration = 550) {
  const [active, setActive] = useState(false)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
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
          {outlet}
        </motion.div>
      </AnimatePresence>
    </Layout>
  )
}

export const router = createBrowserRouter([
  {
    element: <AppGate />,
    children: [
      { path: 'cambiar-password', element: <CambiarPasswordObligatorioPage /> },
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