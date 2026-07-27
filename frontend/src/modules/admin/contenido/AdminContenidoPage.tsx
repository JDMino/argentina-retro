import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../../../shared/components/ui/Button'
import { Badge } from '../../../shared/components/ui/Badge'
import {
  deleteContenido,
  getContenidoAdmin,
  type Contenido,
} from '../../../services/contenido.service'

const LIMITE = 20

export function AdminContenidoPage() {
  const { token } = useAuth()
  const [items, setItems] = useState<Contenido[]>([])
  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function cargar(pag: number) {
    setLoading(true)
    setError(null)
    try {
      const data = await getContenidoAdmin(pag, LIMITE)
      setItems(data.items)
      setTotal(data.total)
      setPagina(data.pagina)
    } catch {
      setError('No se pudo cargar el contenido.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar(1)
  }, [])

  async function handleEliminar(contenido: Contenido) {
    if (!token) return
    const confirmado = window.confirm(
      `¿Eliminar "${contenido.titulo}"? Esta acción no se puede deshacer.`,
    )
    if (!confirmado) return

    try {
      await deleteContenido(token, contenido.id)
      cargar(pagina)
    } catch {
      window.alert('No se pudo eliminar el contenido.')
    }
  }

  const totalPaginas = Math.max(1, Math.ceil(total / LIMITE))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-sans font-semibold text-2xl text-text">Contenido</h1>
        <Link to="/admin/contenido/nuevo">
          <Button variant="primary">+ Nuevo contenido</Button>
        </Link>
      </div>

      {loading && <p className="font-sans text-text-secondary text-sm">Cargando...</p>}
      {error && <p className="font-sans text-red-400 text-sm">{error}</p>}

      {!loading && !error && (
        <>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="bg-bg-secondary text-text-secondary text-left">
                  <th className="px-4 py-2 font-medium">Título</th>
                  <th className="px-4 py-2 font-medium">Década</th>
                  <th className="px-4 py-2 font-medium">Categoría</th>
                  <th className="px-4 py-2 font-medium">Año</th>
                  <th className="px-4 py-2 font-medium">Estado</th>
                  <th className="px-4 py-2 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((contenido) => (
                  <tr key={contenido.id} className="border-t border-border">
                    <td className="px-4 py-2 text-text">{contenido.titulo}</td>
                    <td className="px-4 py-2 text-text-secondary">
                      {contenido.decada?.nombre ?? '—'}
                    </td>
                    <td className="px-4 py-2 text-text-secondary">
                      {contenido.categoria?.nombre ?? '—'}
                    </td>
                    <td className="px-4 py-2 text-text-secondary">{contenido.anio ?? '—'}</td>
                    <td className="px-4 py-2">
                      <Badge variant={contenido.publicado ? 'accent' : 'outline'}>
                        {contenido.publicado ? 'Publicado' : 'Borrador'}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/contenido/${contenido.id}/editar`}>
                          <Button variant="secondary" className="px-3 py-1 text-xs">
                            Editar
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="px-3 py-1 text-xs text-red-400"
                          onClick={() => handleEliminar(contenido)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-text-secondary">
                      Todavía no hay contenido cargado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="ghost"
                className="px-3 py-1 text-xs"
                disabled={pagina <= 1}
                onClick={() => cargar(pagina - 1)}
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
                onClick={() => cargar(pagina + 1)}
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