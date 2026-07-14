import { createClient as createServiceClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { updateProducto } from '@/lib/admin/actions'
import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'
import type { Producto } from '@/types'

interface Props {
  params: { id: string }
}

async function getProducto(id: string): Promise<Producto | null> {
  const db = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await db
    .from('productos')
    .select('*, imagenes:producto_imagenes(*)')
    .eq('id', id)
    .single()
  return data as Producto | null
}

export default async function EditProductoPage({ params }: Props) {
  const producto = await getProducto(params.id)
  if (!producto) notFound()

  const action = updateProducto.bind(null, params.id)

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/productos" className="font-montserrat text-[10px] text-gray-400 hover:text-gray-600">
          ← Productos
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="font-cormorant text-3xl text-glow-navy font-light">Editar Producto</h1>
      </div>

      <ProductForm producto={producto} action={action} submitLabel="Guardar Cambios" />
    </div>
  )
}
