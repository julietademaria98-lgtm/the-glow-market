'use client'

import { useState } from 'react'
import Image from 'next/image'
import StarIcon from '@/components/ui/StarIcon'

export default function ComingSoonPage() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/suscribirse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setEnviado(true)
    } else {
      setError('Este email ya está registrado o hubo un error. Intentá de nuevo.')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-glow-navy flex flex-col items-center justify-center px-6 text-center gap-8">

      {/* Logo circular */}
      <Image
        src="/images/Recurso 20Iso (1).png"
        alt="The Glow Market"
        width={160}
        height={160}
        className="object-contain opacity-90"
      />

      {/* Coming Soon */}
      <div className="flex flex-col items-center gap-3">
        <h1
          className="font-cormorant text-white font-light uppercase leading-none"
          style={{ fontSize: 'clamp(48px, 8vw, 100px)', letterSpacing: '0.1em' }}
        >
          Coming Soon
        </h1>
        <div className="flex items-center gap-3">
          <StarIcon size={8} className="text-white/40" />
          <p className="font-montserrat text-[11px] tracking-[0.4em] uppercase text-white/50">
            Own Your Glow
          </p>
          <StarIcon size={8} className="text-white/40" />
        </div>
      </div>

      {/* Formulario */}
      <div className="w-full max-w-sm flex flex-col gap-4">
        {enviado ? (
          <div className="flex flex-col items-center gap-3">
            <StarIcon size={14} className="text-white/60" />
            <p className="font-cormorant text-white text-2xl font-light">
              ¡Ya estás en la lista!
            </p>
            <p className="font-montserrat text-xs text-white/50 leading-relaxed">
              Vas a ser la primera en enterarte cuando lancemos.
            </p>
          </div>
        ) : (
          <>
            <p className="font-montserrat text-xs text-white/50 leading-relaxed tracking-wide">
              Suscribite para ser la primera en recibir información — y acceder a un precio exclusivo de lanzamiento.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="bg-transparent border border-white/20 focus:border-white/60 outline-none px-4 py-3 font-montserrat text-sm text-white placeholder:text-white/30 transition-colors duration-300 text-center"
              />
              {error && (
                <p className="font-montserrat text-[10px] text-red-300">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="font-montserrat text-[11px] tracking-[0.25em] uppercase text-glow-navy bg-white px-8 py-3 hover:bg-white/90 transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Quiero enterarme primero'}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  )
}
