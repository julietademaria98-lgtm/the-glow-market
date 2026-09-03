import { createClient } from '@supabase/supabase-js'
import { addSliderImagen, deleteSliderImagen } from '@/lib/admin/actions'
import Image from 'next/image'

async function getSliderImagenes() {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await db.from('slider_imagenes').select('*').order('orden')
  return data || []
}

export default async function AdminSliderPage() {
  const imagenes = await getSliderImagenes()

  return (
    <div className="p-8">
      <h1 className="font-cormorant text-3xl text-glow-navy font-light mb-8">Slider de fotos</h1>

      <form action={addSliderImagen} className="bg-white p-6 mb-8 flex gap-4 items-end">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="font-montserrat text-[10px] tracking-widest uppercase text-gray-400">URL de la imagen</label>
          <input name="url" placeholder="https://..." required className="border border-gray-200 px-3 py-2 font-montserrat text-xs outline-none focus:border-glow-navy/40" />
        </div>
        <div className="flex flex-col gap-1.5 w-24">
          <label className="font-montserrat text-[10px] tracking-widest uppercase text-gray-400">Orden</label>
          <input name="orden" type="number" defaultValue={imagenes.length} className="border border-gray-200 px-3 py-2 font-montserrat text-xs outline-none focus:border-glow-navy/40" />
        </div>
        <button type="submit" className="bg-glow-navy text-white font-montserrat text-[10px] tracking-widest uppercase px-6 py-2 hover:bg-glow-navy/80 transition-colors">
          Agregar
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {imagenes.map((img: any) => (
          <div key={img.id} className="relative group">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
              <Image src={img.url} alt="" fill className="object-cover" />
            </div>
            <form action={deleteSliderImagen.bind(null, img.id)} className="mt-2">
              <button type="submit" className="font-montserrat text-[9px] tracking-widest uppercase text-red-400 hover:text-red-600 transition-colors">
                Eliminar
              </button>
            </form>
          </div>
        ))}
      </div>

      {imagenes.length === 0 && (
        <p className="font-montserrat text-sm text-gray-400 text-center py-16">No hay imágenes. Agregá la primera URL arriba.</p>
      )}
    </div>
  )
}
