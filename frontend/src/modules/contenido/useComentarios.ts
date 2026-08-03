import { useCallback, useEffect, useState } from 'react'
import {
  getComentarios,
  crearComentario,
  editarComentario,
  borrarComentario,
  type Comentario,
} from '../../services/comentarios.service'

const LIMITE = 10

interface UseComentariosResult {
  comentarios: Comentario[]
  loading: boolean
  error: string | null
  pagina: number
  totalPaginas: number
  irAPagina: (pagina: number) => void
  crear: (token: string, texto: string) => Promise<void>
  editar: (token: string, id: string, texto: string) => Promise<void>
  borrar: (token: string, id: string) => Promise<void>
}

export function useComentarios(contenidoId: string | undefined): UseComentariosResult {
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagina, setPagina] = useState(1)
  const [total, setTotal] = useState(0)

  const totalPaginas = Math.max(1, Math.ceil(total / LIMITE))

  const cargar = useCallback(async () => {
    if (!contenidoId) return
    setLoading(true)
    try {
      const data = await getComentarios(contenidoId, pagina, LIMITE)
      setComentarios(data.items)
      setTotal(data.total)
    } catch {
      setError('No pudimos cargar los comentarios.')
    } finally {
      setLoading(false)
    }
  }, [contenidoId, pagina])

  useEffect(() => {
    async function cargarInicial() {
      await cargar()
    }
    cargarInicial()
  }, [cargar])

  // Si cambia el contenido (navegación entre detalles), siempre arrancar en página 1.
  useEffect(() => {
    setPagina(1)
  }, [contenidoId])

  function irAPagina(nuevaPagina: number) {
    setPagina(nuevaPagina)
  }

  async function crear(token: string, texto: string) {
    if (!contenidoId) return
    await crearComentario(token, contenidoId, texto)
    if (pagina !== 1) {
      setPagina(1) // el comentario nuevo aparece primero (orden DESC), llevarlo a la página 1
    } else {
      cargar()
    }
  }

  async function editar(token: string, id: string, texto: string) {
    await editarComentario(token, id, texto)
    cargar()
  }

  async function borrar(token: string, id: string) {
    await borrarComentario(token, id)
    cargar()
  }

  return { comentarios, loading, error, pagina, totalPaginas, irAPagina, crear, editar, borrar }
}