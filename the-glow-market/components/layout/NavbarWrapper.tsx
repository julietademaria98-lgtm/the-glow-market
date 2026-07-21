'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from './CartDrawer'

export default function NavbarWrapper() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  if (pathname.startsWith('/mi-curso/curso/')) return null
  if (pathname.match(/^\/mi-curso\/[^/]+$/)) return null
  return (
    <>
      <Navbar />
      <CartDrawer />
    </>
  )
}

export function FooterWrapper() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  if (pathname.startsWith('/mi-curso/curso/')) return null
  if (pathname.match(/^\/mi-curso\/[^/]+$/)) return null
  return <Footer />
}
