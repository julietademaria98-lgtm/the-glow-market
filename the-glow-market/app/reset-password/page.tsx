'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import StarIcon from '@/components/ui/StarIcon'
import Button from '@/components/ui/Button'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [ready, setReady] = useState(false)
  useEffect(() => {
    createClient().auth.getUser().then(({ data, error }) => {
      if (error || !data.user?.email) { setError('Abrí el enlace de tu mail para crear o recuperar tu contraseña.'); return }
      setEmail(data.user.email)
      setReady(true)
    }).catch(() => setError('No pudimos verificar el acceso. Pedí un nuevo enlace.'))
  }, [])
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!ready) return
    setError(null)
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password }).catch(() => ({ error: new Error('Sin conexión') }))
    if (error) {
      setError('Hubo un error. El link puede haber expirado, pedí uno nuevo.')
      setLoading(false)
      return
    }
    router.push('/mi-curso')
    router.refresh()
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
              Nueva contraseña
            </p>
            <StarIcon size={8} className="text-glow-navy" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#F4EFE9] rounded-3xl p-8 md:p-10 flex flex-col gap-5">
          <h1 className="font-cormorant text-3xl text-glow-navy font-light tracking-wide">
            Crear nueva contraseña
          </h1>

          <label htmlFor="account-email" className="text-sm text-glow-navy">Usuario</label>
          <input id="account-email" type="email" value={email} readOnly className="border rounded-xl px-4 py-3 w-full text-glow-navy" />
          {error && (
            <p className="font-montserrat text-xs text-red-500 bg-red-50 px-4 py-3">{error}</p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/60">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={6}
              disabled={!ready}
              required
              className="border border-glow-navy/20 focus:border-glow-navy outline-none px-4 py-3 font-montserrat text-sm text-glow-navy bg-transparent transition-colors duration-300 placeholder:text-glow-navy/30"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/60">
              Repetir contraseña
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              minLength={6}
              disabled={!ready}
              required
              className="border border-glow-navy/20 focus:border-glow-navy outline-none px-4 py-3 font-montserrat text-sm text-glow-navy bg-transparent transition-colors duration-300 placeholder:text-glow-navy/30"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full mt-1" loading={loading} disabled={!ready}>
            Guardar e ingresar
          </Button>
          <Link href="/login" className="text-center underline text-glow-navy">Pedir un nuevo enlace</Link>
        </form>
      </div>
    </main>
  )
}
