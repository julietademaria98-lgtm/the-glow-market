import type { Metadata } from 'next'
import Script from 'next/script'
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
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '26737230972616678');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=26737230972616678&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
        <Navbar />
        <CartDrawer />
        {children}
        <Footer />
      </body>
    </html>
  )
}
