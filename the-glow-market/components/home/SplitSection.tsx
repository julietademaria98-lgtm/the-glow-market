'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function SplitSection() {
  return (
    <section
      className="w-full flex flex-col md:flex-row gap-4 p-6 md:p-10"
      style={{ backgroundColor: '#E9E2DA' }}
    >
      {/* Panel izquierdo — MARKET */}
      <Link
        href="/productos"
        className="relative flex-1 overflow-hidden group cursor-pointer"
        style={{ borderRadius: '12px', minHeight: '500px' }}
      >
        <Image
          src="/images/MARKET.png"
          alt="Market"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ opacity: 0.75 }}
          sizes="50vw"
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '12px' }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span
            className="font-cormorant text-white font-light tracking-[0.3em] uppercase"
            style={{
              fontSize: 'clamp(24px, 3vw, 38px)',
              borderBottom: '1px solid rgba(255,255,255,0.8)',
              paddingBottom: '6px',
            }}
          >
            Market
          </span>
        </motion.div>
      </Link>

      {/* Panel derecho — CURSOS ONLINE */}
      <Link
        href="/cursos"
        className="relative flex-1 overflow-hidden group cursor-pointer"
        style={{ borderRadius: '12px', minHeight: '500px' }}
      >
        <Image
          src="/images/CURSO ONLINE 11.jpg"
          alt="Cursos Online"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ opacity: 0.75 }}
          sizes="50vw"
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '12px' }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span
            className="font-cormorant text-white font-light tracking-[0.3em] uppercase"
            style={{
              fontSize: 'clamp(24px, 3vw, 38px)',
              borderBottom: '1px solid rgba(255,255,255,0.8)',
              paddingBottom: '6px',
            }}
          >
            Cursos Online
          </span>
        </motion.div>
      </Link>
    </section>
  )
}
