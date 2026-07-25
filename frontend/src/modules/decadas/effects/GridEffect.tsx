export function GridEffect() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Resplandor de horizonte, mismo tono que el grid */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 80% 100% at 50% 100%, var(--color-accent), transparent 70%)',
        }}
      />

      {/* Grid con perspectiva, animado por transform (GPU) */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 grid-lines"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-accent) 2px, transparent 2px),
              linear-gradient(90deg, var(--color-accent) 2px, transparent 2px)
            `,
          }}
        />
      </div>
    </div>
  )
}