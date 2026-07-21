'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import StarIcon from '@/components/ui/StarIcon'
import Button from '@/components/ui/Button'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isPending = searchParams.get('pending') === 'true'
  const orderId = searchParams.get('order')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (isPending) return
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          router.push('/mi-curso')
          return 0
        }
        return prev - 1
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
            : 'Tu pedido fue confirmado. Recibirás un email con los detalles.'}
        </p>

        {orderId && (
          <p className="font-montserrat text-xs text-glow-navy/40 tracking-wide">
            Orden: #{orderId.slice(0, 8).toUpperCase()}
          </p>
        )}

        {!isPending && (
          <p className="font-montserrat text-xs text-glow-navy/40">
            Redirigiendo a tu curso en {countdown}s...
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link href="/mi-curso">
            <Button variant="primary" size="md">
              Ir a mi curso
            </Button>
          </Link>
          <Link href="/productos">
            <Button variant="outline" size="md">
              Seguir comprando
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
