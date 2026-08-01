import { NextResponse } from 'next/server'
import { getAdminOr401 } from '@/lib/admin/auth'
import { cotizar, type AndreaniConfig } from '@/lib/andreani'

export async function POST(request: Request) {
  const auth = await getAdminOr401()
  if (!auth.ok) return auth.response

  const body = await request.json()
  const cpDestino = String(body.cpDestino || '').trim()
  const kilos = Number(body.kilos)
  const volumen = body.volumen ? Number(body.volumen) : undefined
  const valorDeclarado = Number(body.valorDeclarado)

  if (!cpDestino || !kilos || !valorDeclarado) {
    return NextResponse.json(
      { ok: false, error: 'Faltan datos: cpDestino, kilos y valorDeclarado son obligatorios' },
      { status: 400 },
    )
  }

  const { data: cfg, error } = await auth.db
    .from('andreani_config')
    .select('*')
    .eq('id', 'default')
    .maybeSingle()

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  if (!cfg) return NextResponse.json({ ok: false, error: 'Configurá Andreani primero' }, { status: 400 })

  try {
    const result = await cotizar(cfg as AndreaniConfig, { cpDestino, kilos, volumen, valorDeclarado })
    return NextResponse.json({ ok: true, ...result })
  } catch (e) {
    console.error('Andreani cotizar error:', e)
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Error desconocido' },
      { status: 502 },
    )
  }
}
