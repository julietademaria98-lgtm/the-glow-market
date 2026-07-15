'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import StarIcon from '@/components/ui/StarIcon'
import Button from '@/components/ui/Button'
import { Suspense } from 'react'

const registerSchema = z
  .object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof registerSchema>

function RegistroForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/checkout'
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterForm) => {
    setServerError(null)
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setServerError(error.message)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <main className="min-h-screen bg-glow-cream flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center flex flex-col items-center gap-6">
          <StarIcon size={40} className="text-glow-navy" />
          <h1 className="font-cormorant text-4xl text-glow-navy font-light tracking-wide">
            ¡Cuenta creada!
          </h1>
          <p className="font-montserrat text-sm text-glow-navy/60 max-w-xs leading-relaxed">
            Revisá tu email para confirmar tu cuenta y luego iniciá sesión para continuar con tu compra.
          </p>
          <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`}>
            <Button variant="primary" size="md">
              Ir al Login
            </Button>
          </Link>
        </div>
      </main>
    )
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
              Crear Cuenta
            </p>
            <StarIcon size={8} className="text-glow-navy" />
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 md:p-10 flex flex-col gap-5"
        >
          <h1 className="font-cormorant text-3xl text-glow-navy font-light tracking-wide">
            Registrarse
          </h1>

          {serverError && (
            <p className="font-montserrat text-xs text-red-500 bg-red-50 px-4 py-3">
              {serverError}
            </p>
          )}

          {[
            { name: 'email' as const, label: 'Email', type: 'email', placeholder: 'tu@email.com' },
            { name: 'password' as const, label: 'Contraseña', type: 'password', placeholder: '••••••••' },
            { name: 'confirmPassword' as const, label: 'Confirmar Contraseña', type: 'password', placeholder: '••••••••' },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name} className="flex flex-col gap-1.5">
              <label className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/60">
                {label}
              </label>
              <input
                type={type}
                {...register(name)}
                className="border border-glow-navy/20 focus:border-glow-navy outline-none px-4 py-3 font-montserrat text-sm text-glow-navy bg-transparent transition-colors duration-300 placeholder:text-glow-navy/30"
                placeholder={placeholder}
              />
              {errors[name] && (
                <p className="font-montserrat text-[10px] text-red-400">
                  {errors[name]?.message}
                </p>
              )}
            </div>
          ))}

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            loading={isSubmitting}
          >
            Crear Cuenta
          </Button>

          <p className="font-montserrat text-xs text-center text-glow-navy/50">
            ¿Ya tenés cuenta?{' '}
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
              className="text-glow-navy border-b border-glow-navy/30 hover:border-glow-navy pb-0.5 transition-colors"
            >
              Iniciá sesión
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}

export default function RegistroPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-glow-cream flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-glow-navy border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <RegistroForm />
    </Suspense>
  )
}
