import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../../../shared/components/ui/Button'
import { Badge } from '../../../shared/components/ui/Badge'
import {
  deleteCategoria,
  getCategorias,
  type Categoria,
} from '../../../services/categorias.service'

export function AdminCategoriasPage() {
  const { token } = useAuth()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function cargar() {
    setLoading(true)
    setError(null)
    try {
      const data = await getCategorias()
      data.sort((a, b) => a.orden - b.orden)
      setCategorias(data)
    } catch {
      setError('No se pudieron cargar las categorías.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  async function handleEliminar(categoria: Categoria) {
    if (!token) return
    const confirmado = window.confirm(
      `¿Eliminar "${categoria.nombre}"? Esta acción no se puede deshacer.`,
    )
    if (!confirmado) return

    try {
      await deleteCategoria(token, categoria.id)
      setCategorias((prev) => prev.filter((c) => c.id !== categoria.id))
    } catch {
      window.alert(
        'No se pudo eliminar la categoría. Puede que todavía tenga contenido asociado.',
      )
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-sans font-semibold text-2xl text-text">Categorías</h1>
        <Link to="/admin/categorias/nueva">
          <Button variant="primary">+ Nueva categoría</Button>
        </Link>
      </div>

      {loading && <p className="font-sans text-text-secondary text-sm">Cargando...</p>}
      {error && <p className="font-sans text-red-400 text-sm">{error}</p>}

      {!loading && !error && (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="bg-bg-secondary text-text-secondary text-left">
                <th className="px-4 py-2 font-medium">Orden</th>
                <th className="px-4 py-2 font-medium">Icono</th>
                <th className="px-4 py-2 font-medium">Nombre</th>
                <th className="px-4 py-2 font-medium">Slug</th>
                <th className="px-4 py-2 font-medium">Estado</th>
                <th className="px-4 py-2 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id} className="border-t border-border">
                  <td className="px-4 py-2 text-text-secondary">{categoria.orden}</td>
                  <td className="px-4 py-2 text-text">{categoria.icono ?? '—'}</td>
                  <td className="px-4 py-2 text-text">{categoria.nombre}</td>
                  <td className="px-4 py-2 text-text-secondary">{categoria.slug}</td>
                  <td className="px-4 py-2">
                    <Badge variant={categoria.activa ? 'accent' : 'outline'}>
                      {categoria.activa ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/categorias/${categoria.id}/editar`}>
                        <Button variant="secondary" className="px-3 py-1 text-xs">
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="px-3 py-1 text-xs text-red-400"
                        onClick={() => handleEliminar(categoria)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {categorias.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-text-secondary">
                    Todavía no hay categorías cargadas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}