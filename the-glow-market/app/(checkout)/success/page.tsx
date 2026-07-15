'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import StarIcon from '@/components/ui/StarIcon'
import Button from '@/components/ui/Button'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isPending = searchParams.get('pending') === 'true'
  const order = searchParams.get('order')
  const [segundos, setSegundos] = useState(5)

  useEffect(() => {
    if (isPending) return
    const interval = setInterval(() => {
      setSegundos((s) => {
        if (s <= 1) {
          clearInterval(interval)
          router.push('/mi-curso')
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isPending, router])

  return (
    <main className="min-h-screen bg-glow-cream flex items-center justify-center px-6">
      <div className="text-center flex flex-col items-center gap-6 max-w-md">
        <div className="flex items-center justify-center gap-2">
          <StarIcon size={16} className="text-glow-navy" />
          <StarIcon size={24} className="text-glow-navy" />
          <StarIcon size={16} className="text-glow-navy" />
        </div>

        <h1 className="font-cormorant text-5xl text-glow-navy font-light tracking-wide">
          {isPending ? '¡Pago en proceso!' : '¡Gracias por tu compra!'}
        </h1>

        <p className="font-montserrat text-sm text-glow-navy/60 leading-relaxed">
          {isPending
            ? 'Tu pago está siendo procesado. Te enviaremos un email cuando se confirme.'
            : 'Tu pedido fue confirmado exitosamente. Recibirás un email con los detalles.'}
        </p>

        {order && (
          <p className="font-montserrat text-xs text-glow-navy/40 tracking-wide">
            Orden: #{order.slice(0, 8).toUpperCase()}
          </p>
        )}

        {!isPending && (
          <p className="font-montserrat text-xs text-glow-navy/50">
            Entrando a tu curso en {segundos}...
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          {!isPending && (
            <Link href="/mi-curso">
              <Button variant="primary" size="md">
                Ir a mi curso ahora
              </Button>
            </Link>
          )}
          <Link href="/productos">
            <Button variant="outline" size="md">
              Seguir Comprando
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-glow-cream flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-glow-navy border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <SuccessContent />
    </Suspense>
  )
}
