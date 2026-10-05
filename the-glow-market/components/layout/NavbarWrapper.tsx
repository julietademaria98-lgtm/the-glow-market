'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from './CartDrawer'

function ocultarChrome(pathname: string) {
  if (pathname.startsWith('/admin')) return true
  if (pathname.startsWith('/mi-curso/curso/')) return true
  if (pathname.match(/^\/mi-curso\/[^/]+$/)) return true
  if (pathname.startsWith('/success')) return true
  return false
}

export default function NavbarWrapper() {
  const pathname = usePathname()
  if (ocultarChrome(pathname)) return null
  return (
    <>
      <Navbar />
      <CartDrawer />
    </>
  )
}

export function FooterWrapper() {
  const pathname = usePathname()
  if (ocultarChrome(pathname)) return null
  return <Footer />
}
