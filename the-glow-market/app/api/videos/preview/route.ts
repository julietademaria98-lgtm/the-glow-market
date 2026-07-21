import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
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
    const { cursoId } = await request.json()
    if (!cursoId) return NextResponse.json({ error: 'cursoId requerido' }, { status: 400 })

    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: leccion, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', cursoId)
      .eq('es_preview', true)
      .order('orden', { ascending: true })
      .limit(1)
      .single()

    if (error || !leccion) {
      return NextResponse.json({ error: 'Sin video preview' }, { status: 404 })
    }

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: leccion.video_path,
    })

    const url = await getSignedUrl(r2, command, { expiresIn: 3600 })
    return NextResponse.json({ url })
  } catch (err) {
    console.error('Error en preview:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
