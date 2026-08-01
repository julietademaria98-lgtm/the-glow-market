import { NextResponse } from 'next/server'
import { getAdminOr401 } from '@/lib/admin/auth'
import { getEtiqueta, type AndreaniConfig } from '@/lib/andreani'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const auth = await getAdminOr401()
  if (!auth.ok) return auth.response

  const { data: envio } = await auth.db
    .from('andreani_envios')
    .select('numero_andreani, etiquetas_link')
    .eq('id', params.id)
    .maybeSingle()
  if (!envio?.etiquetas_link) {
    return NextResponse.json(
      { error: 'Este envío no tiene link de etiqueta (etiquetasPorAgrupador)' },
      { status: 400 },
    )
  }

  const { data: cfg } = await auth.db.from('andreani_config').select('*').eq('id', 'default').maybeSingle()
  if (!cfg) return NextResponse.json({ error: 'Configurá Andreani primero' }, { status: 400 })

  try {
    const { pdf, contentType } = await getEtiqueta(cfg as AndreaniConfig, envio.etiquetas_link)
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="etiqueta-${envio.numero_andreani || 'envio'}.pdf"`,
      },
    })
  } catch (e) {
    console.error('Andreani etiqueta error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error desconocido' },
      { status: 502 },
    )
  }
}
