import type { Metadata } from 'next'
import './globals.css'
import NavbarWrapper, { FooterWrapper } from '@/components/layout/NavbarWrapper'

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
        <NavbarWrapper />
        {children}
        <FooterWrapper />
      </body>
    </html>
  )
}
