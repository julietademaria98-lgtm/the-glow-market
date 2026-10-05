export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import OrdenesClient from './OrdenesClient'

async function getOrdenes() {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [{ data: ordenes }, { data: authData }, { data: zonas }] = await Promise.all([
    db.from('ordenes').select('*').order('created_at', { ascending: false }).limit(100),
    db.auth.admin.listUsers(),
    db.from('envio_zonas').select('*').eq('activo', true).order('orden', { ascending: true }),
  ])

  const users = authData?.users || []

  return (ordenes || []).map((o: any) => {
    const cp = o.datos_envio?.codigo_postal?.toString().trim()
    const provincia = o.datos_envio?.provincia?.toString().trim()
    const soloDigital = (o.items || []).every((i: any) => i.tipo === 'curso')

    let costo_envio = 0
    if (!soloDigital && cp && zonas) {
      const zona = zonas.find((z: any) => {
        const cps: string[] = (z.codigos_postales || []).map((c: any) => c.toString().trim())
        const provs: string[] = (z.provincias || []).map((p: any) => p.toString().trim().toLowerCase())
        if (cps.length > 0 && cps.includes(cp)) return true
        if (provs.length > 0 && provincia && provs.includes(provincia.toLowerCase())) return true
        return false
      }) || zonas[zonas.length - 1]

      if (zona) {
        const subtotal = (o.items || []).reduce((acc: number, i: any) => acc + i.precio * i.cantidad, 0)
        if (zona.envio_gratis && zona.envio_gratis_desde && subtotal >= zona.envio_gratis_desde) {
          costo_envio = 0
        } else {
          costo_envio = zona.precio || 0
        }
      }
    }

    return {
      ...o,
      costo_envio,
      userEmail: users.find((u: any) => u.id === o.user_id)?.email || null,
    }
  })
}

export default async function AdminOrdenesPage() {
  const ordenes = await getOrdenes()
  return <OrdenesClient ordenes={ordenes} />
}
