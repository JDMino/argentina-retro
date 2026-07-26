import { useEffect, useRef, useState } from 'react'
import { createBrowserRouter, useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Layout } from './shared/components/layout/Layout'
import { HomePage } from './modules/home/HomePage'
import { DecadaPage } from './modules/decadas/DecadaPage'
import { WarpTunnel } from './shared/components/effects/WarpTunnel'
import { CategoriaPage } from './modules/categorias/CategoriaPage'
import { ContenidoDetallePage } from './modules/contenido/ContenidoDetallePage'
import { LoginPage } from './modules/auth/LoginPage'
import { RegisterPage } from './modules/auth/RegisterPage'
import { ProtectedRoute } from './modules/auth/ProtectedRoute'
import { PerfilPage } from './modules/auth/PerfilPage'
import { MisFavoritosPage } from './modules/favoritos/MisFavoritosPage'

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
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'decada/:slug', element: <DecadaPage /> },
      { path: 'decada/:slug/categoria/:categoriaSlug', element: <CategoriaPage /> },
      { path: 'decada/:slug/categoria/:categoriaSlug/:contenidoSlug', element: <ContenidoDetallePage /> },
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
])