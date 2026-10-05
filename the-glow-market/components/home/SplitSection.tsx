'use client'

import Image from 'next/image'
import Link from 'next/link'
import StarIcon from '@/components/ui/StarIcon'

export default function SplitSection() {
  return (
    <section className="glow-discover-section">
      <div className="glow-discover-inner">
        <div className="glow-discover-head">
          <StarIcon size={18} className="text-glow-navy" />
          <h2 className="glow-discover-title">Un universo, muchas formas de brillar.</h2>
        </div>
        <div className="glow-discover-grid">
          <DiscoverCard
            href="/productos"
            image="/images/market01.PNG"
            eyebrow="Para llevar con vos"
            title="Market"
          />
          <DiscoverCard
            href="/cursos"
            image="/images/CURSO ONLINE 11.jpg"
            eyebrow="Para aprender a tu ritmo"
            title="Cursos online"
          />
        </div>
      </div>

      <style>{`
        .glow-discover-section {
          background: #E1C8CB;
          padding: 80px 7%;
        }
        .glow-discover-inner {
          max-width: 1400px;
          margin: 0 auto;
        }
        .glow-discover-head {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 48px;
        }
        .glow-discover-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(30px, 4vw, 56px);
          font-weight: 400;
          color: #192149;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .glow-discover-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }
        .glow-discover-card {
          cursor: pointer;
          text-decoration: none;
          display: block;
        }
        .glow-discover-card-photo {
          position: relative;
          height: 360px;
          border-radius: 90px 90px 18px 18px;
          overflow: hidden;
          background: #E9E2DA;
        }
        .glow-discover-card:hover .glow-discover-card-photo-img {
          transform: scale(1.04);
        }
        .glow-discover-card-photo-img {
          transition: transform 0.7s cubic-bezier(0.22,1,0.36,1) !important;
        }
        .glow-discover-caption {
          padding: 20px 8px 8px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
        }
        .glow-discover-eyebrow {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(25,33,73,0.5);
          display: block;
          margin-bottom: 4px;
        }
        .glow-discover-h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(26px, 2.5vw, 40px);
          font-weight: 400;
          color: #192149;
          letter-spacing: -0.01em;
          line-height: 1;
        }
        .glow-discover-arrow {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid rgba(25,33,73,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #192149;
          flex-shrink: 0;
          transition: background 0.3s, border-color 0.3s, color 0.3s;
        }
        .glow-discover-card:hover .glow-discover-arrow {
          background: #192149;
          color: white;
          border-color: #192149;
        }
        @media (max-width: 680px) {
          .glow-discover-section { padding: 60px 6%; }
          .glow-discover-grid { grid-template-columns: 1fr; gap: 20px; }
          .glow-discover-card-photo { height: 260px; border-radius: 70px 70px 14px 14px; }
        }
      `}</style>
    </section>
  )
}

function DiscoverCard({ href, image, eyebrow, title }: {
  href: string; image: string; eyebrow: string; title: string
}) {
  return (
    <Link href={href} className="glow-discover-card">
      <div className="glow-discover-card-photo">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover glow-discover-card-photo-img"
          sizes="(max-width: 680px) 90vw, 45vw"
        />
      </div>
      <div className="glow-discover-caption">
        <div>
          <span className="glow-discover-eyebrow">{eyebrow}</span>
          <h3 className="glow-discover-h3">{title}</h3>
        </div>
        <div className="glow-discover-arrow">↗</div>
      </div>
    </Link>
  )
}
