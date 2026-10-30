'use client'

import { useState } from 'react'

type State = 'idle' | 'loading' | 'success' | 'error'

export default function GuiaForm() {
  const [state, setState] = useState<State>('idle')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [sentEmail, setSentEmail] = useState('')
  const [sentNombre, setSentNombre] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/guia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim(), email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error inesperado')
      setSentEmail(email.trim())
      setSentNombre(nombre.trim().split(' ')[0])
      setState('success')
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Algo salió mal. Intentá de nuevo.')
      setState('error')
    }
  }

  const handleResend = async () => {
    setState('loading')
    try {
      const res = await fetch('/api/guia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: sentNombre, email: sentEmail }),
      })
      if (res.ok) setState('success')
      else setState('error')
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div style={{ flex: '1 1 340px', minWidth: 0, background: '#f4efea', borderRadius: 20, padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', textAlign: 'center' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#192149" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/></svg>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', color: '#192149' }}>✦ ¡LISTO, {sentNombre.toUpperCase()}!</p>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-title, Georgia, serif)', fontWeight: 400, fontSize: 28, lineHeight: 1.2, color: '#192149' }}>
          Tu guía <em style={{ background: 'linear-gradient(transparent 62%, #e1c8cb 62%)' }}>ya está en tu mail.</em>
        </h3>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#192149' }}>
          Te la mandé a <strong>{sentEmail}</strong>. Abrí el mail y tocá "Ver mi guía".
        </p>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: '#3a3f5c' }}>
          ¿No te llegó? Revisá Promociones o Spam.{' '}
          <button type="button" onClick={handleResend} style={{ background: 'none', border: 'none', padding: 0, color: '#192149', textDecoration: 'underline', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
            Reenviar el mail
          </button>
          {' · '}
          <button type="button" onClick={() => { setState('idle'); setNombre(''); setEmail('') }} style={{ background: 'none', border: 'none', padding: 0, color: '#192149', textDecoration: 'underline', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
            Corregir mi mail
          </button>
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ flex: '1 1 340px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 500, color: '#e9e2da' }}>
        Tu nombre
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Ej: Carla"
          required
          minLength={2}
          maxLength={100}
          style={{ fontFamily: 'inherit', fontSize: 16, padding: '15px 18px', borderRadius: 10, border: 0, background: '#e9e2da', color: '#192149', outline: 'none' }}
        />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 500, color: '#e9e2da' }}>
        Tu mail
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="tumail@gmail.com"
          required
          maxLength={254}
          style={{ fontFamily: 'inherit', fontSize: 16, padding: '15px 18px', borderRadius: 10, border: 0, background: '#e9e2da', color: '#192149', outline: 'none' }}
        />
      </label>
      {errorMsg && (
        <p style={{ margin: 0, fontSize: 13, color: '#e1c8cb' }}>{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={state === 'loading'}
        style={{ marginTop: 8, padding: '18px 32px', borderRadius: 999, background: '#e1c8cb', color: '#192149', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 500, fontFamily: 'inherit', opacity: state === 'loading' ? 0.7 : 1 }}
      >
        {state === 'loading' ? 'Enviando…' : 'Quiero mi guía gratis'}
      </button>
      <p style={{ margin: 0, fontSize: 13, color: '#9b9db8' }}>
        Te llega al instante a tu mail. Sin spam, te podés dar de baja cuando quieras.
      </p>
    </form>
  )
}
