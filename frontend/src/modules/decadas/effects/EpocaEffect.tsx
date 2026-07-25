import { CrtEffect } from './CrtEffect'
import { GridEffect } from './GridEffect'
import { VhsEffect } from './VhsEffect'

interface EpocaEffectProps {
  slug: string
}

export function EpocaEffect({ slug }: EpocaEffectProps) {
  switch (slug) {
    case 'los-70':
      return <CrtEffect />
    case 'los-80':
      return <GridEffect />
    case 'los-90':
      return <VhsEffect />
    default:
      return null
  }
}