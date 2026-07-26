import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../modules/auth/AuthContext'
import { useFavoritos } from '../../../modules/favoritos/FavoritosContext'
import { Button } from './Button'

interface FavoritoButtonProps {
  contenidoId: string
}

export function FavoritoButton({ contenidoId }: FavoritoButtonProps) {
  const { usuario } = useAuth()
  const { estaEnFavoritos, toggleFavorito } = useFavoritos()
  const navigate = useNavigate()
  const location = useLocation()
  const [submitting, setSubmitting] = useState(false)

  const esFavorito = estaEnFavoritos(contenidoId)

  async function handleClick() {
    if (!usuario) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    setSubmitting(true)
    try {
      await toggleFavorito(contenidoId)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Button variant={esFavorito ? 'primary' : 'secondary'} onClick={handleClick} disabled={submitting}>
      {esFavorito ? '♥ En favoritos' : '♡ Agregar a favoritos'}
    </Button>
  )
}