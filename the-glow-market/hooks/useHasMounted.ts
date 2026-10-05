'use client'

import { useEffect, useState } from 'react'

/**
 * Devuelve false en el server y en el primer render del cliente, true después de montar.
 * Sirve para evitar errores de hidratación con estado que solo existe en el cliente
 * (ej. el carrito persistido en localStorage).
 */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
