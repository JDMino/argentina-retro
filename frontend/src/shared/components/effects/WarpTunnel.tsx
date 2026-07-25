import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface WarpTunnelProps {
  active: boolean
  duration?: number
  accentColor?: string
}

const ARM_COUNT = 6
const POINTS_PER_ARM = 90
const TURNS = 2.5

function buildArmPath(offset: number): Path2D {
  const path = new Path2D()
  for (let i = 0; i <= POINTS_PER_ARM; i++) {
    const t = i / POINTS_PER_ARM
    const angle = offset + t * Math.PI * 2 * TURNS
    const radius = t // normalizado 0..1, se escala en cada frame
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (i === 0) path.moveTo(x, y)
    else path.lineTo(x, y)
  }
  return path
}

export function WarpTunnel({
  active,
  duration = 550,
  accentColor = '#f5a623',
}: WarpTunnelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const arms = Array.from({ length: ARM_COUNT }, (_, i) =>
      buildArmPath((i / ARM_COUNT) * Math.PI * 2),
    )

    const maxRadius = Math.hypot(w, h) / 2
    const start = performance.now()
    const isMobile = w < 768
    ctx.lineCap = 'round'

    function frame(now: number) {
      if (!ctx) return
      const t = Math.min((now - start) / duration, 1)

      // Rastro (motion blur): más opaco en mobile para tapar más y dibujar menos detalle
      ctx.fillStyle = isMobile ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.35)'
      ctx.fillRect(0, 0, w, h)

      const fade = Math.sin(Math.PI * t) // aparece y se apaga
      const scale = maxRadius * (0.15 + t * 1.1)
      const rotation = t * Math.PI * 1.5

      ctx.save()
      ctx.translate(w / 2, h / 2)
      ctx.rotate(rotation)
      ctx.scale(scale, scale)
      ctx.lineWidth = 3 / scale // compensa el scale para mantener ~3px reales en pantalla

      arms.forEach((arm, i) => {
        ctx.strokeStyle =
          i % 2 === 0
            ? `rgba(245,166,35,${0.25 + fade * 0.6})` // ámbar de marca
            : `rgba(255,255,255,${0.2 + fade * 0.55})`
        ctx.stroke(arm)
      })
      ctx.restore()

      if (t < 1) rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, duration])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none bg-black overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <canvas ref={canvasRef} className="w-full h-full" />
          <motion.div
            className="absolute inset-0"
            style={{ background: accentColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.55, 0] }}
            transition={{ duration: duration / 1000, times: [0, 0.75, 0.85, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}