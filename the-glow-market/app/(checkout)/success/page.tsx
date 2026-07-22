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
  const [countdown, setCountdown] = useState(8)
  const [copied, setCopied] = useState(false)

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

  function handleShare() {
    const url = 'https://theglowmarket.com.ar/cursos/day-to-night-glow'
    if (navigator.share) {
      navigator.share({ title: 'The Glow Market', text: 'Estoy haciendo el curso Day to Night Glow de The Glow Market', url })
    } else {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <main className="min-h-screen bg-glow-cream flex items-center justify-center px-6">
      <div className="text-center flex flex-col items-center gap-6 max-w-lg">

        <div className="flex items-center justify-center gap-2">
          <StarIcon size={16} className="text-glow-navy" />
          <StarIcon size={24} className="text-glow-navy" />
          <StarIcon size={16} className="text-glow-navy" />
        </div>

        <h1 className="font-cormorant text-5xl md:text-6xl text-glow-navy font-light tracking-wide">
          {isPending ? '¡Pago en proceso!' : '¡Gracias por tu compra!'}
        </h1>

        <p className="font-cormorant text-2xl text-glow-navy/70 font-light italic">
          {isPending
            ? 'Tu pago está siendo procesado.'
            : 'Bienvenida a la comunidad Glow.'}
        </p>

        <p className="font-montserrat text-sm text-glow-navy/60 leading-relaxed max-w-sm">
          {isPending
            ? 'Te avisaremos por email cuando se confirme el pago. Ya podés cerrar esta ventana.'
            : 'Tu curso ya está disponible. Ingresá con tu usuario y contraseña para empezar cuando quieras, de por vida.'}
        </p>

        {orderId && (
          <p className="font-montserrat text-xs text-glow-navy/30 tracking-widest uppercase">
            Orden #{orderId.slice(0, 8).toUpperCase()}
          </p>
        )}

        {!isPending && (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full max-w-xs">
              <Link href="/mi-curso" className="w-full">
                <Button variant="primary" size="md" className="w-full">
                  Ir a mi curso
                </Button>
              </Link>
            </div>

            {/* CTA compartir */}
            <div className="mt-4 pt-6 border-t border-glow-navy/10 w-full max-w-sm flex flex-col items-center gap-3">
              <p className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/40">
                ¿Querés compartirlo?
              </p>
              <p className="font-cormorant text-lg text-glow-navy/60 font-light">
                Contale a alguien que también lo necesita
              </p>
              <button
                onClick={handleShare}
                className="font-montserrat text-[10px] tracking-[0.2em] uppercase border border-glow-navy/30 text-glow-navy px-6 py-3 hover:bg-glow-navy hover:text-white transition-all duration-300"
              >
                {copied ? '¡Link copiado!' : 'Compartir el curso →'}
              </button>
            </div>

            <p className="font-montserrat text-[10px] text-glow-navy/30">
              Redirigiendo a tu curso en {countdown}s...
            </p>
          </>
        )}

        {isPending && (
          <Link href="/">
            <Button variant="outline" size="md">
              Volver al inicio
            </Button>
          </Link>
        )}
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
