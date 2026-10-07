'use client'

import '@/components/ui/glow-secondary.css'


import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AccesoCompra() {
  const [email, setEmail] = useState('')
  useEffect(() => {
    setEmail(new URLSearchParams(window.location.hash.slice(1)).get('email') || '')
  }, [])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function enter() {
    setLoading(true)
    const token = new URLSearchParams(window.location.hash.slice(1)).get('token_hash')
    if (!token) { setError('Falta el enlace personal. Pedí uno nuevo abajo.'); setLoading(false); return }
    try {
      const { error } = await createClient().auth.verifyOtp({ token_hash: token, type: 'email' })
      if (error) throw error
      window.history.replaceState(null, '', '/acceso-compra')
      window.location.replace('/reset-password')
    } catch {
      setError('Este enlace venció o ya se usó. Podés pedir uno nuevo con el mail de tu compra.')
      setLoading(false)
    }
  }
  return <main className="glow-secondary glow-secondary-message min-h-screen bg-glow-cream flex items-center justify-center px-6">
    <div className="glow-secondary-card max-w-md rounded-3xl bg-[#F4EFE9] p-8 text-glow-navy text-center space-y-6">
      <h1 className="font-cormorant text-4xl">Creá tu contraseña.</h1>
      <div className="text-left space-y-3">
        <label htmlFor="purchase-email" className="block text-sm">Usuario</label>
        <input id="purchase-email" value={email} readOnly placeholder="El mail de tu compra se confirmará al continuar" className="w-full border rounded-xl p-3 bg-glow-cream" />
        <p className="text-sm">Contraseña</p>
      </div>
      <button disabled={loading} onClick={enter} className="rounded-full bg-glow-navy text-white px-8 py-3">{loading ? 'Verificando enlace…' : 'Crear o recuperar contraseña'}</button>
      {error && <p role="alert">{error}</p>}
      <Link href="/login" className="block underline">Pedir un nuevo enlace</Link>
    </div>
  </main>
}
