export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('t')
  if (!token) return NextResponse.json({ error: 'Token requerido' }, { status: 400 })

  const db = createAdminClient()
  await db.from('leads').update({ unsubscribed: true }).eq('token', token)

  return new NextResponse(
    `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Dado de baja</title></head>
    <body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#e9e2da">
    <p style="font-size:18px;color:#192149">Te diste de baja correctamente. No vas a recibir más mails de The Glow Market.</p>
    </body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  )
}
