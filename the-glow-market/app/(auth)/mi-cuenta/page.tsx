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

        {/* Header */}
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

        {/* Mis Cursos */}
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
