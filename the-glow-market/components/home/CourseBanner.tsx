'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CourseBanner() {
  return (
    <section className="flex flex-col md:flex-row min-h-[500px] md:min-h-[90vh]">

      <div
        className="block md:hidden w-full"
        style={{ height: '40vh', minHeight: '220px' }}
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('/images/curso-banner.jpg')` }}
        />
      </div>

      <div
        className="w-full md:w-[55%] bg-[#E9E2DA] flex items-center justify-center"
        style={{ padding: '40px' }}
      >
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col"
          style={{ maxWidth: '480px' }}
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
              maxWidth: '380px',
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
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="hidden md:block md:w-[45%]"
        style={{
          backgroundImage: `url('/images/curso-banner.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      />

    </section>
  )
}
