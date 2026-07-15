import { createClient as createServiceClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { deleteProductoFromForm, toggleActivoFromForm } from '@/lib/admin/actions'
import type { Producto } from '@/types'

async function getProductos(): Promise<Producto[]> {
  const db = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await db
    .from('productos')
    .select('*, imagenes:producto_imagenes(*)')
    .order('created_at', { ascending: false })
  return (data || []) as Producto[]
}

export default async function AdminProductosPage() {
  const productos = await getProductos()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-cormorant text-3xl text-glow-navy font-light">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="bg-glow-navy text-white font-montserrat text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 hover:bg-glow-navy/80 transition-colors"
        >
          + Nuevo
        </Link>
      </div>

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Imagen', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Activo', 'Acciones'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-montserrat text-[9px] tracking-[0.2em] uppercase text-gray-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {productos.map((p) => {
              const img = p.imagenes?.find((i) => i.es_principal) || p.imagenes?.[0]
              return (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    {img ? (
                      <img src={img.url} alt={p.nombre} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-montserrat text-xs text-gray-700">{p.nombre}</td>
                  <td className="px-4 py-3 font-montserrat text-[10px] text-gray-400 uppercase">{p.categoria}</td>
                  <td className="px-4 py-3 font-montserrat text-xs text-gray-700">
                    ${p.precio.toLocaleString('es-AR')}
                    {p.precio_oferta && (
                      <span className="ml-2 text-[10px] text-glow-blush">
                        → ${p.precio_oferta.toLocaleString('es-AR')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-montserrat text-xs text-gray-700">{p.stock}</td>
                  <td className="px-4 py-3">
                    <form action={toggleActivoFromForm}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="activo" value={(!p.activo).toString()} />
                      <button
                        type="submit"
                        className={`px-2 py-1 rounded font-montserrat text-[9px] tracking-wide uppercase ${
                          p.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {p.activo ? 'Activo' : 'Oculto'}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/productos/${p.id}`}
                        className="font-montserrat text-[10px] text-glow-navy hover:underline"
                      >
                        Editar
                      </Link>
                      <form action={deleteProductoFromForm}>
                        <input type="hidden" name="id" value={p.id} />
                        <button
                          type="submit"
                          className="font-montserrat text-[10px] text-red-400 hover:text-red-600"
                        >
                          Eliminar
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {productos.length === 0 && (
          <div className="text-center py-16">
            <p className="font-montserrat text-sm text-gray-400">No hay productos aún</p>
          </div>
        )}
      </div>
    </div>
  )
}
