import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, BookOpen, ShoppingBag } from 'lucide-react'

const ADMIN_EMAIL = 'julietademaria98@gmail.com'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect('/')

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-56 bg-glow-navy min-h-screen flex flex-col fixed top-0 left-0 z-10">
        <div className="p-6 border-b border-white/10">
          <p className="font-cormorant text-white text-xl tracking-widest font-light">ADMIN</p>
          <p className="font-montserrat text-[9px] text-white/40 tracking-widest uppercase mt-1">The Glow Market</p>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {[
            { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/admin/productos', label: 'Productos', icon: Package },
            { href: '/admin/cursos', label: 'Cursos', icon: BookOpen },
            { href: '/admin/ordenes', label: 'Órdenes', icon: ShoppingBag },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded font-montserrat text-[11px] tracking-wide text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="font-montserrat text-[9px] text-white/30 tracking-widest truncate">
            {user.email}
          </p>
        </div>
      </aside>

      <main className="flex-1 ml-56 min-h-screen">
        {children}
      </main>
    </div>
  )
}
