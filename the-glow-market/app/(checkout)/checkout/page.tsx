'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'
import StarIcon from '@/components/ui/StarIcon'
import Button from '@/components/ui/Button'

const baseSchema = {
  nombre: z.string().min(2, 'Requerido'),
  apellido: z.string().min(2, 'Requerido'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(8, 'Teléfono inválido'),
  dni: z.string().min(7, 'DNI inválido'),
}

const checkoutSchema = z.object({
  ...baseSchema,
  provincia: z.string().optional(),
  ciudad: z.string().optional(),
  direccion: z.string().optional(),
  codigo_postal: z.string().optional(),
  notas: z.string().optional(),
})

const checkoutSchemaFisico = z.object({
  ...baseSchema,
  provincia: z.string().min(2, 'Requerido'),
  ciudad: z.string().min(2, 'Requerido'),
  direccion: z.string().min(5, 'Dirección inválida'),
  codigo_postal: z.string().min(4, 'Código postal inválido'),
  notas: z.string().optional(),
})

type CheckoutForm = z.infer<typeof checkoutSchemaFisico>

const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
  'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
  'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
  'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
  'Tierra del Fuego', 'Tucumán',
]

const INPUT_CLASS =
  'border border-glow-navy/20 focus:border-glow-navy outline-none px-4 py-3 font-montserrat text-sm text-glow-navy bg-transparent transition-colors duration-300 placeholder:text-glow-navy/30 w-full'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const soloDigital = items.length > 0 && items.every((i) => i.tipo === 'curso')
  const hasCurso = items.some((i) => i.tipo === 'curso')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setCheckingAuth(false)
    })
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(soloDigital ? checkoutSchema : checkoutSchemaFisico),
  })

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-glow-cream pt-24 flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-6 px-6">
          <StarIcon size={40} className="text-glow-navy/20" />
          <p className="font-cormorant text-3xl text-glow-navy/40">
            No hay productos en tu carrito
          </p>
          <Link href="/productos">
            <Button variant="primary" size="md">Ver Tienda</Button>
          </Link>
        </div>
      </main>
    )
  }

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-glow-cream flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-glow-navy border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  if (hasCurso && !user) {
    return (
      <main className="min-h-screen bg-glow-cream pt-24 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <StarIcon size={10} className="text-glow-navy" />
              <StarIcon size={16} className="text-glow-navy" />
              <StarIcon size={10} className="text-glow-navy" />
            </div>
            <h1 className="font-cormorant text-4xl text-glow-navy font-light tracking-wide mb-4">
              Antes de continuar
            </h1>
            <p className="font-montserrat text-sm text-glow-navy/60 leading-relaxed max-w-sm mx-auto">
              Estás comprando un curso online. Para poder acceder a él una vez acreditado el pago,
              necesitás una cuenta en The Glow Market con el mismo email que uses para la compra.
            </p>
          </div>

          <div className="bg-white p-8 flex flex-col gap-4">
            <p className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/40 text-center">
              ¿Cómo querés continuar?
            </p>
            <Link href="/registro?redirect=/checkout">
              <Button variant="primary" className="w-full" size="md">
                Crear cuenta nueva
              </Button>
            </Link>
            <Link href="/login?redirect=/checkout">
              <Button variant="outline" className="w-full" size="md">
                Ya tengo cuenta — Iniciar sesión
              </Button>
            </Link>
            <p className="font-montserrat text-xs text-glow-navy/70 text-center leading-relaxed pt-2">
              Solo toma un minuto. Con ese usuario y contraseña vas a poder ver el curso desde cualquier dispositivo.
            </p>
          </div>
        </div>
      </main>
    )
  }

  const onSubmit = async (datosEnvio: CheckoutForm) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, datosEnvio }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al procesar el pago')

      window.location.href = data.init_point
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-glow-cream pt-24">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-10">
          <StarIcon size={12} className="text-glow-navy" />
          <h1 className="font-cormorant text-4xl md:text-5xl text-glow-navy font-light tracking-wide">
            Checkout
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12"
        >
          <div className="flex flex-col gap-8">
