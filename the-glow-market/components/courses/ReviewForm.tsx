'use client'

import { useState } from 'react'

type Rating = 1 | 2 | 3 | 4 | 5
type State = 'idle' | 'loading' | 'success' | 'error'

interface ReviewSuccessData {
  codigo: string
}

export default function ReviewForm({ userId }: { userId: string }) {
  const [state, setState] = useState<State>('idle')
  const [rating, setRating] = useState<Rating | null>(null)
  const [hover, setHover] = useState<number | null>(null)
  const [nombre, setNombre] = useState('')
  const [instagram, setInstagram] = useState('')
  const [texto, setTexto] = useState('')
  const [foto, setFoto] = useState<File | null>(null)
  const [permisoTexto, setPermisoTexto] = useState(false)
  const [permisoFoto, setPermisoFoto] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successData, setSuccessData] = useState<ReviewSuccessData | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating) { setErrorMsg('Elegí una cantidad de estrellas.'); return }
    if (!texto.trim()) { setErrorMsg('Contanos qué te llevás del curso.'); return }
    setState('loading')
    setErrorMsg('')

    const formData = new FormData()
    formData.append('rating', String(rating))
    formData.append('nombre', nombre.trim())
    formData.append('instagram', instagram.trim())
    formData.append('texto', texto.trim())
    formData.append('permiso_texto', String(permisoTexto))
    formData.append('permiso_foto', String(permisoFoto))
    if (foto) formData.append('foto', foto)

    try {
      const res = await fetch('/api/reviews', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error inesperado')
      setSuccessData({ codigo: data.codigo })
      setState('success')
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Algo salió mal. Intentá de nuevo.')
      setState('error')
    }
  }

  const copyCode = () => {
    if (!successData) return
    navigator.clipboard.writeText(successData.codigo).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const inputStyle: React.CSSProperties = {
    fontFamily: 'inherit', fontSize: 16, padding: '15px 18px',
    borderRadius: 10, border: '1px solid #cfc5bb', background: '#fff',
    color: '#192149', outline: 'none', width: '100%', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 500, color: '#192149' }

  if (state === 'success' && successData) {
    return (
      <div style={{ background: '#f4efea', borderRadius: 20, padding: '48px 6%', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: '0.2em', color: '#192149' }}>✦ ¡GRACIAS POR TU RESEÑA!</p>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-title, Georgia, serif)', fontWeight: 400, fontSize: 40, lineHeight: 1.1, color: '#192149' }}>
          Acá está tu <em style={{ background: 'linear-gradient(transparent 62%, #e1c8cb 62%)' }}>15% OFF.</em>
        </h2>
        <div style={{ width: '100%', boxSizing: 'border-box', border: '1.5px dashed #192149', borderRadius: 14, padding: '22px 24px', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', background: '#e9e2da' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left' }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', color: '#192149' }}>TU CÓDIGO</span>
            <span style={{ fontFamily: 'var(--font-title, Georgia, serif)', fontSize: 34, letterSpacing: '0.08em', color: '#192149' }}>{successData.codigo}</span>
          </div>
          <button type="button" onClick={copyCode} style={{ fontFamily: 'inherit', fontSize: 14, fontWeight: 500, padding: '13px 22px', borderRadius: 999, border: '1.5px solid #192149', background: copied ? '#192149' : 'transparent', color: copied ? '#e9e2da' : '#192149', cursor: 'pointer', transition: 'background .2s' }}>
            {copied ? '✓ Copiado' : 'Copiar código'}
          </button>
        </div>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#192149' }}>
          También te lo mandamos por mail. Usalo en tu próxima compra de neceseres en theglowmarket.com.ar.
        </p>
        <a href="/productos" style={{ background: '#24508a', color: '#fff', textDecoration: 'none', fontSize: 16, fontWeight: 500, padding: '18px 40px', borderRadius: 999, marginTop: 6 }}>
          Ir al Market
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#f4efea', borderRadius: 20, padding: '48px 6%', display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'center', alignItems: 'center' }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: '0.2em', color: '#192149' }}>✦ ¡TERMINASTE EL CURSO!</p>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-title, Georgia, serif)', fontWeight: 400, fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.1, color: '#192149' }}>
          Contame cómo te fue{' '}
          <em style={{ background: 'linear-gradient(transparent 62%, #e1c8cb 62%)' }}>y llevate 15% OFF.</em>
        </h2>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, maxWidth: 520, color: '#3a3f5c' }}>
          Dejame tu opinión sobre el curso y te regalo un código de descuento para tu próxima compra de neceseres en The Glow Market.
        </p>
      </div>

      {/* Estrellas */}
      <fieldset style={{ border: 0, margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        <legend style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, textAlign: 'center', width: '100%', color: '#192149' }}>¿Cuántas estrellas le das?</legend>
        <div style={{ display: 'flex', gap: 6 }}>
          {([1, 2, 3, 4, 5] as Rating[]).map((star) => {
            const active = (hover ?? rating ?? 0) >= star
            return (
              <button
                key={star}
                type="button"
                aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setRating(star)}
                style={{ width: 48, height: 48, border: 0, background: 'transparent', cursor: 'pointer', padding: 4 }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"
                    fill={active ? '#192149' : 'none'} stroke="#192149" strokeWidth="1.5" />
                </svg>
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* Nombre e Instagram */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <label style={{ ...labelStyle, flex: '1 1 240px' }}>
          Tu nombre
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Carla Martínez" required minLength={2} maxLength={100} style={inputStyle} />
        </label>
        <label style={{ ...labelStyle, flex: '1 1 240px' }}>
          Tu Instagram (opcional)
          <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@usuario" maxLength={60} style={inputStyle} />
        </label>
      </div>

      {/* Texto */}
      <label style={labelStyle}>
        ¿Qué te llevás del curso?
        <textarea
          rows={5}
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Contame qué aprendiste, qué paso te sirvió más, cómo te ves ahora…"
          required
          minLength={10}
          maxLength={2000}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
        />
      </label>

      {/* Foto opcional */}
      <label style={{ display: 'flex', gap: 14, alignItems: 'center', border: '1.5px dashed #9a9fb5', borderRadius: 12, padding: '16px 20px', cursor: 'pointer', fontSize: 15, color: '#192149' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#192149" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="15" rx="2"/><circle cx="12" cy="12.5" r="3.5"/><path d="M8 5l1.5-2h5L16 5"/>
        </svg>
        <span>
          {foto ? foto.name : <><strong>Subí tu foto con el look de noche</strong> <span style={{ color: '#3a3f5c' }}>(opcional)</span></>}
        </span>
        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setFoto(e.target.files?.[0] ?? null)} />
      </label>

      {/* Checkboxes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.5, cursor: 'pointer', color: '#192149' }}>
          <input type="checkbox" checked={permisoTexto} onChange={e => setPermisoTexto(e.target.checked)} style={{ width: 18, height: 18, margin: '2px 0 0', accentColor: '#24508a' }} />
          <span>Acepto que publiquen mi comentario en la web con mi nombre e inicial del apellido.</span>
        </label>
        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.5, cursor: 'pointer', color: '#192149' }}>
          <input type="checkbox" checked={permisoFoto} onChange={e => setPermisoFoto(e.target.checked)} style={{ width: 18, height: 18, margin: '2px 0 0', accentColor: '#24508a' }} />
          <span>Si subí una foto, acepto que la publiquen en la web y en Instagram.</span>
        </label>
      </div>

      {errorMsg && (
        <p style={{ margin: 0, fontSize: 13, color: '#c0392b', background: '#fdf0ee', padding: '10px 14px', borderRadius: 8 }}>{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        style={{ alignSelf: 'center', background: '#24508a', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 500, padding: '19px 42px', borderRadius: 999, marginTop: 6, fontFamily: 'inherit', opacity: state === 'loading' ? 0.7 : 1 }}
      >
        {state === 'loading' ? 'Enviando…' : 'Enviar y recibir mi 15% OFF'}
      </button>
      <p style={{ margin: 0, fontSize: 13, textAlign: 'center', color: '#3a3f5c' }}>El descuento es por dejar tu reseña, sea cual sea tu opinión.</p>
    </form>
  )
}
