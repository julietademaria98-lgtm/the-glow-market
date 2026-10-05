'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import type { Producto } from '@/types'
import { useCartStore } from '@/store/cartStore'
import StarIcon from '@/components/ui/StarIcon'

interface ProductsSliderProps {
  productos: Producto[]
}

export default function ProductsSlider({ productos }: ProductsSliderProps) {
  return (
    <section className="glow-featured-section">
      <div className="glow-featured-inner">
        {/* Header */}
        <div className="glow-featured-head">
          <div>
            <p className="glow-feat-eyebrow">The Flower Pouch Capsule</p>
            <h2 className="glow-feat-h2">Tu rutina, bien acompañada.</h2>
          </div>
          <StarIcon size={26} className="glow-feat-star text-glow-navy" />
        </div>

        {/* Product grid */}
        <div className="glow-feat-grid">
          {productos.map((producto, i) => (
            <ProductCard key={producto.id} producto={producto} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="glow-feat-cta">
          <Link href="/productos" className="glow-feat-link">
            Ver toda la tienda ↗
          </Link>
        </div>
      </div>

      <style>{`
        .glow-featured-section {
          background: #E9E2DA;
          padding: 90px 0;
        }
        .glow-featured-inner {
          max-width: 1400px;
          padding: 0 6%;
          margin: 0 auto;
        }
        .glow-featured-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 48px;
          gap: 20px;
        }
        .glow-feat-eyebrow {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(25,33,73,0.45);
          margin-bottom: 8px;
        }
        .glow-feat-h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 4.5vw, 62px);
          font-weight: 400;
          color: #192149;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .glow-feat-star {
          flex-shrink: 0;
          margin-bottom: 8px;
        }
        .glow-feat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }
        .glow-prod-card {
          border-radius: 22px;
          border: 1px solid rgba(25,33,73,0.1);
          background: white;
          overflow: hidden;
          cursor: pointer;
          position: relative;
        }
        .glow-prod-img-wrap {
          position: relative;
          aspect-ratio: 1/1;
          overflow: hidden;
        }
        .glow-prod-badge-clarins {
          position: absolute;
          top: 14px;
          right: 14px;
          background: #E1C8CB;
          color: #192149;
          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 5px 10px;
          border-radius: 6px;
          z-index: 1;
        }
        .glow-prod-badge-sale {
          position: absolute;
          top: 14px;
          left: 14px;
          background: #192149;
          color: white;
          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 5px 10px;
          border-radius: 6px;
          z-index: 1;
        }
        .glow-prod-cart-btn {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .glow-prod-card:hover .glow-prod-cart-btn {
          transform: translateY(0);
        }
        .glow-prod-info {
          padding: 14px 16px 18px;
        }
        .glow-prod-name {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: #192149;
          text-transform: uppercase;
          line-height: 1.4;
        }
        .glow-prod-price {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
        }
        .glow-feat-cta {
          text-align: center;
          margin-top: 52px;
        }
        .glow-feat-link {
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: #192149;
          text-decoration: none;
          border-bottom: 1px solid rgba(25,33,73,0.35);
          padding-bottom: 2px;
          transition: border-color 0.3s;
        }
        .glow-feat-link:hover { border-color: #192149; }
        @media (max-width: 860px) {
          .glow-feat-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          .glow-featured-section { padding: 60px 0; }
        }
      `}</style>
    </section>
  )
}

function ProductCard({ producto, index }: { producto: Producto; index: number }) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const mainImage =
    producto.imagenes?.find((img) => img.es_principal)?.url ||
    producto.imagenes?.[0]?.url

  const precioOriginal = Number(producto.precio)
  const precioOferta = producto.precio_oferta ? Number(producto.precio_oferta) : null
  const sinStock = producto.stock === 0

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (sinStock) return
    addItem({
      id: producto.id,
      slug: producto.slug,
      nombre: producto.nombre,
      precio: precioOferta ?? precioOriginal,
      imagen_url: mainImage || '',
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.06 }}
      className="glow-prod-card group"
    >
      <Link href={`/productos/${producto.slug}`} className="block">
        <div className="glow-prod-img-wrap">
          {mainImage && (
            <Image
              src={mainImage}
              alt={producto.nombre}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width: 860px) 50vw, 25vw"
            />
          )}
          <span className="glow-prod-badge-clarins">Regalos Clarins</span>
          {sinStock && (
            <span className="glow-prod-badge-sale" style={{ background: 'rgba(25,33,73,0.5)' }}>Sin stock</span>
          )}
          {!sinStock && precioOferta && (
            <span className="glow-prod-badge-sale">Oferta</span>
          )}
          {!sinStock && (
            <div className="glow-prod-cart-btn">
              <button
                onClick={handleAdd}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: added ? '#192149' : 'rgba(255,255,255,0.95)',
                  color: added ? 'white' : '#192149',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  transition: 'background 0.2s, color 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {added ? '✓ Agregado' : 'Agregar al carrito'}
              </button>
            </div>
          )}
        </div>
        <div className="glow-prod-info">
          <p className="glow-prod-name">{producto.nombre}</p>
          <div className="glow-prod-price">
            {precioOferta ? (
              <>
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '13px', color: '#192149' }}>
                  {formatPrice(precioOferta)}
                </span>
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '11px', color: '#999', textDecoration: 'line-through' }}>
                  {formatPrice(precioOriginal)}
                </span>
              </>
            ) : (
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '13px', color: '#192149' }}>
                {formatPrice(precioOriginal)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
