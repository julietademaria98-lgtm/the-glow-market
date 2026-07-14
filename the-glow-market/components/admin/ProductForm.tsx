'use client'

import { useState } from 'react'
import type { Producto } from '@/types'

const CATEGORIAS = ['pouches', 'otros']

interface Props {
  producto?: Producto
  action: (formData: FormData) => Promise<void>
  submitLabel: string
}

export default function ProductForm({ producto, action, submitLabel }: Props) {
  const img = producto?.imagenes?.find((i) => i.es_principal) || producto?.imagenes?.[0]
  const [imageUrl, setImageUrl] = useState(img?.url || '')
  const [loading, setLoading] = useState(false)

  return (
    <form
      action={async (formData) => {
        setLoading(true)
        formData.set('imagen_url', imageUrl)
        await action(formData)
        setLoading(false)
      }}
      className="bg-white rounded shadow-sm p-8 max-w-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="md:col-span-2">
          <label className="admin-label">Nombre *</label>
          <input name="nombre" defaultValue={producto?.nombre} required className="admin-input" />
        </div>

        <div className="md:col-span-2">
          <label className="admin-label">Descripción</label>
          <textarea name="descripcion" defaultValue={producto?.descripcion || ''} rows={3} className="admin-input" />
        </div>

        <div>
          <label className="admin-label">Precio (ARS) *</label>
          <input name="precio" type="number" defaultValue={producto?.precio} required className="admin-input" />
        </div>

        <div>
          <label className="admin-label">Precio oferta (opcional)</label>
          <input name="precio_oferta" type="number" defaultValue={producto?.precio_oferta || ''} className="admin-input" />
        </div>

        <div>
          <label className="admin-label">Categoría *</label>
          <select name="categoria" defaultValue={producto?.categoria || 'otros'} className="admin-input">
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="admin-label">Stock</label>
          <input name="stock" type="number" defaultValue={producto?.stock || 0} className="admin-input" />
        </div>

        <div>
          <label className="admin-label">Material</label>
          <input name="material" defaultValue={producto?.material || ''} className="admin-input" />
        </div>

        <div>
          <label className="admin-label">Dimensiones</label>
          <input name="dimensiones" defaultValue={producto?.dimensiones || ''} className="admin-input" />
        </div>

        <div className="md:col-span-2">
          <label className="admin-label">URL de imagen principal</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="admin-input"
          />
          {imageUrl && (
            <img src={imageUrl} alt="preview" className="mt-2 w-32 h-32 object-cover rounded border" />
          )}
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input name="activo" type="checkbox" defaultChecked={producto?.activo ?? true} className="w-4 h-4" />
            <span className="font-montserrat text-[11px] tracking-wide text-gray-600">Activo</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input name="destacado" type="checkbox" defaultChecked={producto?.destacado ?? false} className="w-4 h-4" />
            <span className="font-montserrat text-[11px] tracking-wide text-gray-600">Destacado</span>
          </label>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-glow-navy text-white font-montserrat text-[10px] tracking-[0.2em] uppercase px-8 py-3 hover:bg-glow-navy/80 transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : submitLabel}
        </button>
        <a href="/admin/productos" className="font-montserrat text-[10px] text-gray-400 hover:text-gray-600">
          Cancelar
        </a>
      </div>
    </form>
  )
}
