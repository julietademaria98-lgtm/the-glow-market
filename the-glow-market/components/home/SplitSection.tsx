'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function SplitSection() {
  return (
    <section className="w-full flex flex-col md:flex-row" style={{ height: '90vh', minHeight: '500px', maxHeight: '800px' }}>
      {/* Panel izquierdo — MARKET */}
      <Link href="/productos" className="relative flex-1 overflow-hidden group cursor-pointer">
        <Image
          src="/images/MARKET.png"
          alt="Market"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-500" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex items-end justify-center pb-12"
        >
          <span className="font-cormorant text-white font-light tracking-[0.3em] uppercase"
            style={{ fontSize: 'clamp(22px, 3vw, 36px)', borderBottom: '1px solid rgba(255,255,255,0.7)', paddingBottom: '4px' }}>
            Market
          </span>
        </motion.div>
      </Link>

      {/* Panel derecho — CURSOS ONLINE */}
      <Link href="/cursos" className="relative flex-1 overflow-hidden group cursor-pointer">
        <Image
          src="/images/CURSO ONLINE 11.jpg"
          alt="Cursos Online"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-500" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="absolute inset-0 flex items-end justify-center pb-12"
        >
          <span className="font-cormorant text-white font-light tracking-[0.3em] uppercase"
            style={{ fontSize: 'clamp(22px, 3vw, 36px)', borderBottom: '1px solid rgba(255,255,255,0.7)', paddingBottom: '4px' }}>
            Cursos Online
          </span>
        </motion.div>
      </Link>
    </section>
  )
}
