import { createClient as createServiceClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Package, BookOpen, ShoppingBag, Users } from 'lucide-react'

async function getStats() {
  const db = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [productos, cursos, ordenes, accesos] = await Promise.all([
    db.from('productos').select('id', { count: 'exact' }),
    db.from('cursos').select('id', { count: 'exact' }),
    db.from('ordenes').select('id', { count: 'exact' }),
    db.from('accesos_curso').select('id', { count: 'exact' }).eq('activo', true),
  ])

  return {
    productos: productos.count || 0,
    cursos: cursos.count || 0,
    ordenes: ordenes.count || 0,
    alumnas: accesos.count || 0,
  }
}

export default async function AdminPage() {
  const stats = await getStats()

  return (
    <div className="p-8">
      <h1 className="font-cormorant text-3xl text-glow-navy font-light mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Productos', value: stats.productos, icon: Package, href: '/admin/productos' },
          { label: 'Cursos', value: stats.cursos, icon: BookOpen, href: '/admin/cursos' },
          { label: 'Órdenes', value: stats.ordenes, icon: ShoppingBag, href: '/admin/ordenes' },
          { label: 'Alumnas activas', value: stats.alumnas, icon: Users, href: '/admin/cursos' },
        ].map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="bg-white p-6 rounded shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-gray-400">{label}</p>
              <Icon size={16} className="text-glow-navy/40" />
            </div>
            <p className="font-cormorant text-4xl text-glow-navy font-light">{value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: '/admin/productos/nuevo', label: '+ Nuevo Producto' },
          { href: '/admin/cursos', label: '→ Gestionar Cursos' },
          { href: '/admin/ordenes', label: '→ Ver Órdenes' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="bg-glow-navy text-white font-montserrat text-[11px] tracking-[0.2em] uppercase px-6 py-4 text-center hover:bg-glow-navy/80 transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
