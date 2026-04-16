'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import StarIcon from '@/components/ui/StarIcon'
import Button from '@/components/ui/Button'

const checkoutSchema = z.object({
  nombre: z.string().min(2, 'Requerido'),
  apellido: z.string().min(2, 'Requerido'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(8, 'Teléfono inválido'),
  provincia: z.string().min(2, 'Requerido'),
  ciudad: z.string().min(2, 'Requerido'),
  direccion: z.string().min(5, 'Dirección inválida'),
  codigo_postal: z.string().min(4, 'Código postal inválido'),
  notas: z.string().optional(),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

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
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({ resolver: zodResolver(checkoutSchema) })

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

      // Redirigir a MercadoPago
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
          {/* Datos de envío */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="font-cormorant text-2xl text-glow-navy font-light mb-5">
                Datos de Contacto
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'nombre' as const, label: 'Nombre', placeholder: 'María' },
                  { name: 'apellido' as const, label: 'Apellido', placeholder: 'García' },
                ].map(({ name, label, placeholder }) => (
                  <div key={name} className="flex flex-col gap-1.5">
                    <label className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/60">
                      {label}
                    </label>
                    <input {...register(name)} placeholder={placeholder} className={INPUT_CLASS} />
                    {errors[name] && (
                      <p className="font-montserrat text-[10px] text-red-400">{errors[name]?.message}</p>
                    )}
                  </div>
                ))}
                <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                  <label className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/60">
                    Email
                  </label>
                  <input {...register('email')} type="email" placeholder="tu@email.com" className={INPUT_CLASS} />
                  {errors.email && (
                    <p className="font-montserrat text-[10px] text-red-400">{errors.email.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                  <label className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/60">
                    Teléfono
                  </label>
                  <input {...register('telefono')} placeholder="+54 11 1234-5678" className={INPUT_CLASS} />
                  {errors.telefono && (
                    <p className="font-montserrat text-[10px] text-red-400">{errors.telefono.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-cormorant text-2xl text-glow-navy font-light mb-5">
                Dirección de Envío
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/60">
                    Dirección
                  </label>
                  <input {...register('direccion')} placeholder="Av. Corrientes 1234" className={INPUT_CLASS} />
                  {errors.direccion && (
                    <p className="font-montserrat text-[10px] text-red-400">{errors.direccion.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/60">
                    Provincia
                  </label>
                  <select {...register('provincia')} className={INPUT_CLASS + ' cursor-pointer'}>
                    <option value="">Seleccionar...</option>
                    {PROVINCIAS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {errors.provincia && (
                    <p className="font-montserrat text-[10px] text-red-400">{errors.provincia.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/60">
                    Ciudad
                  </label>
                  <input {...register('ciudad')} placeholder="Buenos Aires" className={INPUT_CLASS} />
                  {errors.ciudad && (
                    <p className="font-montserrat text-[10px] text-red-400">{errors.ciudad.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/60">
                    Código Postal
                  </label>
                  <input {...register('codigo_postal')} placeholder="1000" className={INPUT_CLASS} />
                  {errors.codigo_postal && (
                    <p className="font-montserrat text-[10px] text-red-400">{errors.codigo_postal.message}</p>
                  )}
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/60">
                    Notas (opcional)
                  </label>
                  <textarea
                    {...register('notas')}
                    rows={3}
                    placeholder="Instrucciones especiales de entrega..."
                    className={INPUT_CLASS + ' resize-none'}
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="font-montserrat text-xs text-red-500 bg-red-50 px-4 py-3">
                {error}
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-8 flex flex-col gap-6 h-fit sticky top-24">
            <h2 className="font-cormorant text-2xl text-glow-navy font-light">
              Tu Pedido
            </h2>

            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <div className="relative w-14 h-16 flex-shrink-0 overflow-hidden bg-glow-cream">
                    <Image
                      src={item.imagen_url || '/placeholder-product.jpg'}
                      alt={item.nombre}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                    <span className="absolute -top-1.5 -right-1.5 bg-glow-navy text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-montserrat">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-cormorant text-base text-glow-navy leading-tight">{item.nombre}</p>
                    <p className="font-montserrat text-xs text-glow-navy/60 mt-0.5">
                      {formatPrice(item.precio * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px bg-glow-navy/10" />

            <div className="flex justify-between items-baseline">
              <span className="font-montserrat text-xs tracking-[0.15em] uppercase text-glow-navy/60">Total</span>
              <span className="font-cormorant text-3xl text-glow-navy">{formatPrice(total())}</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="md"
              loading={loading}
            >
              Pagar con MercadoPago
            </Button>

            <p className="font-montserrat text-[9px] text-center text-glow-navy/30 leading-relaxed">
              Serás redirigida a MercadoPago para completar el pago de forma segura.
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}
