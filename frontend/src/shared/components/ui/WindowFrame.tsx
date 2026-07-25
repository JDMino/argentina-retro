import type { ReactNode } from 'react'

interface WindowFrameProps {
  title: string
  children: ReactNode
}

export function WindowFrame({ title, children }: WindowFrameProps) {
  return (
    <div className="window-2000s">
      <div className="window-2000s-titlebar">
        <span className="window-2000s-title">{title}</span>
        <div className="window-2000s-buttons">
          <span className="window-2000s-btn" aria-hidden="true">_</span>
          <span className="window-2000s-btn" aria-hidden="true">□</span>
          <span className="window-2000s-btn window-2000s-btn-close" aria-hidden="true">×</span>
        </div>
      </div>
      <div className="window-2000s-body">{children}</div>
    </div>
  )
}