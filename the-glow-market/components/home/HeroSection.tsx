'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import StarIcon from '@/components/ui/StarIcon'

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-glow-navy">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/images/hero-01.jpg')` }}
      />
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(25, 33, 73, 0.20)' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6 md:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/images/Recurso 21Logo (1).png"
            alt="The Glow Market"
            width={600}
            height={300}
            className="w-[280px] md:w-[420px] lg:w-[560px] object-contain"
            priority
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-montserrat text-[11px] md:text-xs tracking-[0.5em] uppercase text-white/70"
        >
          Own Your Glow
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-white/40">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <StarIcon size={14} className="text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}
