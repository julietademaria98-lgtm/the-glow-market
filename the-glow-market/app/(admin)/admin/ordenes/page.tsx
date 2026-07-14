import { createClient as createServiceClient } from '@supabase/supabase-js'
import type { Orden } from '@/types'

async function getOrdenes(): Promise<Orden[]> {
  const db = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await db
    .from('ordenes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  return (data || []) as Orden[]
}

const ESTADO_COLORS: Record<string, string> = {
  aprobado: 'bg-green-100 text-green-700',
  pendiente: 'bg-yellow-100 text-yellow-700',
  rechazado: 'bg-red-100 text-red-700',
  en_proceso: 'bg-blue-100 text-blue-700',
}

export default async function AdminOrdenesPage() {
  const ordenes = await getOrdenes()

  const total = ordenes
    .filter((o) => o.estado === 'aprobado')
    .reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="p-8 pt-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-cormorant text-3xl text-glow-navy font-light">Órdenes</h1>
        <div className="text-right">
          <p className="font-montserrat text-[9px] tracking-widest uppercase text-gray-400">Total aprobado</p>
          <p className="font-cormorant text-2xl text-glow-navy">${total.toLocaleString('es-AR')}</p>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Fecha', 'Cliente', 'Items', 'Total', 'Estado'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-montserrat text-[9px] tracking-[0.2em] uppercase text-gray-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ordenes.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-montserrat text-[10px] text-gray-400">
                  {new Date(o.created_at).toLocaleDateString('es-AR')}
                </td>
                <td className="px-4 py-3">
                  {o.datos_envio ? (
                    <div>
                      <p className="font-montserrat text-xs text-gray-700">
                        {o.datos_envio.nombre} {o.datos_envio.apellido}
                      </p>
                      <p className="font-montserrat text-[9px] text-gray-400">{o.datos_envio.email}</p>
                    </div>
                  ) : (
                    <span className="font-montserrat text-[10px] text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-0.5">
                    {(o.items || []).map((item, i) => (
                      <p key={i} className="font-montserrat text-[10px] text-gray-600">
                        {item.cantidad}x {item.nombre}
                      </p>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 font-montserrat text-xs text-gray-700">
                  ${o.total.toLocaleString('es-AR')}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded font-montserrat text-[9px] tracking-wide uppercase ${ESTADO_COLORS[o.estado] || 'bg-gray-100 text-gray-400'}`}>
                    {o.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {ordenes.length === 0 && (
          <div className="text-center py-16">
            <p className="font-montserrat text-xs text-gray-400">No hay órdenes aún</p>
          </div>
        )}
      </div>
    </div>
  )
}
