export function CrtEffect() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.8) 50%, transparent 50%)',
          backgroundSize: '100% 6px',
        }}
      />
      {/* Viñeteado */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 120px 40px rgba(0,0,0,0.55)',
        }}
      />
      {/* Flicker leve */}
      <div className="absolute inset-0 bg-black opacity-0 animate-crt-flicker" />
    </div>
  )
}