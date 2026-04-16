import Link from 'next/link'
import StarIcon from '@/components/ui/StarIcon'
import Button from '@/components/ui/Button'

export default function FailurePage() {
  return (
    <main className="min-h-screen bg-glow-cream flex items-center justify-center px-6">
      <div className="text-center flex flex-col items-center gap-6 max-w-md">
        <StarIcon size={40} className="text-glow-navy/30" />

        <h1 className="font-cormorant text-5xl text-glow-navy font-light tracking-wide">
          Pago no completado
        </h1>

        <p className="font-montserrat text-sm text-glow-navy/60 leading-relaxed">
          Hubo un problema al procesar tu pago. No se realizó ningún cargo. Por favor intentá nuevamente.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link href="/checkout">
            <Button variant="primary" size="md">
              Intentar Nuevamente
            </Button>
          </Link>
          <Link href="/carrito">
            <Button variant="outline" size="md">
              Volver al Carrito
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
