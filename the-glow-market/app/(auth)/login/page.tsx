'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import StarIcon from '@/components/ui/StarIcon'
import Button from '@/components/ui/Button'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawRedirect = searchParams.get('redirect') || '/'
  const redirectTo = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/'

  const [linkEmail, setLinkEmail] = useState('')
  const [linkMessage, setLinkMessage] = useState('')
  const [linkLoading, setLinkLoading] = useState(false)
  async function sendLink() {
    setLinkLoading(true)
    try {
      const { error } = await createClient().auth.signInWithOtp({ email: linkEmail.trim().toLowerCase(), options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/reset-password` } })
      setLinkMessage(error ? 'Si ya compraste, revisá el mail ingresado o intentá nuevamente en unos minutos.' : 'Si hay una cuenta con ese mail, recibirás un enlace para entrar.')
    } catch { setLinkMessage('No pudimos enviar el enlace. Intentá nuevamente.') }
    finally { setLinkLoading(false) }
  }

  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginForm) => {
    setServerError(null)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setServerError('Email o contraseña incorrectos.')
      return
    }

    router.push(redirectTo)
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
              Acceso a Cursos
            </p>
            <StarIcon size={8} className="text-glow-navy" />
          </div>
        </div>

        <div className="bg-white p-8 mb-4 space-y-4">
          <h2 className="font-cormorant text-3xl text-glow-navy">Entrar sin contraseña</h2>
          <p className="text-sm text-glow-navy">Usá el mail con el que compraste.</p>
          <input aria-label="Email de compra" type="email" value={linkEmail} onChange={e => setLinkEmail(e.target.value)} className="border p-3 w-full" placeholder="tu@email.com" />
          <Button type="button" onClick={sendLink} loading={linkLoading} disabled={!linkEmail.includes('@')}>Enviarme un enlace</Button>
          {linkMessage && <p role="status" className="text-sm">{linkMessage}</p>}
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 md:p-10 flex flex-col gap-5"
        >
          <h1 className="font-cormorant text-3xl text-glow-navy font-light tracking-wide">
            Iniciar Sesión
          </h1>

          {serverError && (
            <p className="font-montserrat text-xs text-red-500 bg-red-50 px-4 py-3">
              {serverError}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/60">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="border border-glow-navy/20 focus:border-glow-navy outline-none px-4 py-3 font-montserrat text-sm text-glow-navy bg-transparent transition-colors duration-300 placeholder:text-glow-navy/30"
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="font-montserrat text-[10px] text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/60">
              Contraseña
            </label>
            <input
              type="password"
              {...register('password')}
              className="border border-glow-navy/20 focus:border-glow-navy outline-none px-4 py-3 font-montserrat text-sm text-glow-navy bg-transparent transition-colors duration-300 placeholder:text-glow-navy/30"
              placeholder="••••••••"
            />
                        {errors.password && (
              <p className="font-montserrat text-[10px] text-red-400">{errors.password.message}</p>
            )}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="font-montserrat text-[10px] text-glow-navy/40 hover:text-glow-navy transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            loading={isSubmitting}
          >
            Ingresar
          </Button>

          <p className="font-montserrat text-xs text-center text-glow-navy/50">
            ¿No tenés cuenta?{' '}
            <Link
              href="/registro"
              className="text-glow-navy border-b border-glow-navy/30 hover:border-glow-navy pb-0.5 transition-colors"
            >
              Registrate
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-glow-cream flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-glow-navy border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <LoginForm />
    </Suspense>
  )
}
