import { useNavigate } from 'react-router-dom'
import { useFavoritos } from './FavoritosContext'
import { useDecadas } from '../decadas/useDecadas'
import { Card } from '../../shared/components/ui/Card'
import { useDocumentMeta } from '../../shared/hooks/useDocumentMeta'

export function MisFavoritosPage() {
  const { favoritos, loading } = useFavoritos()
  const { decadas } = useDecadas()
  const navigate = useNavigate()

  useDocumentMeta({ title: 'Mis favoritos', noindex: true })

  if (loading) return <p>Cargando tus favoritos...</p>

  if (favoritos.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-text mb-4">Mis favoritos</h1>
        <p className="text-text-secondary">
          Todavía no marcaste ningún contenido como favorito. Explorá las décadas y tocá
          "Agregar a favoritos" en lo que más te guste.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text mb-6">Mis favoritos</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {favoritos.map(({ contenido }) => {
          const decada = decadas.find((d) => d.id === contenido.decadaId)
          const thumbnail = [...contenido.imagenes].sort((a, b) => a.orden - b.orden)[0]
          return (
            <Card
              key={contenido.id}
              title={contenido.titulo}
              description={contenido.descripcion ?? undefined}
              image={thumbnail?.url}
              imageAlt={thumbnail?.textoAlternativo ?? ''}
              onClick={decada ? () => navigate(`/decada/${decada.slug}`) : undefined}
            />
          )
        })}
      </div>
    </div>
  )
}