export const dynamic = 'force-dynamic'

import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import GuiaForm from '@/components/courses/GuiaForm'

const MAX_DISPOSITIVOS = 2

async function validateToken(token: string): Promise<{ valid: boolean; leadId?: string; nombre?: string }> {
  const db = createAdminClient()
  const { data: lead } = await db
    .from('leads')
    .select('id, nombre, token_expires_at, dispositivos_usados, unsubscribed')
    .eq('token', token)
    .single()

  if (!lead) return { valid: false }
  if (lead.unsubscribed) return { valid: false }
  if (new Date(lead.token_expires_at) < new Date()) return { valid: false }
  if (lead.dispositivos_usados >= MAX_DISPOSITIVOS) return { valid: false }

  return { valid: true, leadId: lead.id, nombre: lead.nombre }
}

async function registerDevice(leadId: string) {
  const db = createAdminClient()
  await db.rpc('increment_lead_dispositivos', { lead_id: leadId })
}

interface Props {
  searchParams: { t?: string }
}

export default async function InfaltablesPage({ searchParams }: Props) {
  const token = searchParams.t
  const cookieStore = await cookies()
  const cookieName = token ? `guia_access_${token.slice(0, 16)}` : null
  const alreadyGranted = cookieName ? cookieStore.has(cookieName) : false

  let showGuia = false
  let nombre = ''

  if (token) {
    if (alreadyGranted) {
      showGuia = true
    } else {
      const result = await validateToken(token)
      if (result.valid && result.leadId) {
        await registerDevice(result.leadId)
        showGuia = true
        nombre = result.nombre ?? ''
      }
    }
  }

  // Cookie se setea via headers — usamos una redirección interna para eso
  // La cookie la setea el route handler /api/guia/access si queremos ser estrictos,
  // pero para simplificar la seteamos via response headers aquí en el Server Component
  // usando la respuesta. En App Router esto se hace via cookies().set() — no disponible
  // en Server Components sin middleware. Usamos el enfoque de ruta separada.

  if (!showGuia) {
    return (
      <main style={{ background: '#e9e2da', color: '#192149', fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: '100vh' }}>
        <header style={{ display: 'flex', justifyContent: 'center', padding: '22px 5%', borderBottom: '1px solid #d9d0c7' }}>
          <Link href="/" aria-label="The Glow Market" style={{ fontFamily: 'Georgia, serif', fontSize: 28, letterSpacing: '0.08em', textDecoration: 'none', color: '#192149' }}>
            THE <span style={{ fontSize: 40 }}>GLOW</span> MARKET
          </Link>
        </header>
        <section style={{ maxWidth: 720, margin: '0 auto', padding: '72px 24px 96px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: '0.2em' }}>✦ GUÍA GRATUITA</p>
          <h1 style={{ margin: 0, fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 40, lineHeight: 1.15 }}>
            {token ? 'Este link ya no es válido.' : 'Solicitá tu guía gratis.'}
          </h1>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.65, maxWidth: 500 }}>
            {token
              ? 'El link venció o ya fue abierto desde demasiados dispositivos. Dejame tu mail y te mando uno nuevo al instante.'
              : '¿No sabés por dónde empezar ni qué comprarte? Dejame tu mail y te mando al instante mi guía con los 7 productos que tenés que tener sí o sí.'}
          </p>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <GuiaForm />
          </div>
        </section>
      </main>
    )
  }

  return (
    <main style={{ background: '#e9e2da', color: '#192149', fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: '100vh' }}>
      <div style={{ background: '#192149', color: '#e9e2da', fontSize: 12, letterSpacing: '0.22em', padding: '10px 0', textAlign: 'center' }}>
        ✦ GUÍA GRATUITA &nbsp; ✦ 3 CUOTAS SIN INTERÉS EN EL CURSO &nbsp; ✦ GUÍA GRATUITA &nbsp; ✦ 3 CUOTAS SIN INTERÉS EN EL CURSO
      </div>
      <header style={{ display: 'flex', justifyContent: 'center', padding: '22px 5%', borderBottom: '1px solid #d9d0c7' }}>
        <Link href="/" aria-label="The Glow Market" style={{ fontFamily: 'Georgia, serif', fontSize: 28, letterSpacing: '0.08em', textDecoration: 'none', color: '#192149' }}>
          THE <span style={{ fontSize: 40 }}>GLOW</span> MARKET
        </Link>
      </header>

      {/* Encabezado */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: '0.2em' }}>✦ GUÍA GRATUITA · POR NINA AMATEIS, MAKEUP ARTIST</p>
        <h1 style={{ margin: 0, fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(44px, 6vw, 64px)', lineHeight: 1.04, letterSpacing: '-0.02em' }}>
          Los 7 infaltables <em style={{ background: 'linear-gradient(transparent 62%, #e1c8cb 62%)' }}>de Nina</em>
        </h1>
        <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, lineHeight: 1.4 }}>Todo lo que tenés que tener en tu neceser, y nada que no vayas a usar.</p>
        <p style={{ margin: '8px 0 0', fontSize: 17, lineHeight: 1.65 }}>¿Entrás a una perfumería y no sabés qué comprar? ¿Tenés un cajón lleno de productos que usaste dos veces? No necesitás 40 productos. Con estos 7 te maquillás a la mañana, te retocás a la tarde y salís a la noche.</p>
        <div style={{ background: '#e1c8cb', borderRadius: 14, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: '0.2em' }}>✦ ¿RECIÉN ARRANCÁS?</p>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5 }}>Empezá por estos 3: <strong>protector solar, corrector y máscara de pestañas.</strong></p>
        </div>
      </section>

      {/* Para la mañana */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 0' }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: '0.22em' }}>✦ PARA LA MAÑANA</p>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column' }}>
          {[
            { n: '1', titulo: 'Protector solar', paraque: 'protege tu piel todos los días, aunque esté nublado.', como: 'FPS 30 o más, con la textura que te resulte más cómoda.' },
            { n: '2', titulo: 'Base', paraque: 'empareja el tono sin tapar la piel.', como: 'que se funda con tu cuello, no con tu mano. Probala con luz natural.' },
            { n: '3', titulo: 'Corrector', paraque: 'ilumina y levanta la mirada.', como: 'uno o dos tonos más claro que tu base, de textura cremosa.' },
            { n: '4', titulo: 'Bronzer', paraque: 'da estructura y calidez a la cara.', como: 'mate, uno o dos tonos más oscuro que tu piel.' },
            { n: '5', titulo: 'Máscara de pestañas', paraque: 'abre la mirada al instante.', como: 'negra, con efecto volumen.', last: true },
          ].map((p, i, arr) => (
            <div key={p.n} style={{ display: 'flex', gap: 24, borderTop: '1px solid #c9beb3', ...(i === arr.length - 1 ? { borderBottom: '1px solid #c9beb3' } : {}), padding: '28px 0' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 52, lineHeight: 0.9, width: 44, flexShrink: 0 }}>{p.n}</span>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 28 }}>{p.titulo}</h2>
                <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6 }}><strong>Para qué:</strong> {p.paraque}</p>
                <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6 }}><strong>Cómo elegirlo:</strong> {p.como}</p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/cursos/day-to-night-glow" style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', alignItems: 'center', background: '#192149', color: '#e9e2da', textDecoration: 'none', borderRadius: 14, padding: '20px 24px', fontSize: 16, lineHeight: 1.5 }}>
          <em>Cómo armar tu look de día con estos productos te lo enseño en los <strong>Módulos 1 y 2</strong> del curso.</em>
          <span style={{ fontWeight: 700, color: '#e1c8cb' }}>Ver el curso →</span>
        </Link>
      </section>

      {/* Para la tarde */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 0' }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: '0.22em' }}>✦ PARA LA TARDE</p>
        <div style={{ marginTop: 16, display: 'flex', gap: 24, borderTop: '1px solid #c9beb3', borderBottom: '1px solid #c9beb3', padding: '28px 0' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 52, lineHeight: 0.9, width: 44, flexShrink: 0 }}>6</span>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 28 }}>Tinta o blush</h2>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6 }}><strong>Para qué:</strong> le devuelve el color y la frescura a la cara.</p>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6 }}><strong>Cómo elegirlo:</strong> en un tono rosado, durazno o frambuesa, el que mejor vaya con tu piel.</p>
          </div>
        </div>
        <Link href="/cursos/day-to-night-glow" style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', alignItems: 'center', background: '#192149', color: '#e9e2da', textDecoration: 'none', borderRadius: 14, padding: '20px 24px', fontSize: 16, lineHeight: 1.5 }}>
          <em>El retoque que te salva a cualquier hora te lo enseño en el <strong>Módulo 3</strong> del curso.</em>
          <span style={{ fontWeight: 700, color: '#e1c8cb' }}>Ver el curso →</span>
        </Link>
      </section>

      {/* Para la noche */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 0' }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: '0.22em' }}>✦ PARA LA NOCHE</p>
        <div style={{ marginTop: 16, display: 'flex', gap: 24, borderTop: '1px solid #c9beb3', borderBottom: '1px solid #c9beb3', padding: '28px 0' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 52, lineHeight: 0.9, width: 44, flexShrink: 0 }}>7</span>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 28 }}>Delineador negro</h2>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6 }}><strong>Para qué:</strong> intensifica la mirada.</p>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6 }}><strong>Cómo elegirlo:</strong> en lápiz o en punta fina, el que te resulte más cómodo.</p>
          </div>
        </div>
        <Link href="/cursos/day-to-night-glow" style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', alignItems: 'center', background: '#192149', color: '#e9e2da', textDecoration: 'none', borderRadius: 14, padding: '20px 24px', fontSize: 16, lineHeight: 1.5 }}>
          <em>Cómo pasar de tu look de día al de noche sin desmaquillarte te lo enseño en el <strong>Módulo 4</strong> del curso.</em>
          <span style={{ fontWeight: 700, color: '#e1c8cb' }}>Ver el curso →</span>
        </Link>
        <div style={{ marginTop: 28, border: '1.5px dashed #192149', borderRadius: 14, padding: '20px 24px', fontSize: 17, lineHeight: 1.5 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.2em' }}>OPCIONAL &nbsp;</span>
          <strong style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 22 }}>Gloss</strong>, para sumar brillo a los labios cuando tengas ganas.
        </div>
      </section>

      {/* Cómo armar tu neceser */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px 0' }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: '0.22em' }}>✦ CÓMO ARMAR TU NECESER</p>
        <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: '1 1 260px', background: '#f4efea', borderRadius: 16, padding: 26, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: '0.2em' }}>EN CASA</p>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.8 }}>✦ Protector solar<br />✦ Base<br />✦ Bronzer<br />✦ Máscara de pestañas<br />✦ Delineador negro</p>
          </div>
          <div style={{ flex: '1 1 260px', background: '#e1c8cb', borderRadius: 16, padding: 26, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: '0.2em' }}>EN LA CARTERA, SIEMPRE</p>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.8 }}>✦ Corrector<br />✦ Tinta o blush<br />✦ Gloss</p>
          </div>
        </div>
        <div style={{ marginTop: 16, background: '#f4efea', borderRadius: 16, padding: 28, display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ margin: 0, flex: '1 1 300px', fontFamily: 'Georgia, serif', fontSize: 22, lineHeight: 1.35 }}>
            Un neceser ordenado es la diferencia entre retocarte en minutos <em>o revolver toda la cartera.</em>
          </p>
          <Link href="/productos" style={{ background: '#24508a', color: '#fff', textDecoration: 'none', fontSize: 15, fontWeight: 500, padding: '15px 28px', borderRadius: 999 }}>
            Ver neceseres
          </Link>
        </div>
      </section>

      {/* Bloque final del curso */}
      <section id="curso" style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px 80px' }}>
        <div style={{ background: '#192149', color: '#e9e2da', borderRadius: 20, padding: '48px 7%', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: '0.2em', color: '#e1c8cb' }}>✦ CURSO ONLINE DAY TO NIGHT GLOW</p>
          <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 40, lineHeight: 1.1 }}>Ya tenés la lista. <em>Ahora aprendé a usarlos.</em></h2>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.65 }}>Tener los productos es la mitad. La otra mitad es saber usarlos para que el maquillaje te acompañe de la mañana a la noche. En el curso te lo enseño paso a paso.</p>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.9 }}>✦ 4 pasos, 25 minutos de video<br />✦ A tu ritmo y para siempre<br />✦ 5 recursos bonus y comunidad privada<br />✦ Regalos por compra Clarins</p>
          <div style={{ background: '#e9e2da', color: '#192149', borderRadius: 16, padding: '24px 28px', display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 15, color: '#4a4f6a', textDecoration: 'line-through' }}>$75.000</span>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 42, lineHeight: 1 }}>$57.970</span>
              <span style={{ fontSize: 15 }}>o 3 cuotas sin interés de <strong>$19.324</strong></span>
            </div>
            <Link href="/cursos/day-to-night-glow#inscripcion" style={{ background: '#24508a', color: '#fff', textDecoration: 'none', fontSize: 16, fontWeight: 500, padding: '17px 30px', borderRadius: 999 }}>
              Quiero hacer el curso
            </Link>
          </div>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>✦ ¿Dudas durante el curso? Te respondo en la comunidad privada.</p>
        </div>
        <p style={{ margin: '28px 0 0', textAlign: 'center', fontSize: 15 }}>
          <a href="/guia-infaltables.pdf" download style={{ color: '#192149', textUnderlineOffset: 4 }}>Descargar la guía en PDF</a>
        </p>
      </section>
    </main>
  )
}
