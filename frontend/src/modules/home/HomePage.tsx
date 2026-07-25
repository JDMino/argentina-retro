import { Link } from 'react-router-dom'
import { useDecadas } from '../decadas/useDecadas'

export function HomePage() {
  const { decadas, loading, error } = useDecadas()

  if (loading) return <p>Cargando décadas...</p>
  if (error) return <p className="text-error">{error}</p>

  return (
    <div>
      <h1>Argentina Retro</h1>
      <p className="text-text-secondary mb-8">
        Elegí una década para viajar en el tiempo.
      </p>

      <ul className="flex flex-col gap-4">
        {decadas.map((decada) => (
          <li key={decada.id}>
            <Link
              to={`/decada/${decada.slug}`}
              className="block p-4 rounded border border-border hover:border-accent transition-colors"
            >
              <h2>{decada.nombre}</h2>
              <p className="text-text-secondary">{decada.descripcion}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}