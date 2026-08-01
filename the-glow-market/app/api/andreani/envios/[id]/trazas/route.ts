import { NextResponse } from 'next/server'
import { getAdminOr401 } from '@/lib/admin/auth'
import { getTrazas, type AndreaniConfig } from '@/lib/andreani'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const auth = await getAdminOr401()
  if (!auth.ok) return auth.response

  const { data: envio } = await auth.db
    .from('andreani_envios')
    .select('numero_andreani')
    .eq('id', params.id)
    .maybeSingle()
  if (!envio?.numero_andreani) {
    return NextResponse.json({ ok: false, error: 'El envío no tiene número de Andreani' }, { status: 400 })
  }

  const { data: cfg } = await auth.db.from('andreani_config').select('*').eq('id', 'default').maybeSingle()
  if (!cfg) return NextResponse.json({ ok: false, error: 'Configurá Andreani primero' }, { status: 400 })

  try {
    const trazas = await getTrazas(cfg as AndreaniConfig, envio.numero_andreani)
    return NextResponse.json({ ok: true, trazas })
  } catch (e) {
    console.error('Andreani trazas error:', e)
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Error desconocido' },
      { status: 502 },
    )
  }
}
