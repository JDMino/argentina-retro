import { useCallback, useEffect, useState } from 'react'
import {
  getComentarios,
  crearComentario,
  editarComentario,
  borrarComentario,
  type Comentario,
} from '../../services/comentarios.service'

interface UseComentariosResult {
  comentarios: Comentario[]
  loading: boolean
  error: string | null
  crear: (token: string, texto: string) => Promise<void>
  editar: (token: string, id: string, texto: string) => Promise<void>
  borrar: (token: string, id: string) => Promise<void>
}

export function useComentarios(contenidoId: string | undefined): UseComentariosResult {
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(() => {
    if (!contenidoId) return
    setLoading(true)
    getComentarios(contenidoId)
      .then(setComentarios)
      .catch(() => setError('No pudimos cargar los comentarios.'))
      .finally(() => setLoading(false))
  }, [contenidoId])

  useEffect(() => {
    cargar()
  }, [cargar])

  async function crear(token: string, texto: string) {
    if (!contenidoId) return
    await crearComentario(token, contenidoId, texto)
    cargar()
  }

  async function editar(token: string, id: string, texto: string) {
    await editarComentario(token, id, texto)
    cargar()
  }

  async function borrar(token: string, id: string) {
    await borrarComentario(token, id)
    cargar()
  }

  return { comentarios, loading, error, crear, editar, borrar }
}