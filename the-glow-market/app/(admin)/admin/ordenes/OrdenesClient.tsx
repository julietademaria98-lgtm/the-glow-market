'use client'

import { useState } from 'react'
import { updateEstadoEnvio, resendOrderEmail } from '@/lib/admin/actions'

interface DatosEnvio {
  nombre: string
  apellido: string
  email: string
  telefono: string
  dni?: string
  direccion?: string
  ciudad?: string
  provincia?: string
  codigo_postal?: string
  notas?: string
}

interface Orden {
  id: string
  created_at: string
  estado: string
  estado_envio: string | null
  total: number
  costo_envio: number
  items: { nombre: string; cantidad: number; precio: number }[]
  datos_envio: DatosEnvio | null
  userEmail?: string | null
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
      {copiado ? '✓ Copiado' : 'Copiar para Andreani'}
    </button>
  )
}

function ReenviarEmailBtn({ ordenId }: { ordenId: string }) {
  const [estado, setEstado] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const handleClick = async () => {
    setEstado('loading')
    try {
      await resendOrderEmail(ordenId)
      setEstado('ok')
      setTimeout(() => setEstado('idle'), 3000)
    } catch {
      setEstado('error')
      setTimeout(() => setEstado('idle'), 3000)
    }
  }
  return (
    <button
      onClick={handleClick}
      disabled={estado === 'loading'}
      className="font-montserrat text-[9px] tracking-widest uppercase text-glow-navy/50 hover:text-glow-navy border border-glow-navy/20 px-2 py-1 transition-colors disabled:opacity-40"
    >
      {estado === 'loading' ? 'Enviando...' : estado === 'ok' ? '✓ Email enviado' : estado === 'error' ? 'Error al enviar' : 'Reenviar email'}
    </button>
  )
}

export default function OrdenesClient({ ordenes }: { ordenes: Orden[] }) {
  const [filtro, setFiltro] = useState<'todas' | 'aprobado' | 'pendiente'>('todas')
  const [expandida, setExpandida] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')

  const ordenesFiltradas = ordenes
    .filter(o => filtro === 'todas' || o.estado === filtro)
    .filter(o => {
      if (!busqueda.trim()) return true
      const q = busqueda.toLowerCase()
      const d = o.datos_envio
      return (
        o.id.slice(0, 8).toLowerCase().includes(q) ||
        (d?.nombre + ' ' + d?.apellido).toLowerCase().includes(q) ||
        d?.email?.toLowerCase().includes(q) ||
        o.userEmail?.toLowerCase().includes(q)
      )
    })

  const totalAprobado = ordenes.filter(o => o.estado === 'aprobado').reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-cormorant text-3xl text-glow-navy font-light">Órdenes</h1>
        <div className="text-right">
          <p className="font-montserrat text-[9px] tracking-widest uppercase text-gray-400">Total aprobado</p>
          <p className="font-cormorant text-2xl text-glow-navy">${totalAprobado.toLocaleString('es-AR')}</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, email o número de pedido..."
          className="flex-1 border border-gray-200 px-4 py-2 font-montserrat text-xs text-gray-700 placeholder:text-gray-300 outline-none focus:border-glow-navy/40 transition-colors bg-white"
        />
      </div>

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

      <div className="flex flex-col gap-3">
        {ordenesFiltradas.map(o => {
          const d = o.datos_envio
          const direccionCompleta = d?.direccion
            ? `${d.nombre} ${d.apellido}\nDNI: ${d.dni || '—'}\n${d.direccion}\n${d.ciudad}, ${d.provincia} (${d.codigo_postal})\nTel: ${d.telefono}\nEmail: ${d.email}`
            : ''

          return (
            <div key={o.id} className="bg-white rounded shadow-sm overflow-hidden">
              <div
                className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandida(expandida === o.id ? null : o.id)}
              >
                <div>
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
                      <p className="font-montserrat text-xs text-gray-700 font-medium">{d.nombre} {d.apellido}</p>
                      <p className="font-montserrat text-[9px] text-gray-400">{d.email}</p>
                    </div>
                  ) : (
                    <p className="font-montserrat text-[9px] text-gray-400">{o.userEmail || '—'}</p>
                  )}
                </div>

                <div className="text-right">
                  <p className="font-montserrat text-xs text-gray-700">${o.total.toLocaleString('es-AR')}</p>
                  <p className="font-montserrat text-[9px] text-gray-400">{(o.items || []).length} items</p>
                </div>

                <span className={`font-montserrat text-[9px] tracking-widest uppercase px-3 py-1 rounded-full ${ESTADO_COLORS[o.estado] || 'bg-gray-100 text-gray-500'}`}>
                  {o.estado}
                </span>

                <form action={updateEstadoEnvio.bind(null, o.id)} onClick={e => e.stopPropagation()}>
                  <select
                    name="estado_envio"
                    defaultValue={o.estado_envio || 'pendiente'}
                    onChange={e => e.currentTarget.form?.requestSubmit()}
                    className="font-montserrat text-[9px] tracking-wide uppercase rounded px-2 py-1 border border-gray-200 cursor-pointer bg-white text-gray-600"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="generado">Generado</option>
                    <option value="despachado">Despachado</option>
                    <option value="recibido">Recibido</option>
                  </select>
                </form>

                <span className="text-gray-300 text-xs">{expandida === o.id ? '▲' : '▼'}</span>
              </div>

              {expandida === o.id && (
                <div className="border-t border-gray-100 px-5 py-5 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50">
                  <div>
                    <p className="font-montserrat text-[9px] tracking-widest uppercase text-gray-400 mb-3">Datos de envío</p>
                    {d ? (
                      <div className="space-y-1.5">
                        {[
                          ['Nombre', `${d.nombre} ${d.apellido}`],
                          ['DNI', d.dni ?? '—'],
                          ['Email', d.email],
                          ['Teléfono', d.telefono],
                          ...(d.direccion ? [
                            ['Dirección', d.direccion],
                            ['Ciudad', d.ciudad ?? ''],
                            ['Provincia', d.provincia ?? ''],
                            ['Código Postal', d.codigo_postal ?? ''],
                          ] : []),
                          ...(d.notas ? [['Notas', d.notas]] : []),
                        ].map(([label, value]) => (
                          <div key={label} className="flex justify-between gap-4">
                            <span className="font-montserrat text-[10px] text-gray-400 shrink-0">{label}</span>
                            <span className="font-montserrat text-[10px] text-gray-700 text-right">{value}</span>
                          </div>
                        ))}
                        <div className="pt-3 flex gap-2">
                          {direccionCompleta && <CopiarBtn texto={direccionCompleta} />}
                          <ReenviarEmailBtn ordenId={o.id} />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="font-montserrat text-[10px] text-gray-400">Producto digital — sin dirección</p>
                        <ReenviarEmailBtn ordenId={o.id} />
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="font-montserrat text-[9px] tracking-widest uppercase text-gray-400 mb-3">Productos</p>
                    <div className="space-y-2">
                      {(o.items || []).map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="font-montserrat text-[10px] text-gray-700">{item.cantidad}x {item.nombre}</span>
                          <span className="font-montserrat text-[10px] text-gray-400">${(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
                        </div>
                      ))}
                      {(() => {
                        const subtotal = (o.items || []).reduce((acc: number, i: any) => acc + i.precio * i.cantidad, 0)
                        const envio = o.total - subtotal
                        if (envio > 0) return (
                          <div className="flex justify-between">
                            <span className="font-montserrat text-[10px] text-gray-500">Envío</span>
                            <span className="font-montserrat text-[10px] text-gray-500">${envio.toLocaleString('es-AR')}</span>
                          </div>
                        )
                        if (envio === 0 && o.datos_envio?.direccion) return (
                          <div className="flex justify-between">
                            <span className="font-montserrat text-[10px] text-gray-500">Envío</span>
                            <span className="font-montserrat text-[10px] text-green-600">Gratis</span>
                          </div>
                        )
                        return null
                      })()}
                      <div className="border-t border-gray-200 pt-2 flex justify-between">
                        <span className="font-montserrat text-[10px] font-medium text-gray-700">Total</span>
                        <span className="font-montserrat text-[10px] font-medium text-gray-700">${o.total.toLocaleString('es-AR')}</span>
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
            <p className="font-montserrat text-sm text-gray-400">
              {busqueda ? 'No se encontraron órdenes' : 'No hay órdenes'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
