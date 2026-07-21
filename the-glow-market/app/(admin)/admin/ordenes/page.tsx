import { createClient as createServiceClient } from '@supabase/supabase-js'
import { updateEstadoOrden } from '@/lib/admin/actions'
import type { Orden } from '@/types'

async function getOrdenes() {
  const db = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const [ordenesRes, { data: authData }] = await Promise.all([
    db.from('ordenes').select('*').order('created_at', { ascending: false }).limit(100),
    db.auth.admin.listUsers(),
  ])
  const users = authData?.users || []
  const ordenes = (ordenesRes.data || []) as Orden[]
  return ordenes.map((o) => ({
    ...o,
    userEmail: users.find((u) => u.id === o.user_id)?.email || null,
  }))
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
    <div className="p-8">
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
                    <p className="font-montserrat text-[9px] text-gray-400">{(o as any).userEmail || '—'}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-0.5">
                    {(o.items || []).map((item: any, i: number) => (
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
                  <form action={updateEstadoOrden.bind(null, o.id)} className="flex items-center gap-2">
                    <select
                      name="estado"
                      defaultValue={o.estado}
                      className="text-[9px] font-montserrat tracking-wide uppercase rounded px-2 py-1 border border-gray-200 cursor-pointer bg-white"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="aprobado">Aprobado</option>
                      <option value="en_proceso">En proceso</option>
                      <option value="rechazado">Rechazado</option>
                    </select>
                    <button type="submit" className="font-montserrat text-[9px] text-glow-navy hover:underline">
                      ✓
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {ordenes.length === 0 && (
          <div className="text-center py-16">
            <p className="font-montserrat text-sm text-gray-400">No hay órdenes aún</p>
          </div>
        )}
      </div>
    </div>
  )
}
