'use client'

import { useState } from 'react'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setStatus('success')
      setEmail('')
    } else {
      setStatus('error')
    }
  }

  return (
    <div className="text-center mt-6 mb-2">
      <p className="font-montserrat text-[10px] tracking-[0.25em] uppercase text-glow-navy/40 mb-4">
        Coming Soon · Dejá tu mail para ser la primera en enterarte
      </p>
      {status === 'success' ? (
        <p className="font-cormorant text-lg text-glow-navy/60 italic">
          ¡Gracias! Te avisamos cuando lancemos.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center justify-center gap-0 max-w-sm mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@mail.com"
            required
            className="flex-1 border border-glow-navy/20 bg-transparent px-4 py-2.5 font-montserrat text-xs text-glow-navy placeholder:text-glow-navy/30 outline-none focus:border-glow-navy/50 transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-glow-navy text-white font-montserrat text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 hover:bg-glow-blue transition-colors duration-300 whitespace-nowrap disabled:opacity-50"
          >
            {status === 'loading' ? '...' : 'Anotarme'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="font-montserrat text-[10px] text-red-400 mt-2">
          Ese mail ya está registrado o hubo un error. Intentá de nuevo.
        </p>
      )}
    </div>
  )
}
