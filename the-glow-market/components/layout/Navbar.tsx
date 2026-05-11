'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { Menu, X } from 'lucide-react'
import StarIcon from '@/components/ui/StarIcon'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const itemCount = useCartStore((state) => state.itemCount())
  const pathname = usePathname()
  const isHome = pathname === '/'
  const solid = !isHome || scrolled

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const linkClass = `font-montserrat font-semibold text-[11px] tracking-[0.15em] uppercase transition-colors duration-300`

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          solid ? 'bg-glow-cream shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">

          {/* LEFT LINKS — desktop */}
          <div className="hidden md:flex gap-8">
            <Link href="/productos" className={`${linkClass} ${!solid ? 'text-white/90 hover:text-white' : 'text-glow-navy hover:text-glow-navy/60'}`}>
              Market
            </Link>
            <Link href="/cursos" className={`${linkClass} ${!solid ? 'text-white/90 hover:text-white' : 'text-glow-navy hover:text-glow-navy/60'}`}>
              Cursos Online
            </Link>
          </div>

          {/* CENTER LOGO */}
          <Link
            href="/"
            className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-500 ${
              solid ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            <span className="font-cormorant text-xl md:text-2xl tracking-widest text-glow-navy font-light select-none">
              THE{' '}
              <span className="text-2xl md:text-4xl font-normal">GLOW</span>{' '}
              MARKET
            </span>
          </Link>

          {/* RIGHT ACTIONS — desktop */}
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/carrito" className={`relative ${linkClass} ${!solid ? 'text-white/90 hover:text-white' : 'text-glow-navy hover:text-glow-navy/60'}`}>
              Carrito
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-glow-navy text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-montserrat">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link href="/login" className={`${linkClass} ${!solid ? 'text-white/90 hover:text-white' : 'text-glow-navy hover:text-glow-navy/60'}`}>
              Mi Cuenta
            </Link>
          </div>

          {/* MOBILE: solo hamburger */}
          <div className="flex md:hidden items-center ml-auto">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-glow-navy p-1"
              aria-label="Menú"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 md:hidden ${
          menuOpen ? 'visible' : 'invisible'
        }`}
      >
        <div
          className={`absolute inset-0 bg-glow-dark/40 transition-opacity duration-500 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
        />

        <div
          className={`absolute top-0 left-0 h-full w-72 bg-glow-cream flex flex-col pt-20 px-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col gap-8">
            <StarIcon size={16} className="text-glow-navy mb-4" />
            {[
              { href: '/', label: 'Inicio' },
              { href: '/productos', label: 'Market' },
              { href: '/cursos', label: 'Cursos Online' },
              { href: '/carrito', label: `Carrito${itemCount > 0 ? ` (${itemCount})` : ''}` },
              { href: '/login', label: 'Mi Cuenta' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-cormorant text-2xl text-glow-navy tracking-wide hover:opacity-60 transition-opacity"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
