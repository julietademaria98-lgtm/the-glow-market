import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: Request) {
  try {
    const { lessonId } = await request.json()

    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId requerido' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data: leccion, error: leccionError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('id', lessonId)
      .single()

    if (leccionError || !leccion) {
      return NextResponse.json({ error: 'Lección no encontrada' }, { status: 404 })
    }

    if (!leccion.es_preview) {
      const { data: acceso } = await supabase
        .from('accesos_curso')
        .select('id')
        .eq('user_id', user.id)
        .eq('curso_id', leccion.curso_id)
        .eq('activo', true)
        .single()

      if (!acceso) {
        return NextResponse.json({ error: 'Sin acceso al curso' }, { status: 403 })
      }
    }

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: leccion.video_path,
    })

    const url = await getSignedUrl(r2, command, { expiresIn: 7200 })

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Error en signed-url:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
