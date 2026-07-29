import { useEffect } from 'react'

interface MetaOptions {
  /** Título de la página, sin el sufijo del sitio (se agrega automáticamente). */
  title: string
  description?: string
  /** URL absoluta de imagen para Open Graph (previews de WhatsApp/Twitter/Discord). */
  image?: string
  /** Páginas privadas o de contenido no canónico (búsqueda, admin, auth) no deben indexarse. */
  noindex?: boolean
}

const SITE_NAME = 'Argentina Retro'
const DESCRIPCION_POR_DEFECTO =
  'Recorré la historia reciente de Argentina década por década: música, TV, tecnología y cultura popular de los 70 a los 2000.'

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function removeMetaTag(attr: 'name' | 'property', key: string) {
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove()
}

/**
 * Setea document.title + meta description/Open Graph/robots para la página
 * actual. Como el proyecto es una SPA sin SSR, esto sirve para: pestaña del
 * navegador, indexación de Google (que sí ejecuta JS), y robots noindex en
 * páginas privadas/no-canónicas. NO sirve para previews de redes sociales
 * (WhatsApp/Twitter/Discord no ejecutan JS) — esa limitación quedó
 * documentada como deuda técnica consciente al decidir no migrar a SSR.
 */
export function useDocumentMeta({ title, description, image, noindex = false }: MetaOptions) {
  useEffect(() => {
    const fullTitle = `${title} · ${SITE_NAME}`
    document.title = fullTitle

    const desc = description ?? DESCRIPCION_POR_DEFECTO
    setMetaTag('name', 'description', desc)
    setMetaTag('property', 'og:description', desc)
    setMetaTag('property', 'og:title', fullTitle)
    setMetaTag('property', 'og:type', 'website')
    setMetaTag('property', 'og:site_name', SITE_NAME)

    if (image) {
      setMetaTag('property', 'og:image', image)
    } else {
      removeMetaTag('property', 'og:image')
    }

    if (noindex) {
      setMetaTag('name', 'robots', 'noindex, nofollow')
    } else {
      removeMetaTag('name', 'robots')
    }
  }, [title, description, image, noindex])
}