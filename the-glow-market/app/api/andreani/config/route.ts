import { NextResponse } from 'next/server'
import { getAdminOr401 } from '@/lib/admin/auth'

const MASK = '••••••••'

export async function GET() {
  const auth = await getAdminOr401()
  if (!auth.ok) return auth.response

  const { data, error } = await auth.db
    .from('andreani_config')
    .select('*')
    .eq('id', 'default')
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ config: null })

  return NextResponse.json({ config: { ...data, password: MASK } })
}

export async function POST(request: Request) {
  const auth = await getAdminOr401()
  if (!auth.ok) return auth.response

  const body = await request.json()
  const patch: Record<string, unknown> = {
    id: 'default',
    entorno: body.entorno,
    base_url: String(body.base_url || '').trim(),
    usuario: String(body.usuario || '').trim(),
    contrato: String(body.contrato || '').trim(),
    cp_origen: String(body.cp_origen || '').trim(),
    sucursal_origen: body.sucursal_origen ? String(body.sucursal_origen).trim() : null,
    tipo_servicio: body.tipo_servicio ? String(body.tipo_servicio).trim() : null,
    sucursal_cliente_id: body.sucursal_cliente_id ? String(body.sucursal_cliente_id).trim() : null,
    peso_default_kg: body.peso_default_kg ? Number(body.peso_default_kg) : 0.5,
    costo_envio_fallback: body.costo_envio_fallback ? Number(body.costo_envio_fallback) : 0,
    updated_at: new Date().toISOString(),
  }

  // Solo pisar password si el usuario mandó una nueva (no vacía ni la máscara).
  if (body.password && body.password !== MASK) {
    patch.password = String(body.password)
  }

  const { data: existing } = await auth.db
    .from('andreani_config')
    .select('id')
    .eq('id', 'default')
    .maybeSingle()

  if (!existing && !patch.password) {
    return NextResponse.json(
      { error: 'La contraseña es obligatoria la primera vez' },
      { status: 400 },
    )
  }

  const { error } = await auth.db.from('andreani_config').upsert(patch)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
