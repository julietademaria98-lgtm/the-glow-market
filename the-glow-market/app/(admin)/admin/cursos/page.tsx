import { createClient as createServiceClient } from '@supabase/supabase-js'
import { updateCurso, updateLeccion, grantAccesoFromForm, revokeAcceso } from '@/lib/admin/actions'
import type { Curso, Leccion } from '@/types'

async function getData() {
  const db = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [cursosRes, accesosRes] = await Promise.all([
    db.from('cursos').select('*, lecciones(*)').order('created_at', { ascending: false }),
    db.from('accesos_curso').select('*, user:auth.users(email)').eq('activo', true),
  ])

  return {
    cursos: (cursosRes.data || []) as (Curso & { lecciones: Leccion[] })[],
    accesos: accesosRes.data || [],
  }
}

export default async function AdminCursosPage() {
  const { cursos, accesos } = await getData()

  return (
    <div className="p-8 space-y-10">
      <h1 className="font-cormorant text-3xl text-glow-navy font-light">Cursos</h1>

      {cursos.map((curso) => {
        const lecciones = (curso.lecciones || []).sort((a, b) => a.orden - b.orden)
        const cursosAccesos = accesos.filter((a: any) => a.curso_id === curso.id)

        return (
          <div key={curso.id} className="bg-white rounded shadow-sm overflow-hidden">
            {/* Curso header */}
            <div className="border-b border-gray-100 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-cormorant text-xl text-glow-navy font-light">{curso.titulo}</h2>
                  <p className="font-montserrat text-[10px] text-gray-400 mt-1">
                    ${curso.precio.toLocaleString('es-AR')}
                    {curso.precio_oferta ? ` → $${curso.precio_oferta.toLocaleString('es-AR')}` : ''} · {lecciones.length} lecciones · {cursosAccesos.length} alumnas
                  </p>
                </div>
                <details className="text-right">
                  <summary className="font-montserrat text-[10px] tracking-wide text-glow-navy cursor-pointer hover:underline">
                    Editar info
                  </summary>
                  <form action={updateCurso.bind(null, curso.id)} className="mt-4 text-left space-y-3 min-w-[300px]">
                    <input name="titulo" defaultValue={curso.titulo} className="admin-input" placeholder="Título" />
                    <textarea name="descripcion" defaultValue={curso.descripcion || ''} rows={2} className="admin-input" placeholder="Descripción corta" />
                    <input name="precio" type="number" defaultValue={curso.precio} className="admin-input" placeholder="Precio original" />
                    <input name="precio_oferta" type="number" defaultValue={curso.precio_oferta || ''} className="admin-input" placeholder="Precio con descuento (opcional)" />
                    <input name="imagen_url" defaultValue={curso.imagen_url || ''} className="admin-input" placeholder="URL imagen" />
                    <label className="flex items-center gap-2">
                      <input name="activo" type="checkbox" defaultChecked={curso.activo} />
                      <span className="font-montserrat text-[10px] text-gray-600">Activo</span>
                    </label>
                    <button type="submit" className="bg-glow-navy text-white font-montserrat text-[10px] tracking-wide uppercase px-4 py-2">
                      Guardar
                    </button>
                  </form>
                </details>
              </div>
            </div>

            {/* Lecciones */}
            <div className="p-6 border-b border-gray-100">
              <p className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-4">Lecciones</p>
              <div className="space-y-3">
                {lecciones.map((l) => (
                  <details key={l.id} className="border border-gray-100 rounded">
                    <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50">
                      <span className="font-montserrat text-[10px] text-gray-400 w-5">{l.orden}</span>
                      <span className="font-montserrat text-xs text-gray-700 flex-1">{l.titulo}</span>
                      <span className="font-montserrat text-[9px] text-gray-400">{l.duracion || '--'}</span>
                    </summary>
                    <form action={updateLeccion.bind(null, l.id)} className="p-4 pt-2 space-y-3 border-t border-gray-100">
                      <input name="titulo" defaultValue={l.titulo} className="admin-input" placeholder="Título" />
                      <input name="descripcion" defaultValue={l.descripcion || ''} className="admin-input" placeholder="Descripción" />
                      <input name="video_path" defaultValue={l.video_path} className="admin-input" placeholder="video_path (ej: modulo 1 baja.mp4)" />
                      <div className="flex gap-3">
                        <input name="orden" type="number" defaultValue={l.orden} className="admin-input w-24" placeholder="Orden" />
                        <input name="duracion" defaultValue={l.duracion || ''} className="admin-input w-24" placeholder="Duración" />
                        <input name="modulo" defaultValue={l.modulo || ''} className="admin-input flex-1" placeholder="Nombre del módulo" />
                      </div>
                      <label className="flex items-center gap-2">
                        <input name="es_preview" type="checkbox" defaultChecked={l.es_preview} />
                        <span className="font-montserrat text-[10px] text-gray-600">Es preview</span>
                      </label>
                      <button type="submit" className="bg-glow-navy text-white font-montserrat text-[10px] tracking-wide uppercase px-4 py-2">
                        Guardar lección
                      </button>
                    </form>
                  </details>
                ))}
              </div>
            </div>

            {/* Alumnas */}
            <div className="p-6">
              <p className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-4">
                Alumnas con acceso ({cursosAccesos.length})
              </p>

              <form action={grantAccesoFromForm} className="flex gap-2 mb-4">
                <input type="hidden" name="curso_id" value={curso.id} />
                <input name="user_id" className="admin-input flex-1" placeholder="User ID de Supabase" />
                <button type="submit" className="bg-glow-navy text-white font-montserrat text-[9px] tracking-wide uppercase px-4 py-2 whitespace-nowrap">
                  Dar acceso
                </button>
              </form>

              <div className="space-y-2">
                {cursosAccesos.map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="font-montserrat text-[10px] text-gray-600">{a.user?.email || a.user_id}</span>
                    <form action={revokeAcceso.bind(null, a.id)}>
                      <button type="submit" className="font-montserrat text-[9px] text-red-400 hover:text-red-600">
                        Revocar
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
