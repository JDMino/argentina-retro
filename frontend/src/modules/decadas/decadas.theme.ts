import type { CSSProperties } from 'react'
import type { DecadaPaleta } from '../../services/decadas.service'

export function decadaThemeVars(paleta: DecadaPaleta): CSSProperties {
  return {
    '--color-accent': paleta.primario,
    '--color-accent-secondary': paleta.secundario,
  } as CSSProperties
}