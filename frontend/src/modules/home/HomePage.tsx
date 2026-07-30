import { Link } from 'react-router-dom'
import { useDecadas } from '../decadas/useDecadas'
import { useConfiguracion } from './useConfiguracion'
import { useDocumentMeta } from '../../shared/hooks/useDocumentMeta'

export function HomePage() {
  const { decadas, loading, error } = useDecadas()
  const { configuracion } = useConfiguracion()

  useDocumentMeta({ title: 'Viajá por la historia argentina' })

  if (loading) return <p>Cargando décadas...</p>
  if (error) return <p className="text-error">{error}</p>

  const fondoDesktop = configuracion?.homeFondoDesktopUrl ?? undefined
  const fondoMobile = configuracion?.homeFondoMobileUrl ?? fondoDesktop
  const tieneFondo = Boolean(fondoDesktop || fondoMobile)

  return (
    <div className="relative -mx-4 px-4 py-8 overflow-hidden">
      {tieneFondo && (
        <>
          {fondoMobile && (
            <div
              className="absolute inset-0 md:hidden bg-cover bg-center"
              style={{ backgroundImage: `url(${fondoMobile})` }}
              aria-hidden="true"
            />
          )}
          {fondoDesktop && (
            <div
              className="absolute inset-0 hidden md:block bg-cover bg-center"
              style={{ backgroundImage: `url(${fondoDesktop})` }}
              aria-hidden="true"
            />
          )}
          <div className="absolute inset-0 bg-bg/70" aria-hidden="true" />
        </>
      )}

      <div className="relative z-10">
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
    </div>
  )
}