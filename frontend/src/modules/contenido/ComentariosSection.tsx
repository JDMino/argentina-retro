import { useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useComentarios } from './useComentarios'
import { Button } from '../../shared/components/ui/Button'
import type { Comentario } from '../../services/comentarios.service'

interface ComentariosSectionProps {
  contenidoId: string
}

export function ComentariosSection({ contenidoId }: ComentariosSectionProps) {
  const { usuario, token } = useAuth()
  const location = useLocation()
  const { comentarios, loading, error, pagina, totalPaginas, irAPagina, crear, editar, borrar } =
    useComentarios(contenidoId)

  const [texto, setTexto] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [textoEdicion, setTextoEdicion] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!token || !texto.trim()) return
    setSubmitting(true)
    try {
      await crear(token, texto.trim())
      setTexto('')
    } finally {
      setSubmitting(false)
    }
  }

  function empezarEdicion(comentario: Comentario) {
    setEditandoId(comentario.id)
    setTextoEdicion(comentario.texto)
  }

  async function guardarEdicion(id: string) {
    if (!token || !textoEdicion.trim()) return
    await editar(token, id, textoEdicion.trim())
    setEditandoId(null)
  }

  async function handleBorrar(id: string) {
    if (!token) return
    await borrar(token, id)
  }

  function puedeEditar(comentario: Comentario): boolean {
    if (!usuario) return false
    return comentario.usuarioId === usuario.id || usuario.roles.includes('admin')
  }

  function formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="mt-10 relative z-10">
      <h2 className="text-xl font-semibold text-text mb-4">Comentarios</h2>

      {usuario ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribí un comentario..."
            maxLength={1000}
            rows={3}
            className="bg-bg-secondary border border-border rounded px-3 py-2 text-text resize-none"
          />
          <Button type="submit" disabled={submitting || !texto.trim()}>
            {submitting ? 'Publicando...' : 'Comentar'}
          </Button>
        </form>
      ) : (
        <p className="text-text-secondary mb-6">
          <Link to="/login" state={{ from: location.pathname }} className="text-accent">
            Iniciá sesión
          </Link>{' '}
          para dejar un comentario.
        </p>
      )}

      {loading && <p>Cargando comentarios...</p>}
      {error && <p className="text-error">{error}</p>}
      {!loading && !error && comentarios.length === 0 && pagina === 1 && (
        <p className="text-text-secondary">Todavía no hay comentarios. ¡Sé el primero!</p>
      )}

      <div className="flex flex-col gap-4">
        {comentarios.map((comentario) => (
          <div key={comentario.id} className="border border-border rounded-lg p-4">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm font-medium text-text">
                {comentario.usuario.nombre ?? comentario.usuario.email}
              </span>
              <span className="text-xs text-text-secondary">
                {formatearFecha(comentario.createdAt)}
              </span>
            </div>

            {editandoId === comentario.id ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={textoEdicion}
                  onChange={(e) => setTextoEdicion(e.target.value)}
                  maxLength={1000}
                  rows={2}
                  className="bg-bg-secondary border border-border rounded px-3 py-2 text-text resize-none"
                />
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => guardarEdicion(comentario.id)}>
                    Guardar
                  </Button>
                  <Button variant="ghost" onClick={() => setEditandoId(null)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-text-secondary">{comentario.texto}</p>
                {puedeEditar(comentario) && (
                  <div className="flex gap-3 mt-2">
                    <button onClick={() => empezarEdicion(comentario)} className="text-xs text-accent">
                      Editar
                    </button>
                    <button onClick={() => handleBorrar(comentario.id)} className="text-xs text-red-400">
                      Borrar
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => irAPagina(pagina - 1)}
            disabled={pagina === 1}
            className="text-sm px-3 py-1 rounded border border-border text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent"
          >
            Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numeroPagina) => (
            <button
              key={numeroPagina}
              onClick={() => irAPagina(numeroPagina)}
              className={
                numeroPagina === pagina
                  ? 'text-sm w-8 h-8 rounded-full bg-accent text-white'
                  : 'text-sm w-8 h-8 rounded-full text-text-secondary hover:border hover:border-accent'
              }
            >
              {numeroPagina}
            </button>
          ))}

          <button
            onClick={() => irAPagina(pagina + 1)}
            disabled={pagina === totalPaginas}
            className="text-sm px-3 py-1 rounded border border-border text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}