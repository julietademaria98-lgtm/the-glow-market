'use server'

import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const ADMIN_EMAIL = 'julietademaria98@gmail.com'

function getAdminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) throw new Error('No autorizado')
  return getAdminClient()
}

function toSlug(nombre: string) {
  return nombre
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export async function createProducto(formData: FormData) {
  const db = await checkAdmin()
  const nombre = formData.get('nombre') as string

  const { data, error } = await db.from('productos').insert({
    nombre,
    slug: toSlug(nombre) + '-' + Date.now(),
    descripcion: (formData.get('descripcion') as string) || null,
    precio: Number(formData.get('precio')),
    precio_oferta: formData.get('precio_oferta') ? Number(formData.get('precio_oferta')) : null,
    categoria: formData.get('categoria') as string,
    material: (formData.get('material') as string) || null,
    dimensiones: (formData.get('dimensiones') as string) || null,
    stock: Number(formData.get('stock')) || 0,
    activo: formData.get('activo') === 'on',
    destacado: formData.get('destacado') === 'on',
  }).select().single()

  if (error) throw new Error(error.message)

  const imageUrl = formData.get('imagen_url') as string
  if (imageUrl) {
    await db.from('producto_imagenes').insert({
      producto_id: data.id,
      url: imageUrl,
      orden: 0,
      es_principal: true,
    })
  }

  revalidatePath('/admin/productos')
  revalidatePath('/productos')
  redirect('/admin/productos')
}

export async function updateProducto(id: string, formData: FormData) {
  const db = await checkAdmin()

  const { error } = await db.from('productos').update({
    nombre: formData.get('nombre') as string,
    descripcion: (formData.get('descripcion') as string) || null,
    precio: Number(formData.get('precio')),
    precio_oferta: formData.get('precio_oferta') ? Number(formData.get('precio_oferta')) : null,
    categoria: formData.get('categoria') as string,
    material: (formData.get('material') as string) || null,
    dimensiones: (formData.get('dimensiones') as string) || null,
    stock: Number(formData.get('stock')) || 0,
    activo: formData.get('activo') === 'on',
    destacado: formData.get('destacado') === 'on',
  }).eq('id', id)

  if (error) throw new Error(error.message)

  const imageUrl = formData.get('imagen_url') as string
  if (imageUrl) {
    await db.from('producto_imagenes').delete().eq('producto_id', id)
    await db.from('producto_imagenes').insert({
      producto_id: id,
      url: imageUrl,
      orden: 0,
      es_principal: true,
    })
  }

  revalidatePath('/admin/productos')
  revalidatePath('/productos')
  redirect('/admin/productos')
}

export async function deleteProductoFromForm(formData: FormData) {
  const db = await checkAdmin()
  const id = formData.get('id') as string
  await db.from('producto_imagenes').delete().eq('producto_id', id)
  await db.from('productos').delete().eq('id', id)
  revalidatePath('/admin/productos')
  revalidatePath('/productos')
}

export async function toggleActivoFromForm(formData: FormData) {
  const db = await checkAdmin()
  const id = formData.get('id') as string
  const activo = formData.get('activo') === 'true'
  await db.from('productos').update({ activo }).eq('id', id)
  revalidatePath('/admin/productos')
  revalidatePath('/productos')
}

export async function updateCurso(id: string, formData: FormData) {
  const db = await checkAdmin()

  const { error } = await db.from('cursos').update({
    titulo: formData.get('titulo') as string,
    descripcion: (formData.get('descripcion') as string) || null,
    descripcion_larga: (formData.get('descripcion_larga') as string) || null,
    precio: Number(formData.get('precio')),
    precio_oferta: formData.get('precio_oferta') ? Number(formData.get('precio_oferta')) : null,
    imagen_url: (formData.get('imagen_url') as string) || null,
    activo: formData.get('activo') === 'on',
  }).eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/cursos')
  revalidatePath('/cursos')
  redirect('/admin/cursos')
}

export async function updateLeccion(id: string, formData: FormData) {
  const db = await checkAdmin()

  const { error } = await db.from('lecciones').update({
    titulo: formData.get('titulo') as string,
    descripcion: (formData.get('descripcion') as string) || null,
    video_path: formData.get('video_path') as string,
    duracion: (formData.get('duracion') as string) || null,
    orden: Number(formData.get('orden')),
    modulo: (formData.get('modulo') as string) || null,
    es_preview: formData.get('es_preview') === 'on',
  }).eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/cursos')
}

export async function grantAccesoFromForm(formData: FormData) {
  const db = await checkAdmin()
  const userId = formData.get('user_id') as string
  const cursoId = formData.get('curso_id') as string
  await db.from('accesos_curso').upsert({
    user_id: userId,
    curso_id: cursoId,
    activo: true,
  }, { onConflict: 'user_id,curso_id' })
  revalidatePath('/admin/cursos')
}

export async function revokeAcceso(id: string) {
  const db = await checkAdmin()
  await db.from('accesos_curso').update({ activo: false }).eq('id', id)
  revalidatePath('/admin/cursos')
}
