'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import StarIcon from '@/components/ui/StarIcon'
import Button from '@/components/ui/Button'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificando, setVerificando] = useState(true)
  const [linkValido, setLinkValido] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function verificarLink() {
      // Si el link ya generó sesión automáticamente (formato antiguo con #access_token),
      // no hace falta hacer nada más.
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setLinkValido(true)
        setVerificando(false)
        return
      }

      // Formato actual: el link trae ?code=... y hay que canjearlo por una sesión.
      const code = searchParams.get('code')
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
          setLinkValido(true)
          setVerificando(false)
          return
        }
      }

      setLinkValido(false)
      setVerificando(false)
    }

    verificarLink()
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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
    const { error } = await supabase.auth.updateUser({ password })
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

        {verificando ? (
          <div className="bg-white p-8 md:p-10 flex justify-center">
            <div className="w-6 h-6 border-2 border-glow-navy/30 border-t-glow-navy rounded-full animate-spin" />
          </div>
        ) : !linkValido ? (
          <div className="bg-white p-8 md:p-10 flex flex-col gap-4">
            <h1 className="font-cormorant text-2xl text-glow-navy font-light tracking-wide">
              Este link ya no es válido
            </h1>
            <p className="font-montserrat text-sm text-glow-navy/60 leading-relaxed">
              Puede haber expirado o ya haberse usado. Además, tiene que abrirse desde el mismo
              navegador donde pediste el cambio de contraseña — si lo abriste desde el mail en el
              celular y pediste el cambio desde la computadora (o viceversa), no va a funcionar.
            </p>
            <Link href="/forgot-password">
              <Button variant="primary" className="w-full mt-1">
                Pedir un link nuevo
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 flex flex-col gap-5">
            <h1 className="font-cormorant text-3xl text-glow-navy font-light tracking-wide">
              Crear nueva contraseña
            </h1>

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
                required
                className="border border-glow-navy/20 focus:border-glow-navy outline-none px-4 py-3 font-montserrat text-sm text-glow-navy bg-transparent transition-colors duration-300 placeholder:text-glow-navy/30"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full mt-1" loading={loading}>
              Guardar contraseña
            </Button>
          </form>
        )}
      </div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  )
}
