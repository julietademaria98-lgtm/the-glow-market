import type { Metadata } from 'next'
import './globals.css'
import NavbarWrapper, { FooterWrapper } from '@/components/layout/NavbarWrapper'

export const metadata: Metadata = {
  title: 'The Glow Market — Accesorios & Cursos Online',
  description:
    'Accesorios y cursos de automaquillaje. Envíos a todo Argentina.',
  keywords: ['joyería', 'accesorios', 'argentina', 'cursos online', 'maquillaje', 'glow'],
  openGraph: {
    title: 'The Glow Market',
    description: 'Accesorios y cursos de automaquillaje.',
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
