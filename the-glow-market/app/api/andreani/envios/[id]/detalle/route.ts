import { NextResponse } from 'next/server'
import { getAdminOr401 } from '@/lib/admin/auth'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const auth = await getAdminOr401()
  if (!auth.ok) return auth.response

  const { data: envio, error } = await auth.db
    .from('andreani_envios')
    .select('numero_andreani, agrupador, etiquetas_link, error_message, raw_request, raw_response, created_at, updated_at')
    .eq('id', params.id)
    .maybeSingle()

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  if (!envio) return NextResponse.json({ ok: false, error: 'Envío no encontrado' }, { status: 404 })

  return NextResponse.json({ ok: true, detalle: envio })
}
