'use client'

import { motion } from 'framer-motion'
import StarIcon from '@/components/ui/StarIcon'
import Button from '@/components/ui/Button'

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-glow-navy">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/hero-bg.jpg')`,
        }}
      />
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(25, 33, 73, 0.45)' }} />

      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6 md:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <StarIcon size={10} className="text-glow-blush" />
          <span className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-glow-blush">
            Nueva Colección
          </span>
          <StarIcon size={10} className="text-glow-blush" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-cormorant text-white font-light leading-none select-none">
            <span className="block text-4xl md:text-6xl lg:text-7xl tracking-[0.3em]">THE</span>
            <span className="block text-6xl md:text-9xl lg:text-[140px] tracking-[0.15em] font-normal -mt-2 md:-mt-4">
              GLOW
            </span>
            <span className="block text-4xl md:text-6xl lg:text-7xl tracking-[0.3em]">MARKET</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-montserrat text-[11px] md:text-xs tracking-[0.5em] uppercase text-white/70"
        >
          Own Your Glow
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-4"
        >
          <Button
            variant="outline-white"
            size="lg"
            onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explorar Colección
          </Button>
        </motion.div>
      </div>

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
