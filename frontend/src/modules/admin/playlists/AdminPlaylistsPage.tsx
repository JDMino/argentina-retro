import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../../../shared/components/ui/Button'
import { deletePlaylist, getPlaylists, type Playlist } from '../../../services/playlists.service'
import { getDecadas, type Decada } from '../../../services/decadas.service'
import { getCategorias, type Categoria } from '../../../services/categorias.service'

export function AdminPlaylistsPage() {
  const { token } = useAuth()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [decadas, setDecadas] = useState<Decada[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function cargar() {
    setLoading(true)
    setError(null)
    try {
      const [playlistsData, decadasData, categoriasData] = await Promise.all([
        getPlaylists(),
        getDecadas(),
        getCategorias(),
      ])
      setPlaylists(playlistsData)
      setDecadas(decadasData)
      setCategorias(categoriasData)
    } catch {
      setError('No se pudieron cargar las playlists.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  function nombreDecada(id: string | null) {
    return decadas.find((d) => d.id === id)?.nombre ?? '—'
  }
  function nombreCategoria(id: string | null) {
    return categorias.find((c) => c.id === id)?.nombre ?? '—'
  }

  async function handleEliminar(playlist: Playlist) {
    if (!token) return
    const confirmado = window.confirm(
      `¿Eliminar "${playlist.nombre}"? Esta acción no se puede deshacer.`,
    )
    if (!confirmado) return

    try {
      await deletePlaylist(token, playlist.id)
      setPlaylists((prev) => prev.filter((p) => p.id !== playlist.id))
    } catch {
      window.alert('No se pudo eliminar la playlist.')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-sans font-semibold text-2xl text-text">Playlists</h1>
        <Link to="/admin/playlists/nueva">
          <Button variant="primary">+ Nueva playlist</Button>
        </Link>
      </div>

      {loading && <p className="font-sans text-text-secondary text-sm">Cargando...</p>}
      {error && <p className="font-sans text-red-400 text-sm">{error}</p>}

      {!loading && !error && (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="bg-bg-secondary text-text-secondary text-left">
                <th className="px-4 py-2 font-medium">Nombre</th>
                <th className="px-4 py-2 font-medium">YouTube ID</th>
                <th className="px-4 py-2 font-medium">Década</th>
                <th className="px-4 py-2 font-medium">Categoría</th>
                <th className="px-4 py-2 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {playlists.map((playlist) => (
                <tr key={playlist.id} className="border-t border-border">
                  <td className="px-4 py-2 text-text">{playlist.nombre}</td>
                  <td className="px-4 py-2 text-text-secondary">
                    {playlist.youtubePlaylistId ?? '—'}
                  </td>
                  <td className="px-4 py-2 text-text-secondary">
                    {nombreDecada(playlist.decadaId)}
                  </td>
                  <td className="px-4 py-2 text-text-secondary">
                    {nombreCategoria(playlist.categoriaId)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/playlists/${playlist.id}/editar`}>
                        <Button variant="secondary" className="px-3 py-1 text-xs">
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="px-3 py-1 text-xs text-red-400"
                        onClick={() => handleEliminar(playlist)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {playlists.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-text-secondary">
                    Todavía no hay playlists cargadas.
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