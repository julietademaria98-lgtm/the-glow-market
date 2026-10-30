import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

interface Review {
  id: string
  nombre: string
  instagram: string | null
  rating: number
  texto: string
  cupon_codigo: string | null
  aprobado: boolean
  created_at: string
}

async function approveReview(id: string) {
  'use server'
  const db = createAdminClient()
  await db.from('reviews').update({ aprobado: true }).eq('id', id)
  revalidatePath('/admin/resenas')
}

function ReviewCard({ r, showApprove }: { r: Review; showApprove: boolean }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>{r.nombre}</p>
          {r.instagram && <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{r.instagram}</p>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {[1,2,3,4,5].map((s) => (
            <span key={s} style={{ color: s <= r.rating ? '#192149' : '#d1d5db', fontSize: 18 }}>{s <= r.rating ? '★' : '☆'}</span>
          ))}
          {showApprove && (
            <form action={approveReview.bind(null, r.id)}>
              <button type="submit" style={{ marginLeft: 12, background: '#192149', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13, cursor: 'pointer' }}>
                Aprobar
              </button>
            </form>
          )}
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#374151' }}>{r.texto}</p>
      {r.cupon_codigo && (
        <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>Cupón: <strong>{r.cupon_codigo}</strong></p>
      )}
      <p style={{ margin: 0, fontSize: 11, color: '#d1d5db' }}>{new Date(r.created_at).toLocaleDateString('es-AR')}</p>
    </div>
  )
}

export default async function ResenasAdminPage() {
  const db = createAdminClient()
  const { data } = await db
    .from('reviews')
    .select('id, nombre, instagram, rating, texto, cupon_codigo, aprobado, created_at')
    .order('created_at', { ascending: false })

  const reviews = (data ?? []) as Review[]
  const pendientes = reviews.filter((r) => !r.aprobado)
  const aprobadas = reviews.filter((r) => r.aprobado)

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 300, color: '#192149', marginBottom: 32 }}>Reseñas</h1>

      {pendientes.length > 0 && (
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 16 }}>
            Pendientes ({pendientes.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {pendientes.map((r) => <ReviewCard key={r.id} r={r} showApprove={true} />)}
          </div>
        </section>
      )}

      {aprobadas.length > 0 && (
        <section>
          <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 16 }}>
            Aprobadas ({aprobadas.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {aprobadas.map((r) => <ReviewCard key={r.id} r={r} showApprove={false} />)}
          </div>
        </section>
      )}

      {reviews.length === 0 && (
        <p style={{ color: '#9ca3af', fontSize: 16 }}>Todavía no hay reseñas.</p>
      )}
    </div>
  )
}
