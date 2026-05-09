import Link from 'next/link'
import StarIcon from '@/components/ui/StarIcon'
import { Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-glow-cream py-16 px-6">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center gap-8">
        {/* Logo */}
        <Link href="/">
          <span className="font-cormorant text-2xl md:text-3xl tracking-widest font-light text-glow-navy">
            THE <span className="text-4xl md:text-5xl font-normal">GLOW</span> MARKET
          </span>
        </Link>

        {/* Tagline */}
        <div className="flex items-center gap-3">
          <StarIcon size={10} className="text-glow-navy/40" />
          <span className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-navy/40">
            Own Your Glow
          </span>
          <StarIcon size={10} className="text-glow-navy/40" />
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
              className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/50 hover:text-glow-navy transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RRSS */}
        <div className="flex gap-4">
          <a
            href="https://instagram.com/theglowmarket"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-glow-navy/40 hover:text-glow-navy transition-colors duration-300"
          >
            <Instagram size={18} />
          </a>
          <a
            href="https://tiktok.com/@theglowmarket"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="text-glow-navy/40 hover:text-glow-navy transition-colors duration-300"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34l-.01-8.89a8.28 8.28 0 004.84 1.55V4.52a4.85 4.85 0 01-1.07-.18z" />
            </svg>
          </a>
        </div>

        {/* Divider + Copyright */}
        <div className="w-full max-w-xs h-px bg-glow-navy/10 my-2" />
        <p className="font-montserrat text-[10px] tracking-widest text-glow-navy/30 uppercase">
          © {new Date().getFullYear()} The Glow Market. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
