import { NextResponse } from 'next/server'
import { getAdminOr401 } from '@/lib/admin/auth'
import { ping, invalidateTokenCache, type AndreaniConfig } from '@/lib/andreani'

export async function POST() {
  const auth = await getAdminOr401()
  if (!auth.ok) return auth.response

  const { data: cfg, error } = await auth.db
    .from('andreani_config')
    .select('*')
    .eq('id', 'default')
    .maybeSingle()

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  if (!cfg) return NextResponse.json({ ok: false, error: 'Configurá Andreani primero' }, { status: 400 })

  try {
    invalidateTokenCache(cfg as AndreaniConfig)
    await ping(cfg as AndreaniConfig)
    return NextResponse.json({ ok: true, message: 'Conexión exitosa' })
  } catch (e) {
    console.error('Andreani ping error:', e)
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Error desconocido' },
      { status: 502 },
    )
  }
}
