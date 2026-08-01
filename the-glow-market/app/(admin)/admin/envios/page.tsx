'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'

interface ZonaForm {
  id: string
  grupo: 'buenos-aires' | 'interior' | 'provincia'
  etiqueta: string
  /** Si esta zona se define por lista de CP (GBA y GBA2) o por provincia. */
  editaCodigosPostales: boolean
  /** CP separados por coma, tal como se editan en el textarea. */
  codigosPostales: string
  nombre: string
  descripcion: string
  precio: string
  activo: boolean
}

type Msg = { ok: boolean; text: string } | null

const INPUT =
  'border border-gray-200 focus:border-glow-navy outline-none px-3 py-2 font-montserrat text-sm text-glow-navy bg-white transition-colors w-full placeholder:text-gray-300'

const LABEL = 'font-montserrat text-[9px] tracking-widest uppercase text-gray-400 mb-1 block'

/** Cuenta los CP válidos que hay escritos en el textarea, para el contador del encabezado. */
function contarCodigos(texto: string): number {
  return (texto.match(/\d{4}/g) || []).length
}

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
      // Recargar en vez de asumir: el server apaga las zonas sin nombre y normaliza las
      // listas de CP, así que lo que queda en pantalla es lo que realmente se guardó.
      const recargadas = await fetch('/api/admin/envio-zonas').then((r) => r.json())
      if (recargadas.zonas) setZonas(recargadas.zonas)
      setMsg({ ok: true, text: 'Cambios guardados' })
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Error al guardar' })
    } finally {
      setSaving(false)
    }
  }

  const buenosAires = zonas.filter((z) => z.grupo === 'buenos-aires')
  const interior = zonas.filter((z) => z.grupo === 'interior')
  // Una provincia solo aparece si tiene precio propio: el resto se cobra con el del interior.
  const excepciones = zonas.filter((z) => z.grupo === 'provincia' && z.activo)
  const sinExcepcion = zonas.filter((z) => z.grupo === 'provincia' && !z.activo)
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
        titulo="Interior del país"
        ayuda="Un solo precio para todas las provincias. Es el que se cobra salvo que la provincia tenga una excepción cargada abajo."
        zonas={interior}
        onChange={actualizar}
      />

      <Excepciones
        excepciones={excepciones}
        disponibles={sinExcepcion}
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

/**
 * Precios que se apartan del interior. Vive aparte de `Seccion` porque acá no se edita el
 * texto del método: la provincia solo aporta un precio y hereda el resto del interior.
 */
function Excepciones({
  excepciones,
  disponibles,
  onChange,
}: {
  excepciones: ZonaForm[]
  disponibles: ZonaForm[]
  onChange: (id: string, cambios: Partial<ZonaForm>) => void
}) {
  const [eligiendo, setEligiendo] = useState(false)
  const [seleccion, setSeleccion] = useState('')

  function agregar() {
    if (!seleccion) return
    onChange(seleccion, { activo: true })
    setSeleccion('')
    setEligiendo(false)
  }

  return (
    <section className="mb-12">
      <h2 className="font-cormorant text-xl text-glow-navy mb-1">Precios por provincia</h2>
      <p className="font-montserrat text-[10px] text-gray-400 mb-5 max-w-2xl">
        Solo para las que no van al precio del interior, como Tierra del Fuego. Las que no estén
        acá se cobran con el precio de arriba, así cambiar el general es tocar un solo número.
      </p>

      {excepciones.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {excepciones.map((z) => (
            <div
              key={z.id}
              className="border border-glow-navy/30 bg-white px-5 py-3 flex items-center gap-4"
            >
              <p className="font-montserrat text-[11px] tracking-widest uppercase text-glow-navy flex-1">
                {z.etiqueta}
              </p>
              <div className="flex items-center gap-2">
                <span className="font-montserrat text-[10px] text-gray-400">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={z.precio}
                  onChange={(e) => onChange(z.id, { precio: e.target.value })}
                  className={INPUT + ' w-32'}
                />
              </div>
              <button
                type="button"
                onClick={() => onChange(z.id, { activo: false })}
                className="font-montserrat text-[10px] tracking-wide uppercase text-gray-400 hover:text-red-500 transition-colors"
                title="Vuelve al precio del interior"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
      )}

      {eligiendo ? (
        <div className="flex items-center gap-3">
          <select
            value={seleccion}
            onChange={(e) => setSeleccion(e.target.value)}
            className={INPUT + ' cursor-pointer max-w-xs'}
          >
            <option value="">Elegí una provincia…</option>
            {disponibles.map((z) => (
              <option key={z.id} value={z.id}>
                {z.etiqueta}
              </option>
            ))}
          </select>
          <Button onClick={agregar} size="sm" variant="primary" disabled={!seleccion}>
            Agregar
          </Button>
          <button
            type="button"
            onClick={() => {
              setEligiendo(false)
              setSeleccion('')
            }}
            className="font-montserrat text-[10px] tracking-wide uppercase text-gray-400 hover:text-glow-navy"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setEligiendo(true)}
          disabled={disponibles.length === 0}
          className="font-montserrat text-[11px] tracking-wide text-glow-navy hover:opacity-60 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
        >
          + Precio por provincia
        </button>
      )}
    </section>
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
                {z.editaCodigosPostales && (
                  <span className="font-montserrat text-[10px] text-gray-400">
                    {contarCodigos(z.codigosPostales)} códigos postales
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

            {z.editaCodigosPostales && (
              <details className="mt-4">
                <summary className="cursor-pointer font-montserrat text-[10px] tracking-widest uppercase text-glow-navy/50 hover:text-glow-navy transition-colors">
                  Editar los {contarCodigos(z.codigosPostales)} códigos postales
                </summary>
                <div className="mt-2">
                  <textarea
                    value={z.codigosPostales}
                    onChange={(e) => onChange(z.id, { codigosPostales: e.target.value })}
                    rows={6}
                    spellCheck={false}
                    placeholder="1602, 1603, 1604…"
                    className={INPUT + ' resize-y font-mono text-[11px] leading-relaxed'}
                  />
                  <p className="font-montserrat text-[10px] text-gray-400 mt-1">
                    Uno cada 4 dígitos, separados por coma, espacio o renglón. Lo que no sea un
                    código de 4 dígitos se descarta al guardar, y los repetidos se unifican.
                  </p>
                </div>
              </details>
            )}

            {z.editaCodigosPostales && !z.activo && (
              <p className="mt-4 font-montserrat text-[10px] text-glow-navy/50 leading-relaxed">
                Con la zona apagada, estos códigos postales se cobran como “Resto de Buenos
                Aires”. Se dejan de tratar aparte, pero se sigue enviando ahí.
              </p>
            )}

            {z.id === 'bsas-resto' && (
              <p className="mt-4 font-montserrat text-[10px] text-gray-400 leading-relaxed">
                Cubre todo código postal bonaerense que no esté en GBA ni en GBA2, y también los
                de las zonas que estén apagadas. Por eso no tiene una lista propia.
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
