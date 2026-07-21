'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import StarIcon from '@/components/ui/StarIcon'
import Button from '@/components/ui/Button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-glow-cream flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/">
            <span className="font-cormorant text-2xl tracking-widest text-glow-navy font-light">
              THE <span className="text-3xl font-normal">GLOW</span> MARKET
            </span>
          </Link>
          <div className="flex items-center justify-center gap-2 mt-3">
            <StarIcon size={8} className="text-glow-navy" />
            <p className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/60">
              Recuperar contraseña
            </p>
            <StarIcon size={8} className="text-glow-navy" />
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 flex flex-col gap-5">
          <h1 className="font-cormorant text-3xl text-glow-navy font-light tracking-wide">
            ¿Olvidaste tu contraseña?
          </h1>

          {sent ? (
            <div className="flex flex-col gap-4">
              <p className="font-montserrat text-sm text-glow-navy/70 leading-relaxed">
                Te enviamos un email a <strong>{email}</strong> con el link para restablecer tu contraseña.
              </p>
              <p className="font-montserrat text-xs text-glow-navy/40">
                Revisá también tu carpeta de spam.
              </p>
              <Link
                href="/login"
                className="font-montserrat text-xs text-glow-navy border-b border-glow-navy/30 hover:border-glow-navy pb-0.5 transition-colors self-start"
              >
                ← Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="font-montserrat text-xs text-glow-navy/50 leading-relaxed">
                Ingresá tu email y te enviamos un link para crear una nueva contraseña.
              </p>
              <div className="flex flex-col gap-1.5">
                <label className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/60">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border border-glow-navy/20 focus:border-glow-navy outline-none px-4 py-3 font-montserrat text-sm text-glow-navy bg-transparent transition-colors duration-300 placeholder:text-glow-navy/30"
                  placeholder="tu@email.com"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full mt-1" loading={loading}>
                Enviar link
              </Button>
              <Link
                href="/login"
                className="font-montserrat text-xs text-center text-glow-navy/40 hover:text-glow-navy transition-colors"
              >
                ← Volver al inicio de sesión
              </Link>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
