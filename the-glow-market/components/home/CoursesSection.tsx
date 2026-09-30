'use client'

import Link from 'next/link'
import StarIcon from '@/components/ui/StarIcon'
import { formatPrice } from '@/lib/utils'
import type { Curso } from '@/types'

interface CoursesSectionProps {
  cursos: Curso[]
}

export default function CoursesSection({ cursos }: CoursesSectionProps) {
  return (
    <section className="glow-courses-section">
      {/* Header row */}
      <div className="glow-courses-head">
        <div>
          <p className="glow-courses-eyebrow">Formación exclusiva · Sponsored by Clarins</p>
          <h2 className="glow-courses-h2">
            Aprendé a hacer<br />tu propio glow.
          </h2>
        </div>
        <div className="glow-courses-pill">
          <StarIcon size={14} className="glow-courses-pill-star" />
          <span className="glow-courses-pill-text">
            Cursos online.<br /><em>A tu ritmo.</em>
          </span>
        </div>
      </div>

      {/* Course cards */}
      <div className="glow-courses-grid">
        {cursos.map((curso) => (
          <CourseCard key={curso.id} curso={curso} />
        ))}
      </div>

      {/* Footer */}
      <div className="glow-courses-footer">
        <Link href="/login" className="glow-courses-footer-link">
          ¿Ya sos alumna? Ingresá a tu curso ↗
        </Link>
      </div>

      <style>{`
        .glow-courses-section {
          background: #192149;
          color: #E9E2DA;
          padding: 90px 7%;
        }
        .glow-courses-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 32px;
          margin-bottom: 56px;
          flex-wrap: wrap;
        }
        .glow-courses-eyebrow {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(233,226,218,0.45);
          margin-bottom: 14px;
        }
        .glow-courses-h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 5vw, 72px);
          font-weight: 400;
          color: #E9E2DA;
          line-height: 1;
          letter-spacing: -0.04em;
        }
        .glow-courses-pill {
          background: #E1C8CB;
          border-radius: 64px 16px 16px 16px;
          padding: 22px 26px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          flex-shrink: 0;
          max-width: 210px;
        }
        .glow-courses-pill-star {
          color: #192149;
          flex-shrink: 0;
          margin-top: 3px;
        }
        .glow-courses-pill-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 400;
          color: #192149;
          line-height: 1.25;
        }
        .glow-courses-pill-text em { font-style: italic; }
        .glow-courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        .glow-course-card {
          background: white;
          border-radius: 28px;
          overflow: hidden;
          text-decoration: none;
          display: block;
        }
        .glow-course-img-wrap {
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
        }
        .glow-course-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .glow-course-card:hover .glow-course-img-wrap img {
          transform: scale(1.04);
        }
        .glow-course-img-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(25,33,73,0.4) 0%, transparent 55%);
          z-index: 1;
          pointer-events: none;
        }
        .glow-course-info {
          padding: 20px 22px 24px;
        }
        .glow-course-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 2.5vw, 30px);
          font-weight: 400;
          color: #192149;
          line-height: 1.1;
          margin-bottom: 8px;
        }
        .glow-course-desc {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          color: rgba(25,33,73,0.5);
          line-height: 1.6;
          margin-bottom: 18px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .glow-course-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .glow-course-price-main {
          font-family: 'Montserrat', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #192149;
        }
        .glow-course-price-old {
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          color: #aaa;
          text-decoration: line-through;
          margin-left: 6px;
        }
        .glow-course-btn {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          background: #192149;
          color: white;
          padding: 10px 18px;
          border-radius: 9999px;
          text-decoration: none;
          transition: background 0.3s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .glow-course-btn:hover { background: #1A4C81; }
        .glow-courses-footer {
          text-align: center;
          margin-top: 52px;
        }
        .glow-courses-footer-link {
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: rgba(233,226,218,0.55);
          text-decoration: none;
          border-bottom: 1px solid rgba(233,226,218,0.2);
          padding-bottom: 2px;
          transition: color 0.3s, border-color 0.3s;
        }
        .glow-courses-footer-link:hover {
          color: #E9E2DA;
          border-color: rgba(233,226,218,0.55);
        }
        @media (max-width: 720px) {
          .glow-courses-section { padding: 60px 6%; }
          .glow-courses-grid { grid-template-columns: 1fr; }
          .glow-courses-pill { max-width: 100%; }
        }
      `}</style>
    </section>
  )
}

function CourseCard({ curso }: { curso: Curso }) {
  const precio = Number(curso.precio_oferta ?? curso.precio)
  return (
    <div className="glow-course-card">
      {curso.imagen_url && (
        <div className="glow-course-img-wrap">
          <img src={curso.imagen_url} alt={curso.titulo} />
          <div className="glow-course-img-gradient" />
        </div>
      )}
      <div className="glow-course-info">
        <h3 className="glow-course-title">{curso.titulo}</h3>
        {curso.descripcion && (
          <p className="glow-course-desc">{curso.descripcion}</p>
        )}
        <div className="glow-course-bottom">
          <div>
            <span className="glow-course-price-main">{formatPrice(precio)}</span>
            {curso.precio_oferta && (
              <span className="glow-course-price-old">{formatPrice(Number(curso.precio))}</span>
            )}
          </div>
          <Link href={`/cursos/${curso.slug}`} className="glow-course-btn">
            Más info
          </Link>
        </div>
      </div>
    </div>
  )
}
