'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'

interface ZonaForm {
  id: string
  grupo: 'buenos-aires' | 'provincia'
  etiqueta: string
  /** CP que cubre la zona. null en las que matchean por provincia o por descarte. */
  codigosPostales: string[] | null
  nombre: string
  descripcion: string
  precio: string
  activo: boolean
}

type Msg = { ok: boolean; text: string } | null

const INPUT =
  'border border-gray-200 focus:border-glow-navy outline-none px-3 py-2 font-montserrat text-sm text-glow-navy bg-white transition-colors w-full placeholder:text-gray-300'

const LABEL = 'font-montserrat text-[9px] tracking-widest uppercase text-gray-400 mb-1 block'

export default function AdminEnviosPage() {
  const [zonas, setZonas] = useState<ZonaForm[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<Msg>(null)

  useEffect(() => {
    fetch('/api/admin/envio-zonas')
      .then((r) => r.json())
      .then(({ zonas }) => setZonas(zonas || []))
      .finally(() => setLoading(false))
  }, [])

  function actualizar(id: string, cambios: Partial<ZonaForm>) {
    setZonas((prev) => prev.map((z) => (z.id === id ? { ...z, ...cambios } : z)))
    setMsg(null)
  }

  async function guardar() {
    setSaving(true)
    setMsg(null)
    try {
      const res = await fetch('/api/admin/envio-zonas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zonas }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No se pudo guardar')
      setMsg({ ok: true, text: 'Cambios guardados' })
      // El server apaga las zonas sin nombre; reflejarlo para no mostrar algo distinto.
      setZonas((prev) => prev.map((z) => (z.nombre.trim() ? z : { ...z, activo: false })))
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Error al guardar' })
    } finally {
      setSaving(false)
    }
  }

  const buenosAires = zonas.filter((z) => z.grupo === 'buenos-aires')
  const provincias = zonas.filter((z) => z.grupo === 'provincia')
  const activas = zonas.filter((z) => z.activo).length

  if (loading) {
    return (
      <div className="p-8">
        <p className="font-montserrat text-xs text-gray-400">Cargando zonas…</p>
      </div>
    )
  }

  return (
    <div className="p-8 pb-28">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-cormorant text-3xl text-glow-navy font-light">Envíos</h1>
        <div className="text-right">
          <p className="font-montserrat text-[9px] tracking-widest uppercase text-gray-400">
            Zonas activas
          </p>
          <p className="font-cormorant text-2xl text-glow-navy">
            {activas} <span className="text-gray-300">/ {zonas.length}</span>
          </p>
        </div>
      </div>

      <p className="font-montserrat text-[11px] text-gray-400 mb-8 max-w-2xl leading-relaxed">
        El precio y el texto de cada zona los definís vos. Una zona sin nombre o desactivada no
        se ofrece en el checkout: al comprador se le avisa que no hay envío disponible a su
        dirección, en lugar de cobrarle cero.
      </p>

      <Seccion
        titulo="Buenos Aires"
        ayuda="Se detecta por código postal. Un CP bonaerense que no esté en GBA ni en GBA2 cae en “Resto de Buenos Aires”."
        zonas={buenosAires}
        onChange={actualizar}
      />

      <Seccion
        titulo="Resto del país"
        ayuda="Se detecta por la provincia que elige el comprador en el checkout."
        zonas={provincias}
        onChange={actualizar}
      />

      <div className="fixed bottom-0 left-56 right-0 bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-end gap-4">
        {msg && (
          <p
            className={`font-montserrat text-[11px] ${msg.ok ? 'text-green-600' : 'text-red-500'}`}
          >
            {msg.text}
          </p>
        )}
        <Button onClick={guardar} loading={saving} size="sm" variant="primary">
          Guardar cambios
        </Button>
      </div>
    </div>
  )
}

function Seccion({
  titulo,
  ayuda,
  zonas,
  onChange,
}: {
  titulo: string
  ayuda: string
  zonas: ZonaForm[]
  onChange: (id: string, cambios: Partial<ZonaForm>) => void
}) {
  return (
    <section className="mb-12">
      <h2 className="font-cormorant text-xl text-glow-navy mb-1">{titulo}</h2>
      <p className="font-montserrat text-[10px] text-gray-400 mb-5 max-w-2xl">{ayuda}</p>

      <div className="flex flex-col gap-4">
        {zonas.map((z) => (
          <div
            key={z.id}
            className={`border bg-white p-5 transition-colors ${
              z.activo ? 'border-glow-navy/30' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-baseline gap-3">
                <p className="font-montserrat text-[11px] tracking-widest uppercase text-glow-navy">
                  {z.etiqueta}
                </p>
                {z.codigosPostales && (
                  <span className="font-montserrat text-[10px] text-gray-400">
                    {z.codigosPostales.length} códigos postales
                  </span>
                )}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={z.activo}
                  onChange={(e) => onChange(z.id, { activo: e.target.checked })}
                  className="cursor-pointer accent-glow-navy"
                />
                <span className="font-montserrat text-[10px] tracking-wide uppercase text-gray-400">
                  {z.activo ? 'Activa' : 'Inactiva'}
                </span>
              </label>
            </div>

            <div className="grid md:grid-cols-[1fr_180px] gap-4">
              <div>
                <label className={LABEL}>Nombre</label>
                <input
                  value={z.nombre}
                  onChange={(e) => onChange(z.id, { nombre: e.target.value })}
                  placeholder="Envíos GBA | Rapiboy"
                  className={INPUT}
                />
                <p className="font-montserrat text-[10px] text-gray-400 mt-1">
                  Tus clientes verán el nombre de este método de envío.
                </p>
              </div>

              <div>
                <label className={LABEL}>Precio</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={z.precio}
                  onChange={(e) => onChange(z.id, { precio: e.target.value })}
                  placeholder="0"
                  className={INPUT}
                />
                <p className="font-montserrat text-[10px] text-gray-400 mt-1">
                  En 0 se cobra envío gratis.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className={LABEL}>Descripción</label>
              <textarea
                value={z.descripcion}
                onChange={(e) => onChange(z.id, { descripcion: e.target.value })}
                placeholder="Envíos en el día comprando antes de las 12hs. Llegan entre las 15 y las 20hs."
                rows={2}
                className={INPUT + ' resize-y'}
              />
            </div>

            {z.codigosPostales && (
              <details className="mt-4">
                <summary className="cursor-pointer font-montserrat text-[10px] tracking-widest uppercase text-glow-navy/50 hover:text-glow-navy transition-colors">
                  Ver los {z.codigosPostales.length} códigos postales
                </summary>
                <p className="mt-2 bg-gray-50 p-3 max-h-36 overflow-y-auto font-montserrat text-[10px] text-gray-500 leading-relaxed break-words">
                  {z.codigosPostales.join(' · ')}
                </p>
              </details>
            )}

            {z.id === 'bsas-resto' && (
              <p className="mt-4 font-montserrat text-[10px] text-gray-400 leading-relaxed">
                Cubre todo código postal bonaerense que no esté en GBA ni en GBA2, así que no
                tiene una lista propia.
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
