'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

interface Orden {
  id: string
  created_at: string
  estado: string
  total: number
  items: { nombre: string; cantidad: number; precio: number }[]
  datos_envio: {
    nombre: string
    apellido: string
    email: string
    telefono: string
    direccion?: string
    ciudad?: string
    provincia?: string
    codigo_postal?: string
    notas?: string
  } | null
  userEmail?: string
}

const ESTADO_COLORS: Record<string, string> = {
  aprobado: 'bg-green-100 text-green-700',
  pendiente: 'bg-yellow-100 text-yellow-700',
  rechazado: 'bg-red-100 text-red-700',
  en_proceso: 'bg-blue-100 text-blue-700',
}

function CopiarBtn({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false)
  const copiar = () => {
    navigator.clipboard.writeText(texto)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }
  return (
    <button
      onClick={copiar}
      className="font-montserrat text-[9px] tracking-widest uppercase text-glow-navy/50 hover:text-glow-navy border border-glow-navy/20 px-2 py-1 transition-colors"
    >
      {copiado ? '✓ Copiado' : 'Copiar'}
    </button>
  )
}

export default function AdminOrdenesPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [filtro, setFiltro] = useState<'todas' | 'aprobado' | 'pendiente'>('todas')
  const [expandida, setExpandida] = useState<string | null>(null)

  useEffect(() => {
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    db.from('ordenes').select('*').order('created_at', { ascending: false }).limit(100)
      .then(({ data }) => setOrdenes((data || []) as Orden[]))
  }, [])

  const ordenesFiltradas = filtro === 'todas' ? ordenes : ordenes.filter(o => o.estado === filtro)

  const totalAprobado = ordenes
    .filter(o => o.estado === 'aprobado')
    .reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-cormorant text-3xl text-glow-navy font-light">Órdenes</h1>
        <div className="text-right">
          <p className="font-montserrat text-[9px] tracking-widest uppercase text-gray-400">Total aprobado</p>
          <p className="font-cormorant text-2xl text-glow-navy">${totalAprobado.toLocaleString('es-AR')}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {(['todas', 'aprobado', 'pendiente'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`font-montserrat text-[9px] tracking-widest uppercase px-4 py-2 transition-colors ${
              filtro === f ? 'bg-glow-navy text-white' : 'bg-white text-glow-navy/50 border border-glow-navy/20 hover:text-glow-navy'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-3">
        {ordenesFiltradas.map(o => {
          const d = o.datos_envio
          const direccionCompleta = d?.direccion
            ? `${d.nombre} ${d.apellido}\n${d.direccion}\n${d.ciudad}, ${d.provincia} (${d.codigo_postal})\nTel: ${d.telefono}\nEmail: ${d.email}`
            : ''
          const esFisica = o.items?.some((i: any) => i.tipo !== 'curso') || (d?.direccion)

          return (
            <div key={o.id} className="bg-white rounded shadow-sm overflow-hidden">
              {/* Fila principal */}
              <div
                className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandida(expandida === o.id ? null : o.id)}
              >
                <div className="text-left">
                  <p className="font-montserrat text-[10px] text-gray-400">
                    {new Date(o.created_at).toLocaleDateString('es-AR')}
                  </p>
                  <p className="font-montserrat text-[9px] text-gray-300">
                    #{o.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>

                <div>
                  {d ? (
                    <div>
                      <p className="font-montserrat text-xs text-gray-700 font-medium">
                        {d.nombre} {d.apellido}
                      </p>
                      <p className="font-montserrat text-[9px] text-gray-400">{d.email}</p>
                    </div>
                  ) : (
                    <p className="font-montserrat text-[9px] text-gray-400">{o.userEmail || '—'}</p>
                  )}
                </div>

                <div className="text-right">
                  <p className="font-montserrat text-xs text-gray-700">
                    ${o.total.toLocaleString('es-AR')}
                  </p>
                  <p className="font-montserrat text-[9px] text-gray-400">
                    {(o.items || []).length} item{(o.items || []).length !== 1 ? 's' : ''}
                  </p>
                </div>

                <span className={`font-montserrat text-[9px] tracking-widest uppercase px-3 py-1 rounded-full ${ESTADO_COLORS[o.estado] || 'bg-gray-100 text-gray-500'}`}>
                  {o.estado}
                </span>

                <span className="text-gray-300 text-xs">{expandida === o.id ? '▲' : '▼'}</span>
              </div>

              {/* Detalle expandido */}
              {expandida === o.id && (
                <div className="border-t border-gray-100 px-5 py-5 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50">
                  {/* Datos de envío */}
                  <div>
                    <p className="font-montserrat text-[9px] tracking-widest uppercase text-gray-400 mb-3">
                      Datos de envío
                    </p>
                    {d ? (
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="font-montserrat text-[10px] text-gray-400">Nombre</span>
                          <span className="font-montserrat text-[10px] text-gray-700">{d.nombre} {d.apellido}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-montserrat text-[10px] text-gray-400">Email</span>
                          <span className="font-montserrat text-[10px] text-gray-700">{d.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-montserrat text-[10px] text-gray-400">Teléfono</span>
                          <span className="font-montserrat text-[10px] text-gray-700">{d.telefono}</span>
                        </div>
                        {d.direccion && (
                          <>
                            <div className="flex justify-between">
                              <span className="font-montserrat text-[10px] text-gray-400">Dirección</span>
                              <span className="font-montserrat text-[10px] text-gray-700">{d.direccion}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-montserrat text-[10px] text-gray-400">Ciudad</span>
                              <span className="font-montserrat text-[10px] text-gray-700">{d.ciudad}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-montserrat text-[10px] text-gray-400">Provincia</span>
                              <span className="font-montserrat text-[10px] text-gray-700">{d.provincia}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-montserrat text-[10px] text-gray-400">Código Postal</span>
                              <span className="font-montserrat text-[10px] text-gray-700">{d.codigo_postal}</span>
                            </div>
                          </>
                        )}
                        {d.notas && (
                          <div className="flex justify-between">
                            <span className="font-montserrat text-[10px] text-gray-400">Notas</span>
                            <span className="font-montserrat text-[10px] text-gray-700 max-w-[200px] text-right">{d.notas}</span>
                          </div>
                        )}
                        {direccionCompleta && (
                          <div className="pt-3">
                            <CopiarBtn texto={direccionCompleta} />
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="font-montserrat text-[10px] text-gray-400">Sin datos de envío (producto digital)</p>
                    )}
                  </div>

                  {/* Productos */}
                  <div>
                    <p className="font-montserrat text-[9px] tracking-widest uppercase text-gray-400 mb-3">
                      Productos
                    </p>
                    <div className="space-y-2">
                      {(o.items || []).map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="font-montserrat text-[10px] text-gray-700">
                            {item.cantidad}x {item.nombre}
                          </span>
                          <span className="font-montserrat text-[10px] text-gray-400">
                            ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-2 flex justify-between">
                        <span className="font-montserrat text-[10px] font-medium text-gray-700">Total</span>
                        <span className="font-montserrat text-[10px] font-medium text-gray-700">
                          ${o.total.toLocaleString('es-AR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {ordenesFiltradas.length === 0 && (
          <div className="text-center py-16 bg-white rounded shadow-sm">
            <p className="font-montserrat text-sm text-gray-400">No hay órdenes</p>
          </div>
        )}
      </div>
    </div>
  )
}
