'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

interface Props {
  ordenId: string
  total: number
  clienteNombre: string
  /** Estado del envío ya generado para esta orden, si existe. */
  envioEstado?: 'pendiente' | 'creado' | 'error' | null
  numeroAndreani?: string | null
}

export default function GenerarEnvioButton({
  ordenId,
  total,
  clienteNombre,
  envioEstado,
  numeroAndreani,
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [kilos, setKilos] = useState('0.3')
  const [dni, setDni] = useState('')
  const [valorDeclarado, setValorDeclarado] = useState(String(total || ''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (envioEstado === 'creado') {
    return (
      <span className="font-montserrat text-[10px] text-green-700">
        ✓ {numeroAndreani || 'Creado'}
      </span>
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await fetch('/api/andreani/envios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ordenId,
        kilos: Number(kilos),
        dni,
        valorDeclarado: Number(valorDeclarado),
      }),
    })
    const data = await res.json().catch(() => ({}))
    setLoading(false)
    if (!data.ok) {
      setError(data.error || 'Error al generar el envío')
      return
    }
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-montserrat text-[10px] tracking-wide uppercase text-glow-navy underline hover:opacity-60"
      >
        {envioEstado === 'error' ? 'Reintentar envío' : 'Generar envío'}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-sm p-6">
            <h3 className="font-cormorant text-2xl text-glow-navy mb-1">Generar envío</h3>
            <p className="font-montserrat text-[10px] text-gray-400 mb-5">{clienteNombre}</p>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="admin-label">Peso (kg)</label>
                <input
                  className="admin-input"
                  type="number"
                  step="0.01"
                  value={kilos}
                  onChange={(e) => setKilos(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="admin-label">DNI del destinatario</label>
                <input
                  className="admin-input"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="admin-label">Valor declarado (ARS)</label>
                <input
                  className="admin-input"
                  type="number"
                  value={valorDeclarado}
                  onChange={(e) => setValorDeclarado(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="font-montserrat text-[10px] text-red-700 whitespace-pre-wrap">{error}</p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" variant="primary" size="sm" loading={loading}>
                  Generar
                </Button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="font-montserrat text-[10px] tracking-wide uppercase text-gray-400 hover:text-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
