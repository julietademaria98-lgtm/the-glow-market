'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'

interface Props {
  id: string
  estado: 'pendiente' | 'creado' | 'error'
  numeroAndreani: string | null
  etiquetasLink: string | null
}

interface Traza {
  fecha: string | null
  estado: string
  evento: string | null
  sucursal: string | null
}

interface DetalleEnvio {
  numero_andreani: string | null
  agrupador: string | null
  etiquetas_link: string | null
  error_message: string | null
  raw_request: Record<string, unknown> | null
  raw_response: unknown
  created_at: string
  updated_at: string | null
}

// Endpoint oficial confirmado (api-tracking.xlsx): GET /v2/envios/{n}/trazas.
const TRACKING_ENABLED = true

function Campo({ label, value }: { label: string; value: React.ReactNode }) {
  if (value == null || value === '') return null
  return (
    <div className="flex justify-between gap-4 py-1.5 border-b border-gray-50">
      <span className="font-montserrat text-[10px] tracking-wide uppercase text-gray-400">{label}</span>
      <span className="font-montserrat text-xs text-glow-navy text-right">{value}</span>
    </div>
  )
}

export default function EnvioAcciones({ id, estado, numeroAndreani, etiquetasLink }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Tracking
  const [trazas, setTrazas] = useState<Traza[] | null>(null)
  const [trackLoading, setTrackLoading] = useState(false)
  const [trackError, setTrackError] = useState<string | null>(null)
  const [showTrack, setShowTrack] = useState(false)

  // Detalle
  const [detalle, setDetalle] = useState<DetalleEnvio | null>(null)
  const [detLoading, setDetLoading] = useState(false)
  const [detError, setDetError] = useState<string | null>(null)
  const [showDet, setShowDet] = useState(false)

  async function reenviar() {
    setLoading(true)
    setError(null)
    const res = await fetch(`/api/andreani/envios/${id}/reenviar`, { method: 'POST' })
    const data = await res.json().catch(() => ({}))
    setLoading(false)
    if (!data.ok) {
      setError(data.error || 'Error al reenviar')
      return
    }
    router.refresh()
  }

  async function verTracking() {
    setShowTrack(true)
    setTrackLoading(true)
    setTrackError(null)
    setTrazas(null)
    const res = await fetch(`/api/andreani/envios/${id}/trazas`)
    const data = await res.json().catch(() => ({}))
    setTrackLoading(false)
    if (!data.ok) {
      setTrackError(data.error || 'Error al consultar el tracking')
      return
    }
    setTrazas(data.trazas || [])
  }

  async function verDetalle() {
    setShowDet(true)
    setDetLoading(true)
    setDetError(null)
    setDetalle(null)
    const res = await fetch(`/api/andreani/envios/${id}/detalle`)
    const data = await res.json().catch(() => ({}))
    setDetLoading(false)
    if (!data.ok) {
      setDetError(data.error || 'Error al consultar el detalle')
      return
    }
    setDetalle(data.detalle as DetalleEnvio)
  }

  const req = detalle?.raw_request ?? null
  const nombre = req ? [req.nombre, req.apellido].filter(Boolean).join(' ') : ''
  const num = (v: unknown) => (typeof v === 'number' ? v : Number(v) || 0)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        {estado === 'creado' && etiquetasLink && (
          <a
            href={`/api/andreani/envios/${id}/etiqueta`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-montserrat text-[10px] tracking-wide uppercase text-glow-navy underline hover:opacity-60"
          >
            Imprimir etiqueta
          </a>
        )}
        {estado === 'creado' && TRACKING_ENABLED && numeroAndreani && (
          <button
            type="button"
            onClick={verTracking}
            className="font-montserrat text-[10px] tracking-wide uppercase text-glow-navy underline hover:opacity-60"
          >
            Ver tracking
          </button>
        )}
        {estado === 'error' && (
          <button
            type="button"
            onClick={reenviar}
            disabled={loading}
            className="font-montserrat text-[10px] tracking-wide uppercase text-glow-navy underline hover:opacity-60 disabled:opacity-40"
          >
            {loading ? 'Reenviando…' : 'Reenviar'}
          </button>
        )}
        <button
          type="button"
          onClick={verDetalle}
          className="font-montserrat text-[10px] tracking-wide uppercase text-glow-navy underline hover:opacity-60"
        >
          Ver detalle
        </button>
      </div>
      {error && <p className="font-montserrat text-[9px] text-red-700 whitespace-pre-wrap">{error}</p>}

      {showTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-md p-6 max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cormorant text-2xl text-glow-navy">
                Tracking {numeroAndreani ? `· ${numeroAndreani}` : ''}
              </h3>
              <button
                type="button"
                onClick={() => setShowTrack(false)}
                className="font-montserrat text-[10px] tracking-wide uppercase text-gray-400 hover:text-gray-700"
              >
                Cerrar
              </button>
            </div>

            {trackLoading && <p className="font-montserrat text-xs text-gray-400">Consultando Andreani…</p>}
            {trackError && (
              <p className="font-montserrat text-[11px] text-red-700 whitespace-pre-wrap">{trackError}</p>
            )}
            {trazas && trazas.length === 0 && (
              <p className="font-montserrat text-xs text-gray-400">Todavía no hay movimientos.</p>
            )}
            {trazas && trazas.length > 0 && (
              <ol className="space-y-3">
                {trazas.map((t, i) => (
                  <li key={i} className="border-l-2 border-glow-navy/20 pl-3">
                    <p className="font-montserrat text-xs text-glow-navy">{t.estado}</p>
                    <p className="font-montserrat text-[10px] text-gray-400">
                      {t.fecha ? new Date(t.fecha).toLocaleString('es-AR') : ''}
                      {t.evento ? ` · ${t.evento}` : ''}
                      {t.sucursal ? ` · ${t.sucursal}` : ''}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}

      {showDet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-lg p-6 max-h-[85vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cormorant text-2xl text-glow-navy">
                Detalle del envío {numeroAndreani ? `· ${numeroAndreani}` : ''}
              </h3>
              <button
                type="button"
                onClick={() => setShowDet(false)}
                className="font-montserrat text-[10px] tracking-wide uppercase text-gray-400 hover:text-gray-700"
              >
                Cerrar
              </button>
            </div>

            {detLoading && <p className="font-montserrat text-xs text-gray-400">Cargando…</p>}
            {detError && (
              <p className="font-montserrat text-[11px] text-red-700 whitespace-pre-wrap">{detError}</p>
            )}

            {detalle && (
              <div className="flex flex-col gap-5">
                <section>
                  <p className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-gray-300 mb-1">Envío</p>
                  <Campo label="N° Andreani" value={detalle.numero_andreani} />
                  <Campo label="Agrupador" value={detalle.agrupador} />
                  <Campo
                    label="Etiqueta"
                    value={
                      detalle.etiquetas_link ? (
                        <a
                          href={detalle.etiquetas_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:opacity-60"
                        >
                          Abrir PDF
                        </a>
                      ) : null
                    }
                  />
                  <Campo label="Creado" value={new Date(detalle.created_at).toLocaleString('es-AR')} />
                  {detalle.error_message && (
                    <p className="font-montserrat text-[11px] text-red-700 mt-2 whitespace-pre-wrap">
                      {detalle.error_message}
                    </p>
                  )}
                </section>

                {req && (
                  <section>
                    <p className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-gray-300 mb-1">
                      Destinatario
                    </p>
                    <Campo label="Nombre" value={nombre} />
                    <Campo label="DNI" value={req.dni as string} />
                    <Campo label="Email" value={req.email as string} />
                    <Campo label="Teléfono" value={req.telefono as string} />
                  </section>
                )}

                {req && (
                  <section>
                    <p className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-gray-300 mb-1">
                      Dirección de entrega
                    </p>
                    <Campo label="Dirección" value={req.direccion as string} />
                    <Campo label="Localidad" value={req.localidad as string} />
                    <Campo label="Provincia" value={req.provincia as string} />
                    <Campo label="Código postal" value={req.cpDestino as string} />
                  </section>
                )}

                {req && (
                  <section>
                    <p className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-gray-300 mb-1">
                      Paquete
                    </p>
                    <Campo label="Peso" value={req.kilos ? `${req.kilos} kg` : null} />
                    <Campo label="Valor declarado" value={req.valorDeclarado ? formatPrice(num(req.valorDeclarado)) : null} />
                  </section>
                )}

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
