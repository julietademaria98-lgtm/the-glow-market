'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function CourseBanner() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#E9E2DA]"
      style={{ minHeight: '500px', height: '90vh', maxHeight: '800px' }}
    >
      {/* Texto — izquierda */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-y-0 left-0 flex flex-col justify-center z-10 w-[50%]"
        style={{ padding: '60px', maxWidth: '480px', margin: '0 auto' }}
      >
        <span
          className="font-montserrat uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: 'rgba(25, 33, 73, 0.6)',
            marginBottom: '20px',
          }}
        >
          Curso Online
        </span>

        <h2
          className="font-cormorant"
          style={{
            fontSize: 'clamp(36px, 4vw, 52px)',
            color: '#192149',
            fontWeight: 400,
            lineHeight: 1.1,
          }}
        >
          Makeup para<br />todos los días
        </h2>

        <div
          style={{
            width: '60px',
            height: '1px',
            backgroundColor: 'rgba(25, 33, 73, 0.3)',
            margin: '28px 0',
          }}
        />

        <p
          className="font-montserrat"
          style={{
            fontSize: '14px',
            fontWeight: 300,
            color: 'rgba(25, 33, 73, 0.8)',
            lineHeight: 1.7,
          }}
        >
          Piel, maquillaje y un look listo para<br />
          cualquier momento del día
        </p>

        <Link href="/cursos" style={{ marginTop: '40px', display: 'inline-block' }}>
          <button
            className="font-montserrat uppercase transition-all duration-300"
            style={{
              fontSize: '12px',
              letterSpacing: '0.25em',
              padding: '16px 40px',
              border: '1.5px solid #192149',
              background: 'transparent',
              color: '#192149',
              borderRadius: '0',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#192149'
              e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#192149'
            }}
          >
            Explorar Cursos
          </button>
        </Link>
      </motion.div>

      {/* Imagen PNG — derecha, apoyada en la base */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 right-0 h-full"
        style={{ width: '50%' }}
      >
        <Image
          src="/images/curso-banner.png"
          alt="Curso de Makeup"
          fill
          className="object-contain object-bottom object-right"
          sizes="50vw"
        />
      </motion.div>

    </section>
  )
}
