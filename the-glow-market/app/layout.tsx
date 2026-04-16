import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'

export const metadata: Metadata = {
  title: 'The Glow Market — Joyería & Accesorios de Alta Gama',
  description:
    'Accesorios y joyería de alta gama diseñados para la mujer que conoce su poder. Envíos a todo Argentina.',
  keywords: ['joyería', 'accesorios', 'argentina', 'lujo', 'glow', 'cursos online'],
  openGraph: {
    title: 'The Glow Market',
    description: 'Own Your Glow — Joyería & Accesorios de Alta Gama',
    siteName: 'The Glow Market',
    locale: 'es_AR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-glow-cream antialiased">
        <Navbar />
        <CartDrawer />
        {children}
        <Footer />
      </body>
    </html>
  )
}
