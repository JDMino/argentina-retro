import type { ReactNode } from 'react'

type BadgeVariant = 'default' | 'accent' | 'outline'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-bg-secondary text-text-secondary border border-border',
  accent: 'bg-accent text-bg border border-accent',
  outline: 'bg-transparent text-text-secondary border border-border',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-sans font-medium whitespace-nowrap ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}