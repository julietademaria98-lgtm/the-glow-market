import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('suscriptoras')
    .insert({ email })

  if (error) {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
