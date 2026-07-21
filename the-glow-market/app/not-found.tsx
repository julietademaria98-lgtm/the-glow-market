import Link from 'next/link'
import StarIcon from '@/components/ui/StarIcon'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-glow-cream flex flex-col items-center justify-center px-6 text-center gap-8">

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <StarIcon size={10} className="text-glow-navy/30" />
          <span className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-navy/40">
            Error 404
          </span>
          <StarIcon size={10} className="text-glow-navy/30" />
        </div>

        <h1
          className="font-cormorant text-glow-navy font-light leading-none"
          style={{ fontSize: 'clamp(80px, 15vw, 180px)' }}
        >
          404
        </h1>

        <p className="font-cormorant text-2xl md:text-3xl text-glow-navy font-light tracking-wide">
          Página no encontrada
        </p>

        <p className="font-montserrat text-xs text-glow-navy/50 max-w-xs leading-relaxed mt-2">
          La página que buscás no existe o fue movida.
        </p>
      </div>

      <Link
        href="/"
        className="font-montserrat text-[11px] tracking-[0.25em] uppercase text-glow-navy border border-glow-navy/30 px-8 py-3 hover:bg-glow-navy hover:text-white transition-all duration-300"
      >
        Volver al inicio
      </Link>
    </main>
  )
}
