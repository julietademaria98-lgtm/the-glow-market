import Link from 'next/link'
import StarIcon from '@/components/ui/StarIcon'
import Button from '@/components/ui/Button'

interface SearchParams {
  order?: string
  pending?: string
}

export default function SuccessPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const isPending = searchParams.pending === 'true'

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
            : 'Tu pedido fue confirmado exitosamente. Recibirás un email con los detalles de tu compra.'}
        </p>

        {searchParams.order && (
          <p className="font-montserrat text-xs text-glow-navy/40 tracking-wide">
            Orden: #{searchParams.order.slice(0, 8).toUpperCase()}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link href="/productos">
            <Button variant="primary" size="md">
              Seguir Comprando
            </Button>
          </Link>
          <Link href="/mi-curso">
            <Button variant="outline" size="md">
              Mis Cursos
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
