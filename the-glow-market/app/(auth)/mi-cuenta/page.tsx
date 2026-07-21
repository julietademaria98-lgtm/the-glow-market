import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import StarIcon from '@/components/ui/StarIcon'
import type { Curso, Orden } from '@/types'
import { formatPrice } from '@/lib/utils'

async function getMiCuentaData(userId: string) {
  const supabase = await createClient()
  const [accesosRes, ordenesRes] = await Promise.all([
    supabase
      .from('accesos_curso')
      .select('*, cursos(*)')
      .eq('user_id', userId)
      .eq('activo', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('ordenes')
      .select('*')
      .eq('user_id', userId)
      .eq('estado', 'aprobado')
      .order('created_at', { ascending: false }),
  ])
  return {
    accesos: accesosRes.data || [],
    ordenes: (ordenesRes.data || []) as Orden[],
  }
}

export default async function MiCuentaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/mi-cuenta')

  const { accesos, ordenes } = await getMiCuentaData(user.id)

  return (
    <main className="min-h-screen bg-glow-cream pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">

        <div className="mb-12">
          <span className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-navy/40">
            Mi Cuenta
          </span>
          <h1 className="font-cormorant text-4xl md:text-5xl text-glow-navy font-light tracking-wide mt-1">
            Bienvenida
          </h1>
          <p className="font-montserrat text-xs text-glow-navy/50 mt-2">
            {user.email}
          </p>
        </div>

        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <StarIcon size={10} className="text-glow-navy/40" />
            <h2 className="font-montserrat text-[10px] tracking-[0.25em] uppercase text-glow-navy/60">
              Mis Cursos
            </h2>
          </div>
          {accesos.length === 0 ? (
            <div className="border border-glow-navy/10 p-8 text-center">
              <p className="font-cormorant text-xl text-glow-navy/40 mb-4">
                Todavía no tenés cursos
              </p>
              <Link
                href="/cursos"
                className="font-montserrat text-xs tracking-[0.2em] uppercase text-glow-navy border-b border-glow-navy/30 hover:border-glow-navy pb-0.5 transition-colors"
              >
                Ver cursos disponibles →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {accesos.map((acceso: any) => {
                const curso = acceso.cursos as Curso
                if (!curso) return null
                return (
                  <div
                    key={acceso.id}
                    className="border border-glow-navy/10 p-6 flex items-center justify-between gap-4 hover:border-glow-navy/20 transition-colors"
                  >
                    <div>
                      <p className="font-cormorant text-xl text-glow-navy font-light">
                        {curso.titulo}
                      </p>
                      {curso.descripcion && (
                        <p className="font-montserrat text-xs text-glow-navy/50 mt-1 line-clamp-1">
                          {curso.descripcion}
                        </p>
                      )}
                    </div>
                    <Link
                      href="/mi-curso"
                      className="flex-shrink-0 font-montserrat text-[10px] tracking-[0.2em] uppercase bg-glow-navy text-white px-5 py-2.5 hover:bg-glow-navy/80 transition-colors"
                    >
                      Acceder
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <StarIcon size={10} className="text-glow-navy/40" />
            <h2 className="font-montserrat text-[10px] tracking-[0.25em] uppercase text-glow-navy/60">
              Mis Pedidos
            </h2>
          </div>
          {ordenes.length === 0 ? (
            <div className="border border-glow-navy/10 p-8 text-center">
              <p className="font-cormorant text-xl text-glow-navy/40 mb-4">
                Todavía no realizaste pedidos
              </p>
              <Link
                href="/productos"
                className="font-montserrat text-xs tracking-[0.2em] uppercase text-glow-navy border-b border-glow-navy/30 hover:border-glow-navy pb-0.5 transition-colors"
              >
                Ver productos →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {ordenes.map((orden) => (
                <div key={orden.id} className="border border-glow-navy/10 p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-glow-navy/40">
                        Pedido #{orden.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="font-montserrat text-[10px] text-glow-navy/40 mt-1">
                        {new Date(orden.created_at).toLocaleDateString('es-AR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className="font-montserrat text-sm font-medium text-glow-navy">
                      {formatPrice(orden.total)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {orden.items?.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="font-cormorant text-base text-glow-navy/70">
                          {item.nombre}
                          {item.cantidad > 1 && (
                            <span className="font-montserrat text-xs text-glow-navy/40 ml-2">
                              x{item.cantidad}
                            </span>
                          )}
                        </span>
                        <span className="font-montserrat text-xs text-glow-navy/50">
                          {formatPrice(item.precio * item.cantidad)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="border-t border-glow-navy/10 pt-8 flex items-center justify-between">
          <Link
            href="/"
            className="font-montserrat text-xs tracking-[0.2em] uppercase text-glow-navy/40 hover:text-glow-navy transition-colors"
          >
            Volver al inicio
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="font-montserrat text-xs tracking-[0.2em] uppercase text-glow-navy/40 hover:text-glow-navy transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </div>

      </div>
    </main>
  )
}
