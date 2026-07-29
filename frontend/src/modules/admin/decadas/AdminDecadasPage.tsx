import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../../../shared/components/ui/Button'
import { Badge } from '../../../shared/components/ui/Badge'
import { deleteDecada, getDecadas, type Decada } from '../../../services/decadas.service'

export function AdminDecadasPage() {
  const { token } = useAuth()
  const [decadas, setDecadas] = useState<Decada[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function cargar() {
      setLoading(true)
      setError(null)
      try {
        const data = await getDecadas()
        data.sort((a, b) => a.orden - b.orden)
        setDecadas(data)
      } catch {
        setError('No se pudieron cargar las décadas.')
      } finally {
        setLoading(false)
      }
    }

    cargar()
  }, [])

  async function handleEliminar(decada: Decada) {
    if (!token) return
    const confirmado = window.confirm(
      `¿Eliminar "${decada.nombre}"? Esta acción no se puede deshacer.`,
    )
    if (!confirmado) return

    try {
      await deleteDecada(token, decada.id)
      setDecadas((prev) => prev.filter((d) => d.id !== decada.id))
    } catch {
      window.alert(
        'No se pudo eliminar la década. Puede que todavía tenga categorías o contenido asociado.',
      )
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-sans font-semibold text-2xl text-text">Décadas</h1>
        <Link to="/admin/decadas/nueva">
          <Button variant="primary">+ Nueva década</Button>
        </Link>
      </div>

      {loading && <p className="font-sans text-text-secondary text-sm">Cargando...</p>}
      {error && <p className="font-sans text-red-400 text-sm">{error}</p>}

      {!loading && !error && (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans min-w-[640px]">
            <thead>
              <tr className="bg-bg-secondary text-text-secondary text-left">
                <th className="px-4 py-2 font-medium">Orden</th>
                <th className="px-4 py-2 font-medium">Nombre</th>
                <th className="px-4 py-2 font-medium">Slug</th>
                <th className="px-4 py-2 font-medium">Años</th>
                <th className="px-4 py-2 font-medium">Estado</th>
                <th className="px-4 py-2 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {decadas.map((decada) => (
                <tr key={decada.id} className="border-t border-border">
                  <td className="px-4 py-2 text-text-secondary">{decada.orden}</td>
                  <td className="px-4 py-2 text-text">{decada.nombre}</td>
                  <td className="px-4 py-2 text-text-secondary">{decada.slug}</td>
                  <td className="px-4 py-2 text-text-secondary">
                    {decada.anioInicio}–{decada.anioFin}
                  </td>
                  <td className="px-4 py-2">
                    <Badge variant={decada.activa ? 'accent' : 'outline'}>
                      {decada.activa ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/decadas/${decada.id}/editar`}>
                        <Button variant="secondary" className="px-3 py-1 text-xs">
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="px-3 py-1 text-xs text-red-400"
                        onClick={() => handleEliminar(decada)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {decadas.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-text-secondary">
                    Todavía no hay décadas cargadas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  )
}