import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { codigo } = await request.json()
  if (!codigo) return NextResponse.json({ error: 'Código requerido' }, { status: 400 })

  const { data: cupon } = await db
    .from('cupones')
    .select('*')
    .eq('codigo', codigo.toUpperCase().trim())
    .eq('activo', true)
    .single()

  if (!cupon) return NextResponse.json({ error: 'Código inválido' }, { status: 404 })

  if (cupon.usos_maximos && cupon.usos_actuales >= cupon.usos_maximos) {
    return NextResponse.json({ error: 'Este código ya no está disponible' }, { status: 400 })
  }

  return NextResponse.json({
    valido: true,
    codigo: cupon.codigo,
    descuento: cupon.descuento_porcentaje,
  })
}
