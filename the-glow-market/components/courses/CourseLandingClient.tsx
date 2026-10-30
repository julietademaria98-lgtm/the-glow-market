'use client'

import Image from 'next/image'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import AddToCartCurso from '@/components/courses/AddToCartCurso'
import SocialProofPopup from '@/components/courses/SocialProofPopup'
import type { Curso } from '@/types'

const bodyFont = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body', display: 'swap', preload: false })
const titleFont = Playfair_Display({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-title', display: 'swap', preload: false })

const VIDEO_URL = 'https://daevvoumyxwgwqfbafvn.supabase.co/storage/v1/object/public/product-images/antes-despues.MOV'
const NINA_IMG = 'https://daevvoumyxwgwqfbafvn.supabase.co/storage/v1/object/public/product-images/nina-glow-fondo-claro.png'

const STEPS = [
  { num: '01', eyebrow: 'Prepará', title: 'Piel que se ve sana, no maquillada', desc: 'Vas a lograr una piel luminosa, pareja e hidratada en minutos: la base perfecta para cualquier look.' },
  { num: '02', eyebrow: 'Iluminá', title: 'Un makeup de día que no se nota que te maquillaste', desc: 'Vas a poder maquillarte con un look natural todos los días con pocos productos y en la mitad de tiempo que ahora.' },
  { num: '03', eyebrow: 'Refrescá', title: 'Un retoque que te salva a cualquier hora', desc: 'Vas a saber exactamente qué tocar para verte fresca a las 4 de la tarde, sin rehacer todo de cero.' },
  { num: '04', eyebrow: 'Transformá', title: 'Pasar de día a noche sin desarmar nada', desc: 'Vas a transformar tu look de oficina en un look de noche en minutos, sumando solo un par de pasos.' },
]

const BONUSES = [
  { label: 'Bonus 01', title: 'Guía de Compra Inteligente', desc: 'Sabés exactamente qué producto usar y para qué, así dejás de gastar en cosas que después no tocás.' },
  { label: 'Bonus 02', title: 'El Método del Diagnóstico de Piel', desc: 'En 6 preguntas descubrís tu tipo de piel exacto y qué priorizar en cada paso, sin ensayo y error.' },
  { label: 'Bonus 03', title: 'Guía del Subtono Perfecto', desc: 'Encontrás tu subtono real y elegís la base perfecta desde el día uno, sin devolver productos que no te quedan.' },
  { label: 'Bonus 04', title: 'Guía SOS del Primer', desc: 'Sabés qué primer usar según cómo esté tu piel ese día, para que el maquillaje aguante sin importar el cansancio.' },
  { label: 'Bonus 05', title: 'El Método del Contorno Perfecto', desc: 'Aplicás el bronzer exactamente donde tu cara lo necesita, con resultado de contorno profesional.' },
  { label: 'Comunidad', title: 'La Comunidad Glow', desc: 'Un espacio privado para mostrar tus looks, resolver dudas al instante y compartir con otras alumnas que están en el mismo camino que vos.' },
]

const FAQ = [
  { q: '¿Cuánto dura el curso?', a: 'Los 4 módulos suman unos 25 minutos de video. Y una vez que aprendés el método, tu rutina te lleva pocos minutos.' },
  { q: '¿Cuándo lo puedo ver?', a: 'Apenas confirmás tu compra, te llega un mail con tu acceso. Podés empezar al minuto, desde la compu o el celular.' },
  { q: '¿Necesito crear una cuenta antes de comprar?', a: 'No. Comprás primero y creás tu cuenta gratis después, con el mismo email que usaste en la compra. En cuanto inicies sesión, el curso se activa solo.' },
  { q: '¿Necesito comprar todos los productos Clarins?', a: 'No. El curso te sirve aunque uses productos que ya tenés. Recomendamos Clarins porque son los que funcionan con este método, y las alumnas tienen un beneficio exclusivo.' },
  { q: '¿Tengo acceso para siempre?', a: 'Sí. Una vez que comprás el curso, lo tenés disponible para siempre, con todas las actualizaciones que vayamos sumando.' },
  { q: '¿Sirve si nunca me maquillé?', a: 'Sí. El método arranca desde cero, preparando la piel, y está pensado para quien nunca se maquilló.' },
  { q: '¿Me sirve para mi tipo de piel?', a: 'Sí. Con el bonus de Diagnóstico de Piel descubrís tu tipo de piel y qué priorizar en cada paso.' },
  { q: '¿Necesito muchos productos?', a: 'No. El método usa pocos productos y podés empezar con los que ya tenés.' },
  { q: '¿Cómo pago?', a: 'Con Mercado Pago, en un pago o en 3 cuotas sin interés.' },
]

export default function CourseLandingClient({ curso }: { curso: Curso }) {
  return (
    <main className={`glow-landing ${bodyFont.variable} ${titleFont.variable}`}>
      <SocialProofPopup cursoNombre={curso.titulo} />

      {/* ── 1 · PORTADA ── */}
      <section className="gl-hero">
        <div className="gl-hero-copy">
          <span className="gl-eyebrow">
            Curso online de maquillaje · Por Nina Amateis, makeup artist
          </span>
          <h1 className="gl-h1">
            Resaltá tu look en pocos minutos{' '}
            <em>y que te dure <span className="gl-mark">todo el día.</span></em>
          </h1>
          <p className="gl-intro">
            Con el Método Day to Night vas a aprender, en 4 pasos simples, cómo maquillarte a la mañana con un look natural, retocarte a la tarde y pasar a la noche sin desarmar nada.
          </p>
          <div style={{ marginTop: 32, marginBottom: 16 }}>
            <a className="gl-btn" href="#precio">Quiero hacer el curso</a>
          </div>
          <p className="gl-perks">
            <span className="gl-mark">100% online</span>{' '}&nbsp;/{' '}&nbsp;
            <span className="gl-mark">A tu ritmo</span>{' '}&nbsp;/{' '}&nbsp;
            <span className="gl-mark">Para siempre</span>
          </p>
        </div>
        <div className="gl-hero-visual">
          <video
            autoPlay muted loop playsInline preload="metadata"
            aria-label="Antes y después con el Método Day to Night"
          >
            <source src={VIDEO_URL} type="video/mp4" />
          </video>
          <div className="gl-clarins-brand">
            <span>Esponsoreado por</span>
            <img src="/clarins-logo.svg" alt="Clarins Paris" className="gl-clarins-logo" />
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="gl-ribbon" aria-hidden="true">
        <div className="gl-ribbon-track">
          <span>ACCESO DE POR VIDA &nbsp;✦&nbsp; 5 RECURSOS BONUS &nbsp;✦&nbsp; COMUNIDAD EXCLUSIVA &nbsp;✦&nbsp; REGALOS POR COMPRA CLARINS &nbsp;✦&nbsp; </span>
          <span>ACCESO DE POR VIDA &nbsp;✦&nbsp; 5 RECURSOS BONUS &nbsp;✦&nbsp; COMUNIDAD EXCLUSIVA &nbsp;✦&nbsp; REGALOS POR COMPRA CLARINS &nbsp;✦&nbsp; </span>
        </div>
      </div>

      {/* ── 2 · ¿TE PASA ESTO? ── */}
      <section className="gl-wrap gl-pain">
        <div className="gl-pain-left">
          <span className="gl-eyebrow">Tu rutina, en la vida real</span>
          <h2 className="gl-h2">¿Te pasa <em><span className="gl-mark">esto?</span></em></h2>
        </div>
        <ul className="gl-pain-list">
          {[
            'A la mañana no te da el tiempo y salís a medio maquillar.',
            'A la tarde te mirás al espejo y el maquillaje ya no está.',
            'Te invitan a salir y tenés que volver a tu casa a hacer todo de nuevo.',
            'Tenés el neceser lleno y siempre usás lo mismo.',
            'Comprás productos que después no sabés cómo usar.',
          ].map((item, i) => (
            <li key={i} className="gl-pain-item">
              <span className="gl-pain-num">{String(i + 1).padStart(2, '0')}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 3 · VAS A LOGRAR ── */}
      <section className="gl-benefits">
        <div className="gl-wrap">
          <span className="gl-eyebrow">Un día. Un mismo look que evoluciona.</span>
          <h2 className="gl-h2">Con el Método Day to Night,<br /><em>vas a lograr…</em></h2>
          <div className="gl-timeline">
            <article className="gl-moment gl-moment-1">
              <span className="gl-eyebrow">01 · Mañana</span>
              <div className="gl-moment-title">Preparada<br />para salir.</div>
              <p>A la mañana te maquillás con un look natural en pocos minutos.</p>
            </article>
            <article className="gl-moment gl-moment-2">
              <span className="gl-eyebrow">02 · Tarde</span>
              <div className="gl-moment-title">Un toque<br />y seguís.</div>
              <p>A la tarde, con un retoque, volvés a verte fresca.</p>
            </article>
            <article className="gl-moment gl-moment-3">
              <span className="gl-eyebrow">03 · Noche</span>
              <div className="gl-moment-title"><em>Cambiás<br />el plan.</em></div>
              <p>A la noche pasás a tu look de salida sin volver a tu casa.</p>
            </article>
          </div>
          <div className="gl-extras">
            <p>✦ Usás lo que ya tenés en el neceser, y sabés para qué sirve cada cosa.</p>
            <p>✦ Dejás de comprar productos que después no usás.</p>
          </div>
        </div>
      </section>

      {/* ── 4 · QUIÉN ES NINA ── */}
      <section className="gl-wrap gl-nina">
        <div className="gl-nina-photo">
          <Image
            src={NINA_IMG}
            alt="Nina Amateis"
            fill
            className="gl-portrait"
            sizes="(max-width: 760px) 90vw, 44vw"
          />
        </div>
        <div className="gl-nina-copy">
          <span className="gl-eyebrow">La persona detrás del método</span>
          <h2 className="gl-h2">Quién es <em>Nina</em></h2>
          <p>Soy Nina Amateis, influencer y makeup artist. Hace +10 años comparto maquillaje, moda y lifestyle con una comunidad de casi 300 mil mujeres en Instagram.</p>
          <p>En todo este tiempo vi que la mayoría no necesita más productos ni tutoriales eternos: necesita un método simple para maquillarse en el día a día. Por eso armé el Método Day to Night.</p>
          <blockquote className="gl-quote">
            "Este curso lo armé para vos, mujeres reales que quieren salir prolijas y se cansaron de probar productos que no usan."
          </blockquote>
        </div>
      </section>

      {/* ── 5 · CÓMO FUNCIONA ── */}
      <section className="gl-method">
        <div className="gl-wrap">
          <span className="gl-eyebrow">Del primer paso al último retoque</span>
          <h2 className="gl-h2">Cómo funciona el<br /><em>Método Day to Night</em></h2>
          <p className="gl-method-sub">4 pasos simples, uno para cada momento de tu día.</p>
          <div className="gl-steps">
            {STEPS.map((s, i) => (
              <article key={s.num} className={`gl-step gl-step-${i + 1}`}>
                <span className="gl-step-num">{s.num}</span>
                <div className="gl-step-eyebrow">{s.eyebrow}</div>
                <h3 className="gl-step-title">{s.title}</h3>
                <p className="gl-step-desc">{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 · BONUS + COMUNIDAD ── */}
      <section className="gl-wrap gl-bonus-section">
        <span className="gl-eyebrow">Para acompañarte después de darle play</span>
        <h2 className="gl-h2">Accediendo hoy, <em>te llevás:</em></h2>
        <p className="gl-bonus-sub">5 recursos bonus + la Comunidad Glow.</p>
        <div className="gl-bonus-grid">
          {BONUSES.map((b, i) => (
            <article key={i} className={`gl-bonus-card gl-bonus-${i}`}>
              <span className="gl-eyebrow">{b.label}</span>
              <h3 className="gl-bonus-title">{b.title}</h3>
              <p className="gl-bonus-desc">{b.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── 8 · PRECIO + CHECKOUT ── */}
      <section className="gl-price-section" id="inscripcion">
        <div className="gl-wrap gl-price-layout">
          <div className="gl-price-left">
            <span className="gl-eyebrow">Day to Night Glow · Curso online</span>
            <h2 className="gl-h2">Tu próximo look<br /><em>empieza acá.</em></h2>
            <ul className="gl-includes">
              <li>Los 4 módulos del Método Day to Night</li>
              <li>5 recursos bonus + comunidad</li>
              <li>Acceso inmediato desde la compu o el celular</li>
              <li>Links a productos Clarins con regalos por compra</li>
              <li>Acceso de por vida y actualizaciones</li>
            </ul>
          </div>
          <div className="gl-price-card">
            <span className="gl-price-pill">Cupos limitados · 30 a precio de lanzamiento</span>
            <AddToCartCurso curso={curso} />
            <div className="gl-mp-trust">
              <img src="/mercadopago-logo.svg" alt="Mercado Pago" className="gl-mp-logo" />
              <p className="gl-fine">Pagás seguro con Mercado Pago</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9 · FAQ ── */}
      <section className="gl-wrap gl-faq">
        <span className="gl-eyebrow">Antes de empezar</span>
        <h2 className="gl-h2">Preguntas <em>frecuentes</em></h2>
        <div className="gl-faq-list">
          {FAQ.map((item, i) => (
            <details key={i} className="gl-details">
              <summary className="gl-summary">{item.q}</summary>
              <p className="gl-details-body">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <style>{`
        .glow-landing {
          --ink: #192149;
          --paper: #e9e2da;
          --pink: #e1c8cb;
          --blue: #1a4c81;
          --mid: #20699f;
          --bf: var(--font-body, 'DM Sans', Arial, sans-serif);
          --tf: var(--font-title, 'Playfair Display', Georgia, serif);
          font-family: var(--bf);
          background: var(--paper);
          color: var(--ink);
          font-size: 16px;
          line-height: 1.6;
          padding-top: 96px;
        }
        .glow-landing *, .glow-landing *::before, .glow-landing *::after { box-sizing: border-box; }
        .glow-landing h1, .glow-landing h2, .glow-landing h3, .glow-landing p { margin-top: 0; }

        /* Shared */
        .gl-wrap { max-width: 1220px; margin: auto; padding: 90px 40px; }
        .gl-eyebrow { display: block; text-transform: uppercase; letter-spacing: 2px; font-size: 11px; font-weight: 700; margin-bottom: 22px; }
        .gl-h1 { font-family: var(--tf); font-size: clamp(40px, 4.4vw, 67px); font-weight: 400; line-height: 1.12; letter-spacing: -2px; margin-bottom: 24px; }
        .gl-h2 { font-family: var(--tf); font-size: clamp(34px, 3.6vw, 52px); font-weight: 400; line-height: 1.12; letter-spacing: -1px; margin-bottom: 30px; }
        .gl-h1 em, .gl-h2 em { font-weight: 400; font-style: italic; }
        .gl-mark { background: linear-gradient(transparent 70%, var(--pink) 70%); box-decoration-break: clone; -webkit-box-decoration-break: clone; }
        .gl-btn {
          display: inline-flex; align-items: center; justify-content: center;
          background: var(--blue); color: #fff; border: none; border-radius: 50px;
          padding: 17px 30px; font-weight: 600; font-size: 15px; text-decoration: none;
          transition: transform .2s, background .2s; font-family: var(--bf);
        }
        .gl-btn:hover { transform: translateY(-3px); background: var(--ink); }

        /* ── HERO ── */
        .gl-hero {
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px;
          align-items: center; max-width: 1220px; margin: auto;
          padding: 54px 40px 48px;
        }
        .gl-intro { font-size: 18px; max-width: 540px; margin-bottom: 0; }
        .gl-perks { font-weight: 700; font-size: 15px; margin: 0; }
        .gl-hero-visual { min-width: 0; }
        .gl-hero-visual video {
          display: block; width: 100%; aspect-ratio: 16/9;
          object-fit: cover; border-radius: 16px; background: #ddcaca;
        }
        .gl-clarins-brand { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 18px; }
        .gl-clarins-brand span { font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
        .gl-clarins-logo { height: 54px; width: auto; }

        /* ── TICKER ── */
        .gl-ribbon { background: var(--pink); overflow: hidden; padding: 20px 0; }
        .gl-ribbon-track { display: flex; width: max-content; animation: gl-marquee 30s linear infinite; font-size: 11px; letter-spacing: 2px; font-weight: 700; }
        .gl-ribbon-track span { flex-shrink: 0; white-space: nowrap; padding-right: 20px; }
        .gl-ribbon:hover .gl-ribbon-track { animation-play-state: paused; }
        @keyframes gl-marquee { to { transform: translateX(-50%); } }

        /* ── ¿TE PASA ESTO? ── */
        .gl-pain { display: grid; grid-template-columns: .8fr 1.2fr; gap: 70px; align-items: center; }
        .gl-pain-left { text-align: center; }
        .gl-pain-left .gl-h2 { margin-bottom: 0; }
        .gl-pain-list { list-style: none; padding: 0; margin: 0; }
        .gl-pain-item { display: flex; gap: 20px; padding: 19px 0; border-bottom: 1px solid rgba(25,33,73,.13); font-size: 18px; }
        .gl-pain-item:first-child { border-top: 1px solid rgba(25,33,73,.13); }
        .gl-pain-num { font-size: 12px; opacity: .5; padding-top: 5px; flex-shrink: 0; }

        /* ── VAS A LOGRAR ── */
        .gl-benefits { background: #f3eee8; }
        .gl-timeline { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 40px; }
        .gl-moment { padding: 35px; border-radius: 80px 80px 15px 15px; min-height: 260px; transition: transform .3s; display: grid; grid-template-rows: 18px 80px auto; row-gap: 20px; align-content: start; }
        .gl-moment:hover { transform: translateY(-7px); }
        .gl-moment .gl-eyebrow { margin-bottom: 0; }
        .gl-moment-1 { background: #e9dfd1; }
        .gl-moment-2 { background: var(--pink); }
        .gl-moment-3 { background: var(--ink); color: var(--paper); }
        .gl-moment-title { font-family: var(--tf); font-size: 35px; font-weight: 400; line-height: 1.12; margin: 0; }
        .gl-moment p { font-size: 17px; margin: 0; }
        .gl-extras { display: flex; gap: 20px; justify-content: space-between; margin-top: 30px; }
        .gl-extras p { margin: 0; font-size: clamp(11px, 1.1vw, 14px); white-space: nowrap; }

        /* ── QUIÉN ES NINA ── */
        .gl-nina { display: grid; grid-template-columns: .9fr 1.1fr; gap: 70px; align-items: center; }
        .gl-nina-photo { position: relative; border-radius: 150px 150px 16px 16px; overflow: hidden; aspect-ratio: 3/4; }
        .gl-portrait { object-fit: cover; object-position: top; }
        .gl-nina-copy p { font-size: 17px; margin-bottom: 16px; }
        .gl-ig-pending {
          border: 1px dashed rgba(25,33,73,.4); border-radius: 10px;
          padding: 14px; font-size: 12px; color: #626479; margin: 20px 0;
        }
        .gl-quote {
          border-left: 3px solid var(--pink); padding: 10px 0 10px 25px;
          margin: 0; font-family: Georgia, serif; font-style: italic;
          font-size: 24px; line-height: 1.5;
        }

        /* ── CÓMO FUNCIONA ── */
        .gl-method { }
        .gl-method-sub { font-size: 18px; margin-bottom: 0; }
        .gl-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 50px; }
        .gl-step { padding: 28px 24px 32px; min-height: 360px; transition: transform .3s; border-radius: 4px; }
        .gl-step:hover { transform: translateY(-8px); }
        .gl-step-1 { background: #d8cec3; color: var(--ink); }
        .gl-step-2 { background: var(--pink); color: var(--ink); }
        .gl-step-3 { background: var(--mid); color: var(--paper); }
        .gl-step-4 { background: var(--ink); color: var(--paper); }
        .gl-step-num { font-family: var(--tf); font-style: italic; font-size: 54px; display: block; line-height: 1; margin-bottom: 40px; }
        .gl-step-eyebrow { display: block; text-transform: uppercase; letter-spacing: 2px; font-size: 11px; font-weight: 700; margin-bottom: 16px; }
        .gl-step-title { font-family: var(--tf); font-size: 25px; font-weight: 500; line-height: 1.2; margin-bottom: 12px; }
        .gl-step-desc { font-size: 14px; line-height: 1.7; margin: 0; opacity: .9; }

        /* ── BONUS ── */
        .gl-bonus-section { }
        .gl-bonus-sub { font-size: 17px; margin-bottom: 0; }
        .gl-bonus-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 45px; }
        .gl-bonus-card { padding: 30px; border-radius: 18px; }
        .gl-bonus-0, .gl-bonus-2, .gl-bonus-4 { background: #f3eee8; }
        .gl-bonus-1, .gl-bonus-3 { background: #e2cdd0; }
        .gl-bonus-5 { background: var(--blue); color: #fff; }
        .gl-bonus-5 .gl-eyebrow { color: var(--pink); }
        .gl-bonus-title { font-family: var(--tf); font-size: 30px; font-weight: 400; line-height: 1.2; margin: 15px 0 20px; }
        .gl-bonus-desc { font-size: 15px; margin: 0; }

        /* ── PRECIO ── */
        .gl-price-section { background: var(--pink); }
        .gl-price-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 70px; align-items: center; }
        .gl-includes { list-style: none; padding: 0; margin: 0; }
        .gl-includes li { padding: 12px 0; border-bottom: 1px solid rgba(25,33,73,.13); font-size: 15px; }
        .gl-includes li::before { content: '✓'; margin-right: 12px; font-weight: 700; }
        .gl-price-card {
          background: #f8f4ef; border-radius: 24px; padding: 42px;
          text-align: center; box-shadow: 0 20px 50px rgba(25,33,73,.07);
        }
        .gl-price-pill {
          display: inline-block; background: var(--pink); padding: 7px 16px;
          border-radius: 40px; font-size: 12px; margin-bottom: 20px;
        }
        .gl-mp-trust { display: flex; flex-direction: column; align-items: center; margin-top: 16px; }
        .gl-mp-logo { height: 52px; width: auto; }
        .gl-fine { font-size: 12px; margin: 6px 0 0; opacity: .7; }

        /* ── FAQ ── */
        .gl-faq { }
        .gl-faq-list { max-width: 920px; margin-top: 8px; }
        .gl-details { border-bottom: 1px solid rgba(25,33,73,.15); padding: 22px 0; }
        .gl-summary {
          list-style: none; cursor: pointer; display: flex;
          justify-content: space-between; gap: 20px; font-size: 18px; font-weight: 500;
        }
        .gl-summary::-webkit-details-marker { display: none; }
        .gl-summary::after { content: '+'; font-size: 24px; font-weight: 400; flex-shrink: 0; }
        details[open] .gl-summary::after { content: '−'; }
        .gl-details-body { font-size: 15px; line-height: 1.8; margin: 16px 30px 0 0; color: #444b69; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1000px) {
          .gl-steps { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 760px) {
          .gl-wrap { padding: 60px 22px; }
          .gl-hero { grid-template-columns: 1fr; gap: 24px; padding: 35px 22px; }
          .gl-h1 { font-size: 40px; letter-spacing: -1.5px; }
          .gl-intro { font-size: 16px; }
          .gl-pain, .gl-nina, .gl-price-layout { grid-template-columns: 1fr; gap: 30px; }
          .gl-pain-list li { font-size: 16px; }
          .gl-pain-left { text-align: left; }
          .gl-timeline { grid-template-columns: 1fr; gap: 12px; }
          .gl-moment { border-radius: 16px; padding: 25px; min-height: 0; display: block; }
          .gl-moment-title { font-size: 30px; margin: 12px 0; }
          .gl-extras { display: block; }
          .gl-extras p { white-space: normal; margin-top: 22px; font-size: 14px; }
          .gl-nina-photo { aspect-ratio: 3/4; max-height: 430px; }
          .gl-steps { grid-template-columns: 1fr; gap: 10px; }
          .gl-step { padding: 22px 17px; min-height: 0; }
          .gl-step-num { font-size: 44px; margin-bottom: 25px; }
          .gl-bonus-grid { grid-template-columns: 1fr; }
          .gl-price-card { padding: 30px 22px; }
          .gl-summary { font-size: 16px; }
        }
        @media (max-width: 360px) {
          .gl-steps { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .glow-landing *, .glow-landing *::before, .glow-landing *::after { transition: none !important; }
          .gl-ribbon-track { animation: none; }
        }
      `}</style>
    </main>
  )
}
