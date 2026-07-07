import Link from 'next/link'
import StarIcon from '@/components/ui/StarIcon'
import { Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-glow-navy text-white py-16 px-6">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center gap-8">
        {/* Logo */}
        <Link href="/">
          <span className="font-cormorant text-2xl md:text-3xl tracking-widest font-light">
            THE <span className="text-4xl md:text-5xl font-normal">GLOW</span> MARKET
          </span>
        </Link>

        {/* Tagline */}
        <div className="flex items-center gap-3">
          <StarIcon size={10} className="text-glow-blush" />
          <span className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-blush">
            Own Your Glow
          </span>
          <StarIcon size={10} className="text-glow-blush" />
        </div>

        {/* Nav Links */}
        <nav className="flex flex-wrap justify-center gap-6 md:gap-10">
          {[
            { href: '/productos', label: 'Tienda' },
            { href: '/cursos', label: 'Cursos' },
            { href: '/mi-curso', label: 'Mi Cuenta' },
            { href: 'mailto:hola@theglowmarket.com', label: 'Contacto' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RRSS */}
        <div className="flex gap-4">
          <a
            href="https://www.instagram.com/theglowmarket_/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-white/60 hover:text-white transition-colors duration-300"
          >
            <Instagram size={18} />
          </a>
        </div>

        {/* Divider + Copyright */}
        <div className="w-full max-w-xs h-px bg-white/10 my-2" />
        <p className="font-montserrat text-[10px] tracking-widest text-white/40 uppercase">
          © {new Date().getFullYear()} The Glow Market. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
