'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartCurso from '@/components/courses/AddToCartCurso'
import PreviewVideo from '@/components/courses/PreviewVideo'
import SocialProofPopup from '@/components/courses/SocialProofPopup'
import type { Curso } from '@/types'

const MODULES = [
  { num: '01', eyebrow: 'Prepará', title: 'Piel que se ve sana, no maquillada', desc: 'Vas a lograr una piel luminosa, pareja e hidratada en minutos: la base perfecta para cualquier look.' },
  { num: '02', eyebrow: 'Iluminá', title: 'Un makeup de día que no se nota que te maquillaste', desc: 'Vas a poder armar tu cara todos los días con pocos productos y en la mitad de tiempo que ahora.' },
  { num: '03', eyebrow: 'Refrescá', title: 'Un retoque que te salva a cualquier hora', desc: 'Vas a saber exactamente qué tocar para verte fresca a las 4 de la tarde, sin rehacer todo de cero.' },
  { num: '04', eyebrow: 'Transformá', title: 'Pasar de día a noche sin desarmar nada', desc: 'Vas a transformar tu look de oficina en un look de noche en minutos, sumando solo un par de pasos.' },
]

const BONUSES = [
  { num: '01', label: 'BONUS', title: 'Guía de Compra Inteligente', desc: 'Sabés exactamente qué producto usar y para qué, así dejás de gastar en cosas que después no tocás.' },
  { num: '02', label: 'BONUS', title: 'El Método del Diagnóstico de Piel', desc: 'En 6 preguntas descubrís tu tipo de piel exacto y qué priorizar en cada paso, sin ensayo y error.' },
  { num: '03', label: 'BONUS', title: 'Guía del Subtono Perfecto', desc: 'Encontrás tu subtono real y elegís la base perfecta desde el día uno, sin devolver productos que no te quedan.' },
  { num: '04', label: 'BONUS', title: 'Guía SOS del Primer', desc: 'Sabés qué primer usar según cómo esté tu piel ese día, para que el maquillaje aguante sin importar el cansancio.' },
  { num: '05', label: 'BONUS', title: 'El Método del Contorno Perfecto', desc: 'Aplicás el bronzer exactamente donde tu cara lo necesita, con resultado de contorno profesional.' },
  { num: '06', label: 'COMUNIDAD', title: 'La Comunidad Glow', desc: 'Un espacio privado para mostrar tus looks, resolver dudas al instante y compartir con otras alumnas que están en el mismo camino que vos.' },
]

const BENEFITS = [
  { icon: '✦', text: '4 módulos en video, accesibles desde web y celular.' },
  { icon: '∞', text: 'Acceso de por vida + todas las actualizaciones futuras.' },
  { icon: '✧', text: 'Links directos a cada producto Clarins con regalos exclusivos por compra.' },
  { icon: '↺', text: 'Acceso ilimitado para verlo cuantas veces necesites.' },
]

const FAQ = [
  { q: '¿Cuánto dura el curso?', a: 'Los 4 módulos suman alrededor de 25 minutos de video. Está pensado para que lo puedas hacer en una mañana o repartido en varios días.' },
  { q: '¿Cuándo lo puedo ver?', a: 'Apenas confirmás tu compra, te llega un mail con tu acceso. Podés empezar al minuto, desde la compu o el celular.' },
  { q: '¿Necesito crear una cuenta antes de comprar?', a: 'No. Comprás primero y creás tu cuenta gratis después, con el mismo email que usaste en la compra. En cuanto inicies sesión, el curso se activa solo.' },
  { q: '¿Necesito comprar todos los productos Clarins?', a: 'No. El curso te sirve aunque uses productos que ya tenés. Recomendamos Clarins porque son los que funcionan con este método, y las alumnas tienen un beneficio exclusivo.' },
  { q: '¿Tengo acceso para siempre?', a: 'Sí. Una vez que comprás el curso, lo tenés disponible para siempre, con todas las actualizaciones que vayamos sumando.' },
]

export default function CourseLandingClient({ curso }: { curso: Curso }) {
  const [isNight, setIsNight] = useState(false)

  const imgUrl = 'https://daevvoumyxwgwqfbafvn.supabase.co/storage/v1/object/public/product-images/nina-glow-fondo-claro.png'
  const accentBlue = '#1A4C81'
  const pink = '#E1C8CB'

  return (
    <main className={`course-landing${isNight ? ' night' : ''}`}>
      <SocialProofPopup cursoNombre={curso.titulo} />

      {/* Announcement */}
      <div className="course-announcement">
        <div className="course-announcement-track">
          {'✦ 3 CUOTAS SIN INTERÉS   ✦ 3 CUOTAS SIN INTERÉS   ✦ 3 CUOTAS SIN INTERÉS   ✦ 3 CUOTAS SIN INTERÉS   ✦ 3 CUOTAS SIN INTERÉS   ✦ 3 CUOTAS SIN INTERÉS   ✦ 3 CUOTAS SIN INTERÉS   ✦ 3 CUOTAS SIN INTERÉS   ✦ 3 CUOTAS SIN INTERÉS   ✦ 3 CUOTAS SIN INTERÉS   '}
        </div>
      </div>

      {/* Hero */}
      <div className="course-hero">
        <div className="course-hero-copy">
          <p className="course-eyebrow">Por Nina Amateis · Sponsored by Clarins</p>
          <h1 className="course-h1">
            Day to<br />
            <em className="course-h1-em">night glow.</em>
          </h1>
          <p className="course-lead">
            Aprendé a maquillarte de manera profesional{' '}
            <strong className="course-lead-strong">en menos de 30 minutos.</strong>
          </p>
          <p className="course-sub">
            Pocos productos. Piel divina. Maquillaje de día a noche en pocos pasos.
          </p>
          <div style={{ margin: '20px 0' }}>
            <a href="#inscripcion" className="course-cta">
              Quiero hacer el curso
            </a>
          </div>
          <p className="course-foot">100% online &nbsp;/&nbsp; A tu ritmo &nbsp;/&nbsp; Para siempre</p>
        </div>

        <div className="course-hero-visual">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt="Nina Amateis con los productos del curso Day to Night Glow"
              fill
              className="course-hero-img"
              style={{ objectPosition: 'center 30%', filter: isNight ? 'brightness(0.72) saturate(0.8)' : undefined, transition: 'filter 0.7s' }}
              priority
              sizes="(max-width: 600px) 88vw, 50vw"
            />
          ) : (
            <div className="course-hero-placeholder">
              <p>Aprendé a brillar<br />todos los días.</p>
            </div>
          )}
          <div className="course-hero-gradient" />

          {/* Day / Night toggle */}
          <div className="course-mode">
            {(['day', 'night'] as const).map((m) => (
              <button
                key={m}
                className={`course-mode-btn${(m === 'night') === isNight ? ' active' : ''}`}
                onClick={() => setIsNight(m === 'night')}
              >
                {m === 'day' ? '☀ Day' : '☾ Night'}
              </button>
            ))}
          </div>

          {/* Seal */}
          <div className="course-seal">
            TU RUTINA EN
            <b className="course-seal-b">&lt; 30</b>
            MINUTOS
          </div>

          {/* Caption */}
          <div className="course-caption">
            <div>
              <small className="course-caption-small">MENOS PASOS. MÁS VOS.</small>
              <br />
              <strong className="course-caption-title">
                {isNight ? 'Lista para que siga la noche.' : 'Tu glow de todos los días.'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="course-ticker">
        <span className="course-ticker-track">
          {'ACCESO DE POR VIDA  ✦  5 RECURSOS BONUS  ✦  COMUNIDAD EXCLUSIVA  ✦  REGALOS POR COMPRA CLARINS  ✦  ACCESO DE POR VIDA  ✦  5 RECURSOS BONUS  ✦  COMUNIDAD EXCLUSIVA  ✦  REGALOS POR COMPRA CLARINS  ✦  '}
        </span>
      </div>

      {/* Intro quote */}
      <section className="course-section course-intro">
        <p className="course-eyebrow">Un método simple. Un cambio real.</p>
        <blockquote className="course-quote">
          "Este curso lo armé para vos, mujeres reales que quieren salir prolijas y se cansaron de probar productos que no usan."
        </blockquote>
        <p className="course-author">NINA AMATEIS</p>
        <p className="course-method">
          Te enseño el método que uso todos los días para tener piel divina y un maquillaje que no se va.
        </p>
      </section>

      {/* Para vos */}
      <section className="course-section course-for-you">
        <div className="course-for-you-left">
          <p style={{ margin: '0 0 12px', fontSize: '17px' }}>Si te sentís identificada…</p>
          <h2 className="course-h2">
            Este curso<br />es <em>para vos.</em>
          </h2>
        </div>
        <ul className="course-checks">
          {[
            <span key="a">Comprás productos de maquillaje y <strong>la mitad no los usás.</strong></span>,
            <span key="b"><strong>Te cuesta hacerte la cara en menos de 30 minutos</strong> a la mañana.</span>,
            <span key="c">Querés llevar tu look del día a la noche <strong>sin desarmar todo.</strong></span>,
            <span key="d">Tenés ganas de aprender <strong>un método simple que funcione siempre.</strong></span>,
          ].map((item, i) => (
            <li key={i} className="course-check-item">
              <span className="course-check-star">✦</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Módulos */}
      <section className="course-section" id="programa">
        <div className="course-section-head">
          <div>
            <p className="course-eyebrow">El recorrido</p>
            <h2 className="course-h2">
              De piel fresca<br />a <em>noche lista.</em>
            </h2>
          </div>
          <p className="course-modules-intro">
            <strong className="course-highlight">4 módulos</strong>, pensados para un resultado concreto.
          </p>
        </div>
        <div className="course-modules">
          {MODULES.map((mod, i) => (
            <article key={mod.num} className={`course-module course-module-${i + 1}`}>
              <span className="course-module-num">{mod.num}</span>
              <p className="course-eyebrow">{mod.eyebrow}</p>
              <h3 className="course-module-title">{mod.title}</h3>
              <p className="course-module-desc">{mod.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Bonus */}
      <section className="course-section course-bonus">
        <div className="course-section-head">
          <div>
            <p className="course-eyebrow" style={{ color: pink }}>El glow no termina en el video</p>
            <h2 className="course-h2">
              Comprando hoy,<br /><em>además te llevás.</em>
            </h2>
          </div>
          <div className="course-bonus-highlight">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" />
            </svg>
            <p>
              <strong style={{ fontSize: '24px', fontWeight: 600 }}>5 recursos bonus</strong><br />
              y una comunidad para acompañarte en cada paso.
            </p>
          </div>
        </div>

        <div className="course-bonus-grid">
          {BONUSES.map((b) => (
            <div key={b.num} className="course-bonus-card" tabIndex={0}>
              <small className="course-bonus-small">{b.label} / {b.num}</small>
              <h3 className="course-bonus-title">{b.title}</h3>
              <span className="course-bonus-action" aria-hidden="true">Qué te llevás <span>✦</span></span>
              <p className="course-bonus-desc">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Benefits band */}
        <div className="course-benefits-band">
          <div className="course-benefits-track">
            {[0, 1].map((g) => (
              <div key={g} className="course-benefits-group" aria-hidden={g === 1}>
                {BENEFITS.map((b, i) => (
                  <span key={i} className="course-benefit-item">
                    <span style={{ fontSize: '25px' }}>{b.icon}</span>
                    {b.text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clarins */}
      <section className="course-section course-clarins">
        <p className="course-eyebrow">Con el respaldo de</p>
        <div className="course-clarins-logo">CLARINS</div>
        <p className="course-clarins-text">
          Este curso está armado con productos y el respaldo de <strong>Clarins</strong>, marca líder mundial en cuidado de la piel. Aprendés un método pensado para funcionar con productos de calidad probada.
        </p>
      </section>

      {/* Enroll */}
      <section className="course-section course-enroll" id="inscripcion">
        <div>
          <span className="course-enroll-tag">CUPOS LIMITADOS</span>
          <h2 className="course-h2" style={{ marginTop: '20px' }}>
            Tu momento<br />de <em>brillar.</em>
          </h2>
          <p style={{ lineHeight: 1.7, fontSize: '17px', maxWidth: '420px' }}>
            Abrimos 30 cupos a precio de lanzamiento. <strong>Cuando se completen, el curso pasa a su precio regular.</strong>
          </p>
        </div>
        <div className="course-pricecard">
          <p className="course-eyebrow">Precio de lanzamiento</p>
          <h3 className="course-pricecard-title">Accedé hoy</h3>
          <AddToCartCurso curso={curso} />
        </div>
      </section>

      {/* FAQ */}
      <section className="course-section course-faq">
        <div>
          <p className="course-eyebrow">Todo claro, antes de empezar</p>
          <h2 className="course-h2">
            Lo que más<br /><em>nos preguntan.</em>
          </h2>
        </div>
        <div>
          {FAQ.map((item, i) => (
            <details key={i} className="course-details">
              <summary className="course-summary">{item.q}</summary>
              <p className="course-details-body">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="course-footer">
        <Link href="/" className="course-footer-logo">
          THE <span className="course-footer-logo-glow">GLOW</span> MARKET
        </Link>
        <div className="course-footer-tagline">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" />
          </svg>
          <span>Own Your Glow</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" />
          </svg>
        </div>
        <nav className="course-footer-nav">
          <Link href="/productos">Tienda</Link>
          <Link href="/cursos">Cursos</Link>
          <Link href="/mi-curso">Mi Cuenta</Link>
          <a href="mailto:hola@theglowmarket.com">Contacto</a>
        </nav>
        <div className="course-footer-rule" />
        <p className="course-footer-copy">© 2026 The Glow Market. Todos los derechos reservados.</p>
      </footer>

      <style>{`
        .course-landing {
          --bg: #E9E2DA;
          --ink: #192149;
          --accent: #1A4C81;
          --pink: #E1C8CB;
          background: var(--bg);
          color: var(--ink);
          font-family: 'Montserrat', Arial, sans-serif;
          transition: background .6s, color .6s;
        }
        .course-landing.night {
          --bg: #192149;
          --ink: #E9E2DA;
        }
        .night .course-for-you { background: #1A4C81; }
        .night .course-hero-img { filter: brightness(.72) saturate(.8); }
        .night .course-clarins-logo { color: #E1C8CB; }
        .night .course-lead-strong { background: linear-gradient(transparent 72%, #20699F 72%); }
        .night .course-highlight { background: linear-gradient(transparent 72%, #20699F 72%); }
        .night .course-cta { background: #E1C8CB; color: #192149; }
        .night .course-module-1 { border-color: rgba(233,226,218,.2); }

        /* Announcement */
        .course-announcement {
          background: var(--accent);
          color: #E9E2DA;
          height: 32px;
          overflow: hidden;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 2.4px;
          line-height: 32px;
          white-space: nowrap;
        }
        .course-announcement-track {
          display: inline-block;
          animation: marquee 65s linear infinite;
        }

        /* Hero */
        .course-hero {
          display: grid;
          grid-template-columns: 1.02fr 1fr;
          min-height: calc(100vh - 32px);
          align-items: stretch;
        }
        .course-hero-copy {
          padding: 65px 7% 50px 10%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .course-eyebrow {
          font-size: 12px;
          letter-spacing: 2.2px;
          text-transform: uppercase;
          font-weight: 600;
          margin: 0 0 16px;
        }
        .course-h1 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(72px, 7.8vw, 116px);
          line-height: .93;
          font-weight: 500;
          letter-spacing: -5px;
          margin: 0 0 28px;
        }
        .course-h1-em {
          display: block;
          font-weight: 500;
        }
        .course-lead {
          font-size: clamp(19px, 2.1vw, 24px);
          line-height: 1.35;
          max-width: 440px;
          margin: 0 0 14px;
        }
        .course-lead-strong {
          font-weight: 600;
          background: linear-gradient(transparent 72%, #E1C8CB 72%);
        }
        .course-sub {
          font-size: 16px;
          line-height: 1.7;
          max-width: 420px;
          margin: 0 0 16px;
        }
        .course-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--accent);
          color: white;
          border: 0;
          border-radius: 99px;
          padding: 18px 30px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          transition: transform .2s, background .2s;
          font-family: 'Montserrat', sans-serif;
        }
        .course-cta:hover { transform: translateY(-3px); }
        .course-foot { font-size: 13px; opacity: .6; margin: 0; }

        .course-hero-visual {
          position: relative;
          margin: 56px 28px 28px 0;
          background: var(--accent);
          border-radius: 999px 999px 12px 12px;
          overflow: hidden;
          color: white;
          align-self: stretch;
          min-height: 560px;
        }
        .course-hero-img {
          object-fit: cover;
          object-position: center 55%;
          transition: filter .7s, transform 1s;
        }
        .course-hero-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(transparent 68%, rgba(25,33,73,.72));
          pointer-events: none;
        }
        .course-hero-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--pink);
          color: #192149;
          padding: 80px 25px;
          text-align: center;
        }
        .course-hero-placeholder p {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(34px, 4vw, 56px);
          line-height: 1.15;
          letter-spacing: -1.5px;
          margin: 0;
        }

        /* Mode toggle */
        .course-mode {
          position: absolute;
          left: 8%;
          top: 28px;
          z-index: 2;
          display: flex;
          background: rgba(233,226,218,.87);
          padding: 5px;
          border-radius: 99px;
          gap: 3px;
        }
        .course-mode-btn {
          border: 0;
          background: transparent;
          color: #192149;
          padding: 11px 25px;
          border-radius: 99px;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          transition: background .2s, color .2s;
        }
        .course-mode-btn.active {
          background: #192149;
          color: white;
        }

        /* Seal */
        .course-seal {
          position: absolute;
          right: 16px;
          top: 40%;
          z-index: 2;
          border: 1px solid rgba(255,255,255,.55);
          width: 110px;
          height: 110px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          transform: rotate(12deg);
          font-size: 11px;
          letter-spacing: 1px;
          background: rgba(233,226,218,.8);
          color: #192149;
          line-height: 1.4;
        }
        .course-seal-b {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 500;
          display: block;
        }

        /* Caption */
        .course-caption {
          position: absolute;
          bottom: 35px;
          left: 35px;
          right: 35px;
          z-index: 2;
          color: #E9E2DA;
        }
        .course-caption-small {
          font-size: 11px;
          letter-spacing: 1px;
        }
        .course-caption-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: 34px;
          display: block;
        }

        /* Ticker */
        .course-ticker {
          overflow: hidden;
          background: var(--pink);
          padding: 19px 0;
          white-space: nowrap;
          color: #192149;
        }
        .course-ticker-track {
          display: inline-block;
          animation: ticker-scroll 32s linear infinite;
          font-size: 14px;
          letter-spacing: 2px;
        }

        /* Sections */
        .course-section { padding: 95px 7%; }

        .course-intro {
          text-align: center;
          max-width: 1100px;
          margin-left: auto;
          margin-right: auto;
        }
        .course-quote {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(28px, 3.5vw, 49px);
          line-height: 1.35;
          margin: 25px auto;
          font-style: italic;
          max-width: 1040px;
        }
        .course-author {
          font-size: 13px;
          letter-spacing: 2px;
          font-weight: 600;
        }
        .course-method {
          font-size: clamp(22px, 2.2vw, 30px);
          font-weight: 500;
          line-height: 1.5;
          max-width: 790px;
          margin: 35px auto 0;
        }

        /* H2 */
        .course-h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 4.3vw, 64px);
          font-weight: 500;
          line-height: 1.08;
          letter-spacing: -1.8px;
          margin: 18px 0;
        }
        .course-h2 em { font-weight: 500; }

        /* Section head */
        .course-section-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 40px;
          margin-bottom: 38px;
        }

        /* Para vos */
        .course-for-you {
          background: var(--pink);
          color: #192149;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
        }
        .course-for-you-left {
          align-self: center;
          text-align: center;
        }
        .course-checks {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 17px;
        }
        .course-check-item {
          border-bottom: 1px solid rgba(25,33,73,.18);
          padding: 23px 0;
          display: flex;
          gap: 20px;
          line-height: 1.6;
        }
        .course-check-star { font-size: 20px; flex-shrink: 0; }

        /* Modules */
        .course-modules-intro {
          font-size: clamp(22px, 2vw, 28px);
          line-height: 1.45;
          max-width: 365px;
          font-weight: 500;
        }
        .course-highlight {
          font-weight: 600;
          background: linear-gradient(transparent 72%, #E1C8CB 72%);
        }
        .course-modules {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .course-module {
          padding: 28px 24px 32px;
          min-height: 320px;
          transition: transform .3s;
          cursor: default;
        }
        .course-module:hover { transform: translateY(-8px); }
        .course-module-1 { background: #d8cec3; color: #192149; border: 1px solid rgba(25,33,73,.07); }
        .course-module-2 { background: #E1C8CB; color: #192149; }
        .course-module-3 { background: #20699F; color: #E9E2DA; }
        .course-module-4 { background: #192149; color: #E9E2DA; }
        .course-module-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 54px;
          display: block;
          margin-bottom: 40px;
          font-style: italic;
        }
        .course-module-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 25px;
          line-height: 1.2;
          font-weight: 500;
          margin: 0 0 12px;
        }
        .course-module-desc { font-size: 14px; line-height: 1.7; margin: 0; }

        /* Bonus */
        .course-bonus { background: #192149; color: #E9E2DA; padding-bottom: 0; }
        .course-bonus .course-section-head { align-items: center; }
        .course-bonus .course-h2 { color: #E9E2DA; }
        .course-bonus-highlight {
          display: flex;
          align-items: center;
          gap: 22px;
          max-width: 400px;
          padding: 25px;
          border: 1px solid #E1C8CB;
          border-radius: 80px 12px 12px 12px;
          background: #E1C8CB;
          color: #192149;
        }
        .course-bonus-highlight p { font-size: 17px; margin: 0; line-height: 1.5; }

        .course-bonus-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          align-items: stretch;
        }
        .course-bonus-card {
          border: 1px solid rgba(233,226,218,.33);
          border-radius: 4px;
          padding: 26px;
          background: rgba(26,76,129,.22);
          color: #E9E2DA;
          transition: background .25s, border-color .25s, color .25s, transform .25s;
          cursor: default;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .course-bonus-card:hover,
        .course-bonus-card:focus {
          background: #E9E2DA;
          color: #192149;
          border-color: #E9E2DA;
          transform: translateY(-3px);
        }
        .course-bonus-card:hover .course-bonus-small,
        .course-bonus-card:focus .course-bonus-small { color: #1A4C81; }
        .course-bonus-card:hover .course-bonus-desc,
        .course-bonus-card:focus .course-bonus-desc {
          visibility: visible;
          opacity: 1;
          transform: none;
        }
        .course-bonus-card:hover .course-bonus-action,
        .course-bonus-card:focus .course-bonus-action { visibility: hidden; }
        .course-bonus-small {
          font-size: 12px;
          letter-spacing: 1.5px;
          color: #E1C8CB;
          margin-bottom: 12px;
        }
        .course-bonus-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 27px;
          line-height: 1.18;
          font-weight: 500;
          margin: 0 0 auto;
          min-height: 3.54em;
        }
        .course-bonus-action {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          font-size: 13px;
          margin: 18px 0 0;
          opacity: .85;
        }
        .course-bonus-desc {
          font-size: 16px;
          padding: 20px 0 0;
          margin: 0;
          border-top: 1px solid rgba(25,33,73,.18);
          line-height: 1.75;
          visibility: hidden;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity .22s, transform .22s;
        }

        /* Benefits band */
        .course-benefits-band {
          margin: 55px -7% 0;
          background: #E1C8CB;
          color: #192149;
          overflow: hidden;
          padding: 25px 0;
        }
        .course-benefits-track {
          display: flex;
          width: max-content;
          animation: benefits-scroll 60s linear infinite;
        }
        .course-benefits-group {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .course-benefit-item {
          display: flex;
          align-items: center;
          gap: 22px;
          white-space: nowrap;
          font-size: 16px;
          line-height: 1.5;
          padding: 0 30px;
        }

        /* Clarins */
        .course-clarins {
          text-align: center;
          border-bottom: 1px solid rgba(25,33,73,.18);
          padding: 60px 10%;
        }
        .night .course-clarins { border-bottom-color: rgba(233,226,218,.18); }
        .course-clarins-logo {
          font-family: Georgia, serif;
          font-size: 48px;
          letter-spacing: 4px;
          color: #b0182c;
          margin: 18px;
        }
        .course-clarins-text {
          max-width: 620px;
          margin: auto;
          line-height: 1.7;
        }

        /* Enroll */
        .course-enroll {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 90px;
          align-items: center;
          background: #E1C8CB;
          color: #192149;
        }
        .course-enroll-tag {
          border: 1px solid #192149;
          border-radius: 20px;
          padding: 8px 15px;
          font-size: 12px;
          display: inline-block;
        }
        .course-pricecard {
          background: #E9E2DA;
          color: #192149;
          padding: 45px;
          text-align: center;
          border-radius: 130px 130px 12px 12px;
          box-shadow: 8px 12px 0 rgba(25,33,73,.07);
        }
        .course-pricecard-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          font-weight: 500;
          margin: 20px;
        }

        /* FAQ */
        .course-faq {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 90px;
        }
        .course-details {
          border-bottom: 1px solid rgba(25,33,73,.12);
          padding: 23px 0;
        }
        .night .course-details { border-bottom-color: rgba(233,226,218,.12); }
        .course-summary {
          list-style: none;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          font-size: 16px;
          font-weight: 500;
        }
        .course-summary::-webkit-details-marker { display: none; }
        .course-summary::after { content: '+'; font-size: 22px; flex-shrink: 0; }
        details[open] .course-summary::after { content: '−'; }
        .course-details-body {
          font-size: 15px;
          line-height: 1.8;
          padding-right: 25px;
          margin-top: 12px;
        }

        /* Footer */
        .course-footer {
          background: #192149;
          color: #E9E2DA;
          padding: 64px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          text-align: center;
        }
        .course-footer-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          font-weight: 300;
          letter-spacing: 2.4px;
          line-height: 1;
          color: #E9E2DA;
          text-decoration: none;
          white-space: nowrap;
        }
        .course-footer-logo-glow { font-size: 48px; font-weight: 400; }
        .course-footer-tagline {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #E1C8CB;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 3px;
        }
        .course-footer-nav {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 40px;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,.7);
        }
        .course-footer-nav a { color: inherit; text-decoration: none; }
        .course-footer-nav a:hover { color: #E1C8CB; }
        .course-footer-rule {
          width: 100%;
          max-width: 320px;
          height: 1px;
          background: rgba(255,255,255,.1);
        }
        .course-footer-copy {
          font-size: 10px;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: rgba(255,255,255,.5);
          margin: 0;
          line-height: 1.8;
        }

        /* Animations */
        @keyframes marquee { to { transform: translateX(-50%); } }
        @keyframes ticker-scroll { to { transform: translateX(-50%); } }
        @keyframes benefits-scroll { to { transform: translateX(-50%); } }

        /* Responsive: tablet */
        @media (max-width: 900px) {
          .course-hero { grid-template-columns: 1fr 1fr; min-height: 600px; }
          .course-hero-copy { padding: 45px 8%; }
          .course-h1 { font-size: 80px; }
          .course-hero-visual { min-height: 570px; margin-right: 15px; }
          .course-modules { grid-template-columns: 1fr 1fr; }
          .course-for-you, .course-enroll, .course-faq { gap: 35px; }
          .course-bonus-grid { grid-template-columns: 1fr 1fr; }
          .course-bonus .course-section-head { display: block; }
          .course-bonus-highlight { margin: 28px 0 0; }
          .course-pricecard { padding: 30px; }
        }

        /* Responsive: mobile */
        @media (max-width: 600px) {
          .course-hero { display: flex; flex-direction: column; }
          .course-hero-copy { padding: 38px 7% 28px; }
          .course-h1 { font-size: 88px; letter-spacing: -4px; }
          .course-hero-visual { min-height: 490px; margin: 0 6% 30px; }
          .course-mode { left: 24px; top: 44px; }
          .course-mode-btn { padding: 10px 14px; }
          .course-seal { width: 90px; height: 90px; font-size: 10px; }
          .course-seal-b { font-size: 27px; }
          .course-caption { bottom: 24px; left: 24px; right: 24px; }
          .course-caption-title { font-size: 26px; }
          .course-section { padding: 65px 7%; }
          .course-section-head { display: block; }
          .course-for-you, .course-enroll, .course-faq { grid-template-columns: 1fr; gap: 20px; }
          .course-modules { grid-template-columns: 1fr 1fr; gap: 10px; }
          .course-module { padding: 20px 17px; min-height: 350px; }
          .course-module-num { font-size: 44px; margin-bottom: 25px; }
          .course-bonus-grid { grid-template-columns: 1fr; }
          .course-bonus-card { background: #E9E2DA; color: #192149; }
          .course-bonus-card .course-bonus-small { color: #1A4C81; }
          .course-bonus-card .course-bonus-desc { visibility: visible; opacity: 1; transform: none; }
          .course-bonus-card .course-bonus-action { display: none; }
          .course-pricecard { padding: 35px 25px; }
          .course-footer-nav { gap: 24px; }
          .course-footer-logo { font-size: 24px; }
          .course-footer-logo-glow { font-size: 36px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .course-announcement-track,
          .course-ticker-track,
          .course-benefits-track { animation: none; }
        }
      `}</style>
    </main>
  )
}
