import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const adminClient = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { lessonId } = await request.json()

    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId requerido' }, { status: 400 })
    }

    // Verificar autenticación del usuario
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener la lección con su curso
    const { data: leccion, error: leccionError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('id', lessonId)
      .single()

    if (leccionError || !leccion) {
      return NextResponse.json({ error: 'Lección no encontrada' }, { status: 404 })
    }

    // Si no es preview, verificar acceso al curso
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

    // Generar URL firmada que expira en 2 horas (7200 segundos)
    const { data: signedData, error: signedError } = await adminClient.storage
      .from('videos-privados')
      .createSignedUrl(leccion.video_path, 7200)

    if (signedError || !signedData?.signedUrl) {
      console.error('Error generando signed URL:', signedError)
      return NextResponse.json({ error: 'Error generando URL del video' }, { status: 500 })
    }

    return NextResponse.json({ url: signedData.signedUrl })
  } catch (error) {
    console.error('Error en signed-url:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
