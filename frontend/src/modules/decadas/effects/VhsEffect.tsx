export function VhsEffect() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Grano/ruido sutil */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '3px 3px',
        }}
      />

      {/* Tracking lines intermitentes */}
      <div className="absolute inset-x-0 h-[6px] opacity-0 bg-white/20 vhs-tracking-1" />
      <div className="absolute inset-x-0 h-[3px] opacity-0 bg-white/15 vhs-tracking-2" />

      {/* Aberración cromática leve en los bordes */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow:
            'inset 3px 0 0 -2px rgba(255,0,60,0.15), inset -3px 0 0 -2px rgba(0,255,255,0.15)',
        }}
      />
    </div>
  )
}