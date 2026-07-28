import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../../../shared/components/ui/Button'
import { Badge } from '../../../shared/components/ui/Badge'
import { SearchInput } from '../../../shared/components/ui/SearchInput'
import {
  borrarComentario,
  getComentariosAdmin,
  moderarComentario,
  type ComentarioAdmin,
} from '../../../services/comentarios.service'

const LIMITE = 20
const DEBOUNCE_MS = 400

type Filtro = 'todos' | 'pendientes' | 'aprobados'

export function AdminComentariosPage() {
  const { token } = useAuth()
  const [items, setItems] = useState<ComentarioAdmin[]>([])
  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [q, setQ] = useState('')
  const [qDebounced, setQDebounced] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => setQDebounced(q), DEBOUNCE_MS)
    return () => clearTimeout(timeout)
  }, [q])

  async function cargar(pag: number, f: Filtro, texto: string) {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const filtros = {
        ...(f === 'pendientes' && { aprobado: false }),
        ...(f === 'aprobados' && { aprobado: true }),
        ...(texto.trim() && { q: texto.trim() }),
      }
      const data = await getComentariosAdmin(token, pag, LIMITE, filtros)
      setItems(data.items)
      setTotal(data.total)
      setPagina(data.pagina)
    } catch {
      setError('No se pudieron cargar los comentarios.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function cargarInicial() {
      await cargar(1, filtro, qDebounced)
    }
    cargarInicial()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro, qDebounced])

  async function handleModerar(comentario: ComentarioAdmin, aprobado: boolean) {
    if (!token) return
    try {
      await moderarComentario(token, comentario.id, aprobado)
      cargar(pagina, filtro, qDebounced)
    } catch {
      window.alert('No se pudo actualizar el comentario.')
    }
  }

  async function handleEliminar(comentario: ComentarioAdmin) {
    if (!token) return
    const confirmado = window.confirm('¿Eliminar este comentario? Esta acción no se puede deshacer.')
    if (!confirmado) return

    try {
      await borrarComentario(token, comentario.id)
      cargar(pagina, filtro, qDebounced)
    } catch {
      window.alert('No se pudo eliminar el comentario.')
    }
  }

  const totalPaginas = Math.max(1, Math.ceil(total / LIMITE))

  const filtroClass = (f: Filtro) =>
    `px-3 py-1 rounded-full text-xs font-sans border transition-colors duration-150 cursor-pointer ${
      filtro === f
        ? 'bg-accent text-bg border-accent'
        : 'bg-transparent text-text-secondary border-border hover:border-accent'
    }`

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-sans font-semibold text-2xl text-text">Comentarios</h1>

      <div className="flex flex-wrap items-center gap-2">
        <button className={filtroClass('todos')} onClick={() => setFiltro('todos')}>
          Todos
        </button>
        <button className={filtroClass('pendientes')} onClick={() => setFiltro('pendientes')}>
          Pendientes
        </button>
        <button className={filtroClass('aprobados')} onClick={() => setFiltro('aprobados')}>
          Aprobados
        </button>
        <SearchInput value={q} onChange={setQ} placeholder="Buscar en el texto..." className="flex-1 min-w-[180px]" />
      </div>

      {loading && <p className="font-sans text-text-secondary text-sm">Cargando...</p>}
      {error && <p className="font-sans text-red-400 text-sm">{error}</p>}

      {!loading && !error && (
        <>
          <div className="flex flex-col gap-3">
            {items.map((comentario) => (
              <div
                key={comentario.id}
                className="border border-border rounded-lg p-4 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-sans text-sm text-text font-medium">
                      {comentario.usuario.nombre ?? comentario.usuario.email}
                    </span>
                    <span className="font-sans text-text-secondary text-xs">
                      {new Date(comentario.createdAt).toLocaleString('es-AR')}
                    </span>
                    <Badge variant={comentario.aprobado ? 'accent' : 'outline'}>
                      {comentario.aprobado ? 'Aprobado' : 'Pendiente'}
                    </Badge>
                  </div>
                  <Link
                    to={`/admin/contenido/${comentario.contenido.id}/editar`}
                    className="font-sans text-accent text-xs no-underline"
                  >
                    {comentario.contenido.titulo}
                  </Link>
                </div>

                <p className="font-sans text-text-secondary text-sm">{comentario.texto}</p>

                <div className="flex items-center gap-2 pt-1">
                  {comentario.aprobado ? (
                    <Button
                      variant="ghost"
                      className="px-3 py-1 text-xs"
                      onClick={() => handleModerar(comentario, false)}
                    >
                      Desaprobar
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      className="px-3 py-1 text-xs"
                      onClick={() => handleModerar(comentario, true)}
                    >
                      Aprobar
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="px-3 py-1 text-xs text-red-400"
                    onClick={() => handleEliminar(comentario)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <p className="font-sans text-text-secondary text-sm text-center py-6">
                No hay comentarios en esta vista.
              </p>
            )}
          </div>

          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="ghost"
                className="px-3 py-1 text-xs"
                disabled={pagina <= 1}
                onClick={() => cargar(pagina - 1, filtro, qDebounced)}
              >
                ← Anterior
              </Button>
              <span className="font-sans text-text-secondary text-xs">
                Página {pagina} de {totalPaginas}
              </span>
              <Button
                variant="ghost"
                className="px-3 py-1 text-xs"
                disabled={pagina >= totalPaginas}
                onClick={() => cargar(pagina + 1, filtro, qDebounced)}
              >
                Siguiente →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}