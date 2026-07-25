import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
          <Link to="/" className="font-sans font-semibold text-lg text-text no-underline">
            Argentina <span className="text-accent">Retro</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-text-secondary text-sm">
          Argentina Retro — un viaje por la historia reciente
        </div>
      </footer>
    </div>
  )
}