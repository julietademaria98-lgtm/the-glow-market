import { NextResponse } from 'next/server'
import { getAdminOr401 } from '@/lib/admin/auth'
import { crearEnvio, envioInputFromDatosEnvio, type AndreaniConfig } from '@/lib/andreani'
import type { DatosEnvio } from '@/types'

export async function POST(request: Request) {
  const auth = await getAdminOr401()
  if (!auth.ok) return auth.response

  const body = await request.json().catch(() => ({}))
  const ordenId = String(body.ordenId || '')
  const kilos = Number(body.kilos)
  const dni = String(body.dni || '').trim()
  const valorDeclarado = Number(body.valorDeclarado)

  if (!ordenId) return NextResponse.json({ ok: false, error: 'Falta la orden' }, { status: 400 })
  if (!kilos || kilos <= 0) return NextResponse.json({ ok: false, error: 'Peso inválido' }, { status: 400 })
  if (!dni) return NextResponse.json({ ok: false, error: 'Falta el DNI del destinatario' }, { status: 400 })

  // Config de Andreani
  const { data: cfg } = await auth.db.from('andreani_config').select('*').eq('id', 'default').maybeSingle()
  if (!cfg) return NextResponse.json({ ok: false, error: 'Configurá Andreani primero' }, { status: 400 })

  // Orden + datos de envío
  const { data: orden } = await auth.db
    .from('ordenes')
    .select('id, total, datos_envio')
    .eq('id', ordenId)
    .maybeSingle()
  if (!orden) return NextResponse.json({ ok: false, error: 'Orden no encontrada' }, { status: 404 })

  const datos = orden.datos_envio as DatosEnvio | null
  if (!datos) return NextResponse.json({ ok: false, error: 'La orden no tiene datos de envío' }, { status: 400 })

  const input = envioInputFromDatosEnvio(datos, {
    kilos,
    dni,
    valorDeclarado: valorDeclarado > 0 ? valorDeclarado : orden.total,
  })

  const baseRow = {
    orden_id: ordenId,
    cliente_nombre: `${datos.nombre} ${datos.apellido}`.trim(),
    cliente_email: datos.email,
    cp_destino: datos.codigo_postal,
    kilos: input.kilos,
    valor_declarado: input.valorDeclarado,
    dni_destino: dni,
    raw_request: input as unknown as Record<string, unknown>,
    updated_at: new Date().toISOString(),
  }

  try {
    const result = await crearEnvio(cfg as AndreaniConfig, input)
    const { data: row, error } = await auth.db
      .from('andreani_envios')
      .insert({
        ...baseRow,
        estado: 'creado',
        numero_andreani: result.numeroAndreani,
        agrupador: result.agrupadorDeBultos ?? null,
        etiquetas_link: result.etiquetasLink ?? null,
        raw_response: result.raw as Record<string, unknown>,
        error_message: null,
      })
      .select()
      .single()
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, envio: row })
  } catch (e) {
    // Nunca perdemos el envío: queda registrado en estado 'error' para reintentar.
    const message = e instanceof Error ? e.message : 'Error desconocido'
    console.error('Andreani crearEnvio error:', e)
    const { data: row } = await auth.db
      .from('andreani_envios')
      .insert({ ...baseRow, estado: 'error', error_message: message })
      .select()
      .single()
    return NextResponse.json({ ok: false, error: message, envio: row }, { status: 502 })
  }
}
