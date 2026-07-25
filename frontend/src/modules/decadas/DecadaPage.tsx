import { useParams } from 'react-router-dom'
import { useDecadas } from './useDecadas'
import { decadaThemeVars } from './decadas.theme'
import { EpocaEffect } from './effects/EpocaEffect'
import { WindowFrame } from '../../shared/components/ui/WindowFrame'

export function DecadaPage() {
  const { slug } = useParams<{ slug: string }>()
  const { decadas, loading, error } = useDecadas()

  if (loading) return <p>Cargando...</p>
  if (error) return <p className="text-error">{error}</p>

  const decada = decadas.find((d) => d.slug === slug)

  if (!decada) return <p>Década no encontrada.</p>

  const descripcion = decada.slug === 'los-2000'
    ? <WindowFrame title={decada.nombre}><p>{decada.descripcion}</p></WindowFrame>
    : <p className="text-text-secondary relative z-10">{decada.descripcion}</p>

  return (
    <div
      data-decada={decada.slug}
      style={decadaThemeVars(decada.paleta)}
      className="relative min-h-[60vh] -mx-4 px-4 overflow-hidden"
    >
      <EpocaEffect slug={decada.slug} />
      <h1 className="font-heading relative z-10">{decada.nombre}</h1>
      {descripcion}
    </div>
  )
}