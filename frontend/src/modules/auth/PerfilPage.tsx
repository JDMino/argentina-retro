import { useAuth } from './AuthContext'

export function PerfilPage() {
  const { usuario } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text mb-4">Mi perfil</h1>
      <p className="text-text-secondary">Email: {usuario?.email}</p>
      <p className="text-text-secondary">Nombre: {usuario?.nombre ?? '—'}</p>
      <p className="text-text-secondary">Roles: {usuario?.roles.join(', ')}</p>
    </div>
  )
}