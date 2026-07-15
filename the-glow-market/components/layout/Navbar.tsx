'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { Menu, X } from 'lucide-react'
import StarIcon from '@/components/ui/StarIcon'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const itemCount = useCartStore((state) => state.itemCount())

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const navLinkClass = `nav-link transition-colors duration-300 ${!scrolled ? 'text-white/90 hover:text-white' : ''}`

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled ? 'bg-glow-cream shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* LEFT LINKS — desktop */}
          <div className="hidden md:flex gap-8">
            <Link href="/productos" className={navLinkClass}>
              Market
            </Link>
            <Link href="/cursos" className={navLinkClass}>
              Cursos Online
            </Link>
          </div>

          {/* CENTER LOGO */}
          <Link
            href="/"
            className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-500 ${
              scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
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
            <Link href="/carrito" className={`relative ${navLinkClass}`}>
              Carrito
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-glow-navy text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-montserrat">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <Link
                  href="/mi-curso"
                  className={navLinkClass}
                >
                  Mi Curso
                </Link>
                {/* Dropdown */}
                <div className="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white shadow-md min-w-[160px] py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 font-montserrat text-[10px] tracking-[0.15em] uppercase text-glow-navy/60 hover:text-glow-navy hover:bg-glow-cream transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className={navLinkClass}>
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* MOBILE: carrito + hamburger */}
          <div className="flex md:hidden items-center gap-4 ml-auto">
            <Link href="/carrito" className="relative nav-link">
              Carrito
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-glow-navy text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-montserrat">
                  {itemCount}
                </span>
              )}
            </Link>
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
              { href: '/carrito', label: 'Carrito' },
              { href: '/mi-curso', label: 'Mi Curso' },
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
            {user && (
              <button
                onClick={handleLogout}
                className="font-cormorant text-2xl text-glow-navy/40 tracking-wide hover:opacity-60 transition-opacity text-left"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
