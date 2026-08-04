'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <button
      onClick={handleLogout}
      className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/40 hover:text-glow-navy transition-colors"
    >
      Cerrar Sesión
    </button>
  )
}
