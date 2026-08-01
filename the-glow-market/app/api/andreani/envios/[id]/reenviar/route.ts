import { NextResponse } from 'next/server'
import { getAdminOr401 } from '@/lib/admin/auth'
import { crearEnvio, type AndreaniConfig, type EnvioInput } from '@/lib/andreani'

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const auth = await getAdminOr401()
  if (!auth.ok) return auth.response

  const { data: envio } = await auth.db
    .from('andreani_envios')
    .select('*')
    .eq('id', params.id)
    .maybeSingle()
  if (!envio) return NextResponse.json({ ok: false, error: 'Envío no encontrado' }, { status: 404 })

  const input = envio.raw_request as EnvioInput | null
  if (!input) {
    return NextResponse.json({ ok: false, error: 'No hay datos para reintentar este envío' }, { status: 400 })
  }

  const { data: cfg } = await auth.db.from('andreani_config').select('*').eq('id', 'default').maybeSingle()
  if (!cfg) return NextResponse.json({ ok: false, error: 'Configurá Andreani primero' }, { status: 400 })

  try {
    const result = await crearEnvio(cfg as AndreaniConfig, input)
    const { data: row, error } = await auth.db
      .from('andreani_envios')
      .update({
        estado: 'creado',
        numero_andreani: result.numeroAndreani,
        agrupador: result.agrupadorDeBultos ?? null,
        etiquetas_link: result.etiquetasLink ?? null,
        raw_response: result.raw as Record<string, unknown>,
        error_message: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, envio: row })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error desconocido'
    console.error('Andreani reenviar error:', e)
    const { data: row } = await auth.db
      .from('andreani_envios')
      .update({ estado: 'error', error_message: message, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single()
    return NextResponse.json({ ok: false, error: message, envio: row }, { status: 502 })
  }
}
