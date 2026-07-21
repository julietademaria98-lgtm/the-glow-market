import type { Metadata } from 'next'
import './globals.css'
import NavbarWrapper, { FooterWrapper } from '@/components/layout/NavbarWrapper'
import Script from 'next/script'

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
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="es">
      <body className="bg-glow-cream antialiased">
        <NavbarWrapper />
        {children}
        <FooterWrapper />
      </body>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}
    </html>
  )
}
