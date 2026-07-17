import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import ComunidadClient from '@/components/courses/ComunidadClient'

async function checkAccess() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: acceso } = await supabase
    .from('accesos_curso')
    .select('id')
    .eq('user_id', user.id)
    .eq('activo', true)
    .single()

  if (!acceso) redirect('/cursos')
  return user
}

async function getPosts() {
  const db = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: posts } = await db
    .from('posts')
    .select('*, replies(*), likes(*)')
    .order('created_at', { ascending: false })

  const { data: authData } = await db.auth.admin.listUsers()
  const users = authData?.users || []

    return (posts || []).map((post) => ({
    ...post,
    email: users.find((u) => u.id === post.user_id)?.email,
    likes: (post.likes || []).length,
    liked_by_user: false,
    replies: (post.replies || []).map((r: any) => ({
      ...r,
      email: users.find((u) => u.id === r.user_id)?.email,
    })),
  }))
}

export default async function ComunidadPage() {
  const user = await checkAccess()
  const posts = await getPosts()

  return <ComunidadClient posts={posts} currentUserId={user.id} currentUserEmail={user.email || ''} />
}
