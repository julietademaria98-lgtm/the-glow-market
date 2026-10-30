export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { randomBytes } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendGuiaEmail } from '@/lib/email'
import { headers } from 'next/headers'

const schema = z.object({
  nombre: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254).transform(v => v.toLowerCase()),
})

// Simple in-memory rate limit: máximo 3 envíos por IP en 10 minutos
const ipBucket = new Map<string, { count: number; reset: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = ipBucket.get(ip)
  if (!entry || now > entry.reset) {
    ipBucket.set(ip, { count: 1, reset: now + 10 * 60 * 1000 })
    return false
  }
  if (entry.count >= 3) return true
  entry.count++
  return false
}

export async function POST(request: Request) {
  try {
    const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Demasiados intentos. Esperá unos minutos.' }, { status: 429 })
    }

    const parsed = schema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Revisá el nombre y el mail.' }, { status: 400 })
    }

    const { nombre, email } = parsed.data
    const token = randomBytes(48).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    const db = createAdminClient()

    // Upsert: si el mail ya existe, actualizar token y reenviar
    const { error } = await db.from('leads').upsert(
      {
        nombre,
        email,
        source: 'guia-infaltables',
        token,
        token_expires_at: expiresAt,
        dispositivos_usados: 0,
        unsubscribed: false,
      },
      { onConflict: 'email', ignoreDuplicates: false }
    )

    if (error) throw error

    await sendGuiaEmail({ to: email, nombre, token })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'No pudimos enviar la guía. Intentá de nuevo.' }, { status: 500 })
  }
}
