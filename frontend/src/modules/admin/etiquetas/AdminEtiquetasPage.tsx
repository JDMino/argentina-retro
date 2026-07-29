import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../../../shared/components/ui/Button'
import { Badge } from '../../../shared/components/ui/Badge'
import { SearchInput } from '../../../shared/components/ui/SearchInput'
import {
  createEtiqueta,
  deleteEtiqueta,
  getEtiquetas,
  updateEtiqueta,
  type EtiquetaAdmin,
} from '../../../services/etiquetas.service'

function slugify(texto: string): string {
  return texto
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // saca tildes
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function AdminEtiquetasPage() {
  const { token } = useAuth()
  const [etiquetas, setEtiquetas] = useState<EtiquetaAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')

  const [nuevoNombre, setNuevoNombre] = useState('')
  const [creando, setCreando] = useState(false)

  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editNombre, setEditNombre] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    async function cargar() {
      setLoading(true)
      setError(null)
      try {
        const data = await getEtiquetas()
        setEtiquetas(data)
      } catch {
        setError('No se pudieron cargar las etiquetas.')
      } finally {
        setLoading(false)
      }
    }

    cargar()
  }, [])

  async function handleCrear() {
    if (!token || !nuevoNombre.trim()) return
    setCreando(true)
    try {
      const creada = await createEtiqueta(token, {
        nombre: nuevoNombre.trim(),
        slug: slugify(nuevoNombre),
      })
      setEtiquetas((prev) =>
        [...prev, { ...creada, contadorUso: 0 }].sort((a, b) => a.nombre.localeCompare(b.nombre)),
      )
      setNuevoNombre('')
    } catch {
      window.alert('No se pudo crear la etiqueta (¿ya existe una con ese slug?).')
    } finally {
      setCreando(false)
    }
  }

  function iniciarEdicion(etiqueta: EtiquetaAdmin) {
    setEditandoId(etiqueta.id)
    setEditNombre(etiqueta.nombre)
    setEditSlug(etiqueta.slug)
  }

  function cancelarEdicion() {
    setEditandoId(null)
    setEditNombre('')
    setEditSlug('')
  }

  async function handleGuardarEdicion(id: string) {
    if (!token || !editNombre.trim() || !editSlug.trim()) return
    setGuardando(true)
    try {
      const actualizada = await updateEtiqueta(token, id, {
        nombre: editNombre.trim(),
        slug: editSlug.trim(),
      })
      setEtiquetas((prev) =>
        prev
          .map((e) => (e.id === id ? { ...e, ...actualizada } : e))
          .sort((a, b) => a.nombre.localeCompare(b.nombre)),
      )
      cancelarEdicion()
    } catch {
      window.alert('No se pudo guardar (¿ya existe otra etiqueta con ese slug?).')
    } finally {
      setGuardando(false)
    }
  }

  async function handleEliminar(etiqueta: EtiquetaAdmin) {
    if (!token) return
    if (etiqueta.contadorUso > 0) {
      window.alert(
        `No se puede eliminar "${etiqueta.nombre}": está en uso en ${etiqueta.contadorUso} contenido(s).`,
      )
      return
    }
    const confirmado = window.confirm(`¿Eliminar "${etiqueta.nombre}"? Esta acción no se puede deshacer.`)
    if (!confirmado) return

    try {
      await deleteEtiqueta(token, etiqueta.id)
      setEtiquetas((prev) => prev.filter((e) => e.id !== etiqueta.id))
    } catch {
      window.alert('No se pudo eliminar la etiqueta. Puede que esté en uso.')
    }
  }

  const qNormalizado = q.trim().toLowerCase()
  const etiquetasFiltradas = qNormalizado
    ? etiquetas.filter(
        (e) =>
          e.nombre.toLowerCase().includes(qNormalizado) || e.slug.toLowerCase().includes(qNormalizado),
      )
    : etiquetas

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-sans font-semibold text-2xl text-text">Etiquetas</h1>

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={q}
          onChange={setQ}
          placeholder="Buscar por nombre o slug..."
          className="flex-1 min-w-[200px]"
        />
        <input
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          placeholder="Nombre de una etiqueta nueva"
          className="bg-bg-secondary border border-border rounded-md px-3 py-1.5 text-sm text-text placeholder:text-text-secondary focus:outline-none focus:border-accent"
          onKeyDown={(e) => e.key === 'Enter' && handleCrear()}
        />
        <Button variant="primary" className="px-3 py-1.5 text-xs" disabled={creando} onClick={handleCrear}>
          + Crear
        </Button>
      </div>

      {loading && <p className="font-sans text-text-secondary text-sm">Cargando...</p>}
      {error && <p className="font-sans text-red-400 text-sm">{error}</p>}

      {!loading && !error && (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans min-w-[640px]">
            <thead>
              <tr className="bg-bg-secondary text-text-secondary text-left">
                <th className="px-4 py-2 font-medium">Nombre</th>
                <th className="px-4 py-2 font-medium">Slug</th>
                <th className="px-4 py-2 font-medium">Uso</th>
                <th className="px-4 py-2 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {etiquetasFiltradas.map((etiqueta) => {
                const editando = editandoId === etiqueta.id
                return (
                  <tr key={etiqueta.id} className="border-t border-border">
                    {editando ? (
                      <>
                        <td className="px-4 py-2">
                          <input
                            value={editNombre}
                            onChange={(e) => setEditNombre(e.target.value)}
                            className="bg-bg border border-border rounded-md px-2 py-1 text-text text-sm w-full"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            value={editSlug}
                            onChange={(e) => setEditSlug(e.target.value)}
                            className="bg-bg border border-border rounded-md px-2 py-1 text-text text-sm w-full"
                          />
                        </td>
                        <td className="px-4 py-2 text-text-secondary">{etiqueta.contadorUso}</td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="primary"
                              className="px-3 py-1 text-xs"
                              disabled={guardando}
                              onClick={() => handleGuardarEdicion(etiqueta.id)}
                            >
                              Guardar
                            </Button>
                            <Button variant="ghost" className="px-3 py-1 text-xs" onClick={cancelarEdicion}>
                              Cancelar
                            </Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2 text-text">{etiqueta.nombre}</td>
                        <td className="px-4 py-2 text-text-secondary">{etiqueta.slug}</td>
                        <td className="px-4 py-2">
                          <Badge variant={etiqueta.contadorUso > 0 ? 'accent' : 'outline'}>
                            {etiqueta.contadorUso}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="secondary"
                              className="px-3 py-1 text-xs"
                              onClick={() => iniciarEdicion(etiqueta)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="ghost"
                              className="px-3 py-1 text-xs text-red-400 disabled:text-text-secondary"
                              disabled={etiqueta.contadorUso > 0}
                              title={
                                etiqueta.contadorUso > 0
                                  ? 'No se puede eliminar: está en uso'
                                  : undefined
                              }
                              onClick={() => handleEliminar(etiqueta)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                )
              })}
              {etiquetasFiltradas.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-text-secondary">
                    {qNormalizado
                      ? 'No encontramos etiquetas con esos criterios.'
                      : 'Todavía no hay etiquetas creadas.'}
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