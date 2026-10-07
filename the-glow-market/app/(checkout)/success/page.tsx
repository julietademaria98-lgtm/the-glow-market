'use client'

import '@/components/ui/glow-secondary.css'


import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import StarIcon from '@/components/ui/StarIcon'
import Button from '@/components/ui/Button'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const isPending = searchParams.get('pending') === 'true'
  const orderId = searchParams.get('order')

  return (
    <main className="glow-secondary glow-secondary-success min-h-screen bg-glow-cream flex items-center justify-center px-6">
      <div className="glow-secondary-card text-center flex flex-col items-center gap-6 max-w-md">
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
            : 'Cuando Mercado Pago confirme tu pago, recibirás la confirmación en el mail de tu compra. Si compraste un curso, tu cuenta se crea automáticamente y te enviamos el enlace para entrar.'}
        </p>

        {orderId && (
          <p className="font-montserrat text-xs text-glow-navy/40 tracking-wide">
            Orden: #{orderId.slice(0, 8).toUpperCase()}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link href="/login">
            <Button variant="primary" size="md">
              Ya recibí mi acceso
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
