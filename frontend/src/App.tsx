import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { AuthProvider } from './modules/auth/AuthContext'
import { FavoritosProvider } from './modules/favoritos/FavoritosContext'

function App() {
  return (
    <AuthProvider>
      <FavoritosProvider>
        <RouterProvider router={router} />
      </FavoritosProvider>
    </AuthProvider>
  )
}

export default App