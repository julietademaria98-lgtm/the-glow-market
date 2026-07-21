'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface TestimonialFormProps {
  cursoId: string
  userId: string
  nombreUsuario: string
}

export default function TestimonialForm({ cursoId, userId, nombreUsuario }: TestimonialFormProps) {
  const [texto, setTexto] = useState('')
  const [nombrePublico, setNombrePublico] = useState(nombreUsuario)
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!texto.trim()) return

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: err } = await supabase.from('testimonios').insert({
      user_id: userId,
      curso_id: cursoId,
      texto: texto.trim(),
      nombre_publico: nombrePublico.trim() || nombreUsuario,
    })

    if (err) {
      setError('Hubo un error al enviar tu testimonio. Intentá de nuevo.')
    } else {
      setEnviado(true)
    }
    setLoading(false)
  }

  if (enviado) {
    return (
      <div className="border border-glow-navy/20 p-8 text-center">
        <p className="font-cormorant text-glow-navy text-2xl mb-2">¡Gracias por tu testimonio!</p>
        <p className="font-montserrat text-xs text-glow-navy/50 tracking-widest uppercase">
          Lo revisamos y lo publicamos pronto
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="border border-glow-navy/20 p-8 flex flex-col gap-5">
      <div>
        <p className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-navy/50 mb-1">
          Tu nombre (como aparecerá publicado)
        </p>
        <input
          type="text"
          value={nombrePublico}
          onChange={e => setNombrePublico(e.target.value)}
          className="w-full bg-transparent border-b border-glow-navy/20 py-2 font-cormorant text-glow-navy text-lg outline-none focus:border-glow-navy transition-colors"
          placeholder="Ej: Valentina M."
        />
      </div>

      <div>
        <p className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-navy/50 mb-1">
          Tu experiencia con el curso
        </p>
        <textarea
          value={texto}
          onChange={e => setTexto(e.target.value)}
          rows={4}
          maxLength={300}
          className="w-full bg-transparent border border-glow-navy/20 p-3 font-cormorant text-glow-navy text-lg outline-none focus:border-glow-navy transition-colors resize-none"
          placeholder="Contanos cómo te cambió el curso..."
        />
        <p className="font-montserrat text-[9px] text-glow-navy/30 text-right mt-1">
          {texto.length}/300
        </p>
      </div>

      {error && (
        <p className="font-montserrat text-[10px] text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !texto.trim()}
        className="font-montserrat uppercase bg-glow-navy text-white disabled:opacity-40 transition-opacity"
        style={{ fontSize: '11px', letterSpacing: '0.25em', padding: '14px 32px', alignSelf: 'flex-start' }}
      >
        {loading ? 'Enviando...' : 'Enviar testimonio'}
      </button>
    </form>
  )
}
