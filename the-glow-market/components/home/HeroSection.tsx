'use client'

import Image from 'next/image'
import Link from 'next/link'
import StarIcon from '@/components/ui/StarIcon'

export default function HeroSection() {
  return (
    <section>
      <div className="glow-hero-wrap">
        {/* Left copy */}
        <div className="glow-hero-copy">
          <p className="glow-eyebrow-sm">The Glow Market · Own your glow</p>
          <h1 className="glow-hero-h1">
            Tu mundo.<br /><em>Tu glow.</em>
          </h1>
          <p className="glow-hero-lead">
            Neceseres de diseño y cursos de automaquillaje para acompañarte todos los días.
          </p>
          <div className="glow-hero-btns">
            <Link href="/productos" className="glow-btn-pill-navy">Descubrí el Market</Link>
            <Link href="/cursos" className="glow-btn-pill-outline">Cursos online ↗</Link>
          </div>
          <div className="glow-hero-sig">
            <StarIcon size={15} className="text-glow-navy" />
            <span>Pocos productos. Más vos.</span>
          </div>
        </div>

        {/* Right photo */}
        <div className="glow-hero-photo">
          <Image
            src="/images/hero-01.jpg"
            alt="The Glow Market"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 840px) 100vw, 52vw"
          />
          <div className="glow-hero-seal">
            Own<br /><em>your glow.</em>
          </div>
        </div>
      </div>

      <style>{`
        .glow-hero-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 5%;
          padding: 136px 5% 64px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .glow-eyebrow-sm {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #192149;
        }
        .glow-hero-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(62px, 7.5vw, 108px);
          line-height: 0.96;
          letter-spacing: -0.05em;
          color: #192149;
          margin: 22px 0;
          font-weight: 400;
        }
        .glow-hero-h1 em { font-style: italic; font-weight: 400; }
        .glow-hero-lead {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(15px, 1.5vw, 21px);
          line-height: 1.6;
          max-width: 460px;
          color: rgba(25,33,73,0.75);
        }
        .glow-hero-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 36px;
        }
        .glow-btn-pill-navy {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          background: #192149;
          padding: 15px 32px;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: white;
          text-decoration: none;
          transition: background 0.3s;
        }
        .glow-btn-pill-navy:hover { background: #1A4C81; }
        .glow-btn-pill-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          border: 1.5px solid #192149;
          padding: 15px 32px;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #192149;
          text-decoration: none;
          transition: background 0.3s, color 0.3s;
        }
        .glow-btn-pill-outline:hover { background: #192149; color: white; }
        .glow-hero-sig {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 32px;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          color: rgba(25,33,73,0.45);
          letter-spacing: 0.06em;
        }
        .glow-hero-photo {
          position: relative;
          min-height: 620px;
          border-radius: 180px 180px 18px 18px;
          overflow: hidden;
          align-self: stretch;
        }
        .glow-hero-seal {
          position: absolute;
          right: 22px;
          bottom: 26px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 140px;
          height: 140px;
          border: 1px solid rgba(25,33,73,0.45);
          border-radius: 50%;
          background: #E1C8CB;
          color: #192149;
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          line-height: 1.25;
          font-weight: 400;
          transform: rotate(8deg);
          text-align: center;
          z-index: 2;
          pointer-events: none;
        }
        .glow-hero-seal em { font-style: italic; }
        @media (max-width: 840px) {
          .glow-hero-wrap {
            grid-template-columns: 1fr;
            padding: 110px 6% 48px;
            gap: 40px;
          }
          .glow-hero-photo {
            min-height: 460px;
            border-radius: 130px 130px 18px 18px;
          }
          .glow-hero-seal { width: 110px; height: 110px; font-size: 18px; }
        }
      `}</style>
    </section>
  )
}
