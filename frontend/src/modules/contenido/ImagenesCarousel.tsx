import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Imagen } from '../../services/contenido.service'

interface ImagenesCarouselProps {
  imagenes: Imagen[]
  tituloContenido: string
}

export function ImagenesCarousel({ imagenes, tituloContenido }: ImagenesCarouselProps) {
  const [indice, setIndice] = useState(0)

  if (imagenes.length === 0) return null

  const imagenActual = imagenes[indice]

  function anterior() {
    setIndice((i) => (i === 0 ? imagenes.length - 1 : i - 1))
  }

  function siguiente() {
    setIndice((i) => (i === imagenes.length - 1 ? 0 : i + 1))
  }

  return (
    <div className="mt-6">
      <div className="relative bg-bg-secondary border border-border rounded-lg overflow-hidden h-[45vh] md:h-[60vh]">
        <AnimatePresence mode="wait">
          <motion.img
            key={imagenActual.id}
            src={imagenActual.url}
            alt={imagenActual.textoAlternativo ?? tituloContenido}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </AnimatePresence>

        {imagenes.length > 1 && (
          <>
            <button
              type="button"
              onClick={anterior}
              aria-label="Imagen anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-bg/70 border border-border text-text flex items-center justify-center hover:border-accent"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={siguiente}
              aria-label="Imagen siguiente"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-bg/70 border border-border text-text flex items-center justify-center hover:border-accent"
            >
              ›
            </button>
          </>
        )}
      </div>

      {imagenes.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {imagenes.map((imagen, i) => (
            <button
              key={imagen.id}
              type="button"
              onClick={() => setIndice(i)}
              aria-label={`Ir a la imagen ${i + 1}`}
              className={
                i === indice
                  ? 'h-2 w-2 rounded-full bg-accent'
                  : 'h-2 w-2 rounded-full bg-border'
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}