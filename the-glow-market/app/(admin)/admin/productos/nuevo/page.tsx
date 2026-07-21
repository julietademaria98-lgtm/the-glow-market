import { createProducto } from '@/lib/admin/actions'
import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'

export default function NuevoProductoPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/productos" className="font-montserrat text-[10px] text-gray-400 hover:text-gray-600">
          ← Productos
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="font-cormorant text-3xl text-glow-navy font-light">Nuevo Producto</h1>
      </div>

      <ProductForm action={createProducto} submitLabel="Crear Producto" />
    </div>
  )
}
