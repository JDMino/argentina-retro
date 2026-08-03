export function DecadaAccentBar() {
  return (
    <div
      className="relative z-10 h-1 w-24 rounded-full mb-4"
      style={{
        background: 'linear-gradient(to right, var(--color-accent), var(--color-accent-secondary))',
      }}
    />
  )
}