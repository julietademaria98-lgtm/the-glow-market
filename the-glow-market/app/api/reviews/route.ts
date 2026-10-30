export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { randomBytes } from 'crypto'
import { sendCuponEmail } from '@/lib/email'

function generateCouponCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let suffix = ''
  const bytes = randomBytes(6)
  for (let i = 0; i < 6; i++) {
    suffix += chars[bytes[i] % chars.length]
  }
  return `GLOW15-${suffix}`
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticada' }, { status: 401 })

  const db = createAdminClient()

  // Check access to at least one course
  const { data: acceso } = await db
    .from('accesos_curso')
    .select('id')
    .eq('user_id', user.id)
    .eq('activo', true)
    .limit(1)
    .single()

  if (!acceso) return NextResponse.json({ error: 'Sin acceso al curso' }, { status: 403 })

  // One review per student
  const { data: existing } = await db
    .from('reviews')
    .select('id, cupon_codigo')
    .eq('user_id', user.id)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Ya enviaste tu reseña', codigo: existing.cupon_codigo }, { status: 409 })
  }

  const formData = await request.formData()
  const rating = Number(formData.get('rating'))
  const nombre = String(formData.get('nombre') ?? '').trim()
  const instagram = String(formData.get('instagram') ?? '').trim()
  const texto = String(formData.get('texto') ?? '').trim()
  const permisoTexto = formData.get('permiso_texto') === 'true'
  const permisoFoto = formData.get('permiso_foto') === 'true'
  const fotoFile = formData.get('foto') as File | null

  if (!rating || rating < 1 || rating > 5) return NextResponse.json({ error: 'Rating inválido' }, { status: 400 })
  if (!nombre || nombre.length < 2) return NextResponse.json({ error: 'Nombre inválido' }, { status: 400 })
  if (!texto || texto.length < 10) return NextResponse.json({ error: 'Texto demasiado corto' }, { status: 400 })

  // Upload photo if provided
  let fotoPath: string | null = null
  if (fotoFile && fotoFile.size > 0) {
    const ext = fotoFile.name.split('.').pop() ?? 'jpg'
    const path = `${user.id}/${Date.now()}.${ext}`
    const buffer = Buffer.from(await fotoFile.arrayBuffer())
    const { error: uploadError } = await db.storage
      .from('reviews-fotos')
      .upload(path, buffer, { contentType: fotoFile.type, upsert: false })
    if (!uploadError) fotoPath = path
  }

  // Generate unique coupon code
  let codigo: string
  let attempts = 0
  while (true) {
    codigo = generateCouponCode()
    const { data: taken } = await db.from('cupones').select('id').eq('codigo', codigo).single()
    if (!taken) break
    if (++attempts > 10) throw new Error('No se pudo generar código único')
  }

  // Insert coupon
  const { error: cuponError } = await db.from('cupones').insert({
    codigo,
    activo: true,
    usos_maximos: 1,
    usos_actuales: 0,
    descuento_porcentaje: 15,
  })
  if (cuponError) return NextResponse.json({ error: 'Error al generar cupón' }, { status: 500 })

  // Save review
  const { error: reviewError } = await db.from('reviews').insert({
    user_id: user.id,
    nombre,
    instagram: instagram || null,
    rating,
    texto,
    foto_path: fotoPath,
    permiso_texto: permisoTexto,
    permiso_foto: permisoFoto,
    aprobado: false,
    cupon_codigo: codigo,
  })
  if (reviewError) return NextResponse.json({ error: 'Error al guardar reseña' }, { status: 500 })

  // Send coupon email
  const { data: userData } = await supabase.auth.getUser()
  if (userData.user?.email) {
    try {
      await sendCuponEmail({ to: userData.user.email, nombre, codigo })
    } catch {
      // Email failure is non-fatal
    }
  }

  return NextResponse.json({ ok: true, codigo })
}
