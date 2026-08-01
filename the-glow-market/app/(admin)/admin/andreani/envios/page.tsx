import { createClient as createServiceClient } from '@supabase/supabase-js'
import EnvioAcciones from '@/components/admin/EnvioAcciones'

interface Envio {
  id: string
  orden_id: string | null
  cliente_nombre: string | null
  cliente_email: string | null
  cp_destino: string | null
  numero_andreani: string | null
  etiquetas_link: string | null
  estado: 'pendiente' | 'creado' | 'error'
  error_message: string | null
  created_at: string
}

async function getEnvios(): Promise<Envio[]> {
  const db = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const { data } = await db
    .from('andreani_envios')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  return (data || []) as Envio[]
}

const ESTADO_COLORS: Record<string, string> = {
  creado: 'bg-green-100 text-green-700',
  pendiente: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
}

export default async function AdminEnviosPage() {
  const envios = await getEnvios()

  return (
    <div className="p-8 pt-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-cormorant text-3xl text-glow-navy font-light">Envíos Andreani</h1>
        <p className="font-montserrat text-[10px] text-gray-400">
          Registro de respaldo de cada envío generado.
        </p>
      </div>

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Fecha', 'Cliente', 'N° pedido', 'CP', 'N° Andreani', 'Estado', 'Acciones'].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-montserrat text-[9px] tracking-[0.2em] uppercase text-gray-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {envios.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50 transition-colors align-top">
                <td className="px-4 py-3 font-montserrat text-[10px] text-gray-400">
                  {new Date(e.created_at).toLocaleDateString('es-AR')}
                </td>
                <td className="px-4 py-3">
                  <p className="font-montserrat text-xs text-gray-700">{e.cliente_nombre || '—'}</p>
                  <p className="font-montserrat text-[9px] text-gray-400">{e.cliente_email || ''}</p>
                </td>
                <td className="px-4 py-3 font-montserrat text-[10px] text-gray-500">
                  {e.orden_id ? e.orden_id.slice(0, 8) : '—'}
                </td>
                <td className="px-4 py-3 font-montserrat text-[10px] text-gray-600">{e.cp_destino || '—'}</td>
                <td className="px-4 py-3 font-montserrat text-[10px] text-gray-700">
                  {e.numero_andreani || '—'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded font-montserrat text-[9px] tracking-wide uppercase ${ESTADO_COLORS[e.estado] || 'bg-gray-100 text-gray-400'}`}
                  >
                    {e.estado}
                  </span>
                  {e.estado === 'error' && e.error_message && (
                    <p className="font-montserrat text-[9px] text-red-600 mt-1 max-w-[220px] truncate" title={e.error_message}>
                      {e.error_message}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <EnvioAcciones
                    id={e.id}
                    estado={e.estado}
                    numeroAndreani={e.numero_andreani}
                    etiquetasLink={e.etiquetas_link}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {envios.length === 0 && (
          <div className="text-center py-16">
            <p className="font-montserrat text-xs text-gray-400">Todavía no se generaron envíos</p>
          </div>
        )}
      </div>
    </div>
  )
}
