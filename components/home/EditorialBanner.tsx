'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import StarIcon from '@/components/ui/StarIcon'
import Button from '@/components/ui/Button'

export default function EditorialBanner() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[500px] md:min-h-[600px]">
      {/* Left: Texto */}
      <div className="bg-glow-cream flex items-center justify-center px-10 md:px-16 py-20 md:py-0">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6 max-w-sm"
        >
          <div className="flex items-center gap-3">
            <StarIcon size={10} className="text-glow-navy" />
            <span className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-navy/60">
              The Glow Market
            </span>
          </div>

          <h2 className="font-cormorant text-5xl md:text-6xl text-glow-navy font-light italic leading-tight">
            Own Your<br />Glow
          </h2>

          <p className="font-montserrat text-xs text-glow-navy/60 leading-relaxed">
            Accesorios y joyería de alta gama diseñados para la mujer que conoce su poder. Cada pieza cuenta una historia.
          </p>

          <div className="flex gap-4 pt-2">
            <Link href="/cursos">
              <Button variant="primary" size="md">
                Descubrir Cursos
              </Button>
            </Link>
            <Link href="/productos">
              <Button variant="outline" size="md">
                Ver Tienda
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right: Imagen editorial */}
      <div className="relative min-h-[400px] md:min-h-0">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src="/editorial-bg.jpg"
            alt="The Glow Market — Editorial"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-glow-navy/20" />
        </motion.div>

        {/* Decorative star */}
        <div className="absolute top-8 right-8 z-10">
          <StarIcon size={40} className="text-white/30" />
        </div>
      </div>
    </section>
  )
}
