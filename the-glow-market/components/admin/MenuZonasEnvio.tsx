'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Truck, ChevronDown, ChevronRight } from 'lucide-react'

interface ZonaMenu {
  id: string
  nombre: string
  activo: boolean
}

const ITEM =
  'flex items-center gap-3 px-3 py-2.5 rounded font-montserrat text-[11px] tracking-wide text-white/60 hover:text-white hover:bg-white/10 transition-colors'

/**
 * Item desplegable del menú del admin. Las zonas se listan acá para poder saltar a una sin
 * pasar por la lista, que es lo que se hace cuando hay varias cargadas.
 */
export default function MenuZonasEnvio({ zonas }: { zonas: ZonaMenu[] }) {
  const [abierto, setAbierto] = useState(false)

  return (
    <div>
      <button type="button" onClick={() => setAbierto((v) => !v)} className={ITEM + ' w-full'}>
        <Truck size={14} />
        <span className="flex-1 text-left">Zona de envíos</span>
        {abierto ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>

      {abierto && (
        <div className="flex flex-col mt-0.5 mb-1">
          {zonas.map((z) => (
            <Link
              key={z.id}
              href={`/admin/envios#${z.id}`}
              className="pl-10 pr-3 py-1.5 font-montserrat text-[10px] tracking-wide text-white/40 hover:text-white hover:bg-white/10 transition-colors truncate"
            >
              {z.nombre || 'Sin nombre'}
              {!z.activo && <span className="text-white/20"> · inactiva</span>}
            </Link>
          ))}
          <Link
            href="/admin/envios"
            className="pl-10 pr-3 py-1.5 font-montserrat text-[10px] tracking-wide text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            + Agregar zona
          </Link>
        </div>
      )}
    </div>
  )
}
