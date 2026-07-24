import type { ReactNode } from 'react'

interface CardProps {
  image?: string
  imageAlt?: string
  title: string
  description?: string
  meta?: ReactNode
  children?: ReactNode
  onClick?: () => void
  className?: string
}

export function Card({
  image,
  imageAlt = '',
  title,
  description,
  meta,
  children,
  onClick,
  className = '',
}: CardProps) {
  const isInteractive = Boolean(onClick)

  return (
    <div
      onClick={onClick}
      className={`bg-bg-secondary border border-border rounded-lg overflow-hidden flex flex-col transition-transform duration-200 ${
        isInteractive ? 'cursor-pointer hover:-translate-y-1 hover:border-accent' : ''
      } ${className}`}
    >
      {image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-sans font-semibold text-text text-base leading-snug">
          {title}
        </h3>

        {description && (
          <p className="font-sans text-text-secondary text-sm leading-relaxed">
            {description}
          </p>
        )}

        {meta && (
          <div className="mt-auto pt-2 flex items-center gap-2 text-xs text-text-secondary">
            {meta}
          </div>
        )}

        {children}
      </div>
    </div>
  )
}