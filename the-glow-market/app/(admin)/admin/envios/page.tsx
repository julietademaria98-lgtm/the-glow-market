'use client'

import { useCallback, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'

interface Zona {
  id: string
  nombre: string
  descripcion: string | null
  precio: number
  activo: boolean
  tipo: 'normal' | 'resto-bsas' | 'resto-pais'
  provincias: string[]
  /** CP separados por coma, como se editan en el textarea. */
  codigosPostales: string
  cobertura: string
  envioGratis: boolean
  envioGratisDesde: number
  /** No se le eligen provincias ni CP y no se borra. */
  esDescarte: boolean
  /** No se arrastra: su lugar es siempre el final. */
  fija: boolean
}

interface Provincia {
  slug: string
  nombre: string
}

type Msg = { ok: boolean; text: string } | null

const INPUT =
  'border border-gray-200 focus:border-glow-navy outline-none px-3 py-2 font-montserrat text-sm text-glow-navy bg-white transition-colors w-full placeholder:text-gray-300'
const LABEL = 'font-montserrat text-[9px] tracking-widest uppercase text-gray-400 mb-1 block'

const ZONA_NUEVA = {
  nombre: '',
  descripcion: '',
  precio: 0,
  activo: true,
  provincias: [] as string[],
  codigosPostales: '',
  envioGratis: false,
  envioGratisDesde: 0,
}

export default function AdminEnviosPage() {
  const [zonas, setZonas] = useState<Zona[]>([])
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState<Msg>(null)
  const [creando, setCreando] = useState(false)
  /** Id de la zona que se está arrastrando, o null. */
  const [arrastrando, setArrastrando] = useState<string | null>(null)

  /**
   * Mueve la zona arrastrada al lugar de `destinoId` y guarda el orden nuevo. Se actualiza la
   * pantalla primero para que el arrastre se sienta inmediato, y si el guardado falla se
   * recarga del server para no quedar mostrando un orden que no existe.
   */
  async function reordenar(destinoId: string) {
    const origenId = arrastrando
    setArrastrando(null)
    if (!origenId || origenId === destinoId) return

    const movibles = zonas.filter((z) => !z.fija)
    const desde = movibles.findIndex((z) => z.id === origenId)
    const hasta = movibles.findIndex((z) => z.id === destinoId)
    if (desde < 0 || hasta < 0) return

    const nuevas = [...movibles]
    const [movida] = nuevas.splice(desde, 1)
    nuevas.splice(hasta, 0, movida)

    setZonas([...nuevas, ...zonas.filter((z) => z.fija)])

    const res = await fetch('/api/admin/envio-zonas', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: nuevas.map((z) => z.id) }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setMsg({ ok: false, text: data.error || 'No se pudo guardar el orden' })
      await cargar()
      return
    }
    setMsg({ ok: true, text: 'Orden actualizado' })
  }

  const cargar = useCallback(async () => {
    const r = await fetch('/api/admin/envio-zonas').then((r) => r.json())
    setZonas(r.zonas || [])
    setProvincias(r.provincias || [])
  }, [])

  useEffect(() => {
    cargar().finally(() => setLoading(false))
  }, [cargar])

  if (loading) {
    return (
      <div className="p-8">
        <p className="font-montserrat text-xs text-gray-400">Cargando zonas…</p>
      </div>
    )
  }

  const activas = zonas.filter((z) => z.activo).length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-cormorant text-3xl text-glow-navy font-light">Zonas de envío</h1>
        <div className="text-right">
          <p className="font-montserrat text-[9px] tracking-widest uppercase text-gray-400">
            Zonas activas
          </p>
          <p className="font-cormorant text-2xl text-glow-navy">
            {activas} <span className="text-gray-300">/ {zonas.length}</span>
          </p>
        </div>
      </div>

      <p className="font-montserrat text-[11px] text-gray-400 mb-8 max-w-2xl leading-relaxed">
        Se evalúan de arriba hacia abajo y gana la primera que coincide con la dirección, así que
        conviene dejar arriba las más específicas. Arrastrá desde <span className="text-gray-500">⠿</span> para
        cambiar el orden. La última recoge todo lo que no entró en ninguna y por eso no se mueve.
      </p>

      {msg && (
        <p
          className={`font-montserrat text-[11px] mb-4 ${msg.ok ? 'text-green-600' : 'text-red-500'}`}
        >
          {msg.text}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {zonas.map((zona, i) => (
          <FilaZona
            key={zona.id}
            zona={zona}
            orden={i + 1}
            provincias={provincias}
            arrastrando={arrastrando === zona.id}
            onArrastrarInicio={() => setArrastrando(zona.id)}
            onArrastrarFin={() => setArrastrando(null)}
            onSoltar={() => reordenar(zona.id)}
            onGuardado={async (texto) => {
              await cargar()
              setMsg({ ok: true, text: texto })
            }}
            onError={(texto) => setMsg({ ok: false, text: texto })}
          />
        ))}
      </div>

      <div className="mt-6">
        {creando ? (
          <Editor
            titulo="Zona nueva"
            inicial={ZONA_NUEVA}
            provincias={provincias}
            onCancelar={() => setCreando(false)}
            onGuardar={async (datos) => {
              const res = await fetch('/api/admin/envio-zonas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos),
              })
              const data = await res.json()
              if (!res.ok) {
                setMsg({ ok: false, text: data.error })
                return false
              }
              setCreando(false)
              await cargar()
              setMsg({ ok: true, text: 'Zona creada' })
              return true
            }}
          />
        ) : (
          <Button onClick={() => setCreando(true)} size="sm" variant="outline">
            + Agregar zona
          </Button>
        )}
      </div>
    </div>
  )
}

function FilaZona({
  zona,
  orden,
  provincias,
  arrastrando,
  onArrastrarInicio,
  onArrastrarFin,
  onSoltar,
  onGuardado,
  onError,
}: {
  zona: Zona
  orden: number
  provincias: Provincia[]
  arrastrando: boolean
  onArrastrarInicio: () => void
  onArrastrarFin: () => void
  onSoltar: () => void
  onGuardado: (texto: string) => Promise<void>
  onError: (texto: string) => void
}) {
  const [abierta, setAbierta] = useState(false)
  const [encima, setEncima] = useState(false)

  async function borrar() {
    const res = await fetch(`/api/admin/envio-zonas/${zona.id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) return onError(data.error)
    await onGuardado('Zona borrada')
  }

  return (
    <div
      id={zona.id}
      onDragOver={(e) => {
        if (zona.fija) return
        e.preventDefault()
        setEncima(true)
      }}
      onDragLeave={() => setEncima(false)}
      onDrop={(e) => {
        e.preventDefault()
        setEncima(false)
        if (!zona.fija) onSoltar()
      }}
      className={`border bg-white transition-colors ${
        encima
          ? 'border-glow-navy border-dashed'
          : zona.activo
            ? 'border-glow-navy/30'
            : 'border-gray-200'
      } ${arrastrando ? 'opacity-40' : ''}`}
    >
      <div className="px-5 py-4 flex items-center gap-4">
        {zona.fija ? (
          <span className="w-4 text-center font-montserrat text-[10px] text-gray-200" title="Esta zona va siempre al final">
            —
          </span>
        ) : (
          <span
            draggable
            onDragStart={onArrastrarInicio}
            onDragEnd={onArrastrarFin}
            className="w-4 text-center cursor-grab active:cursor-grabbing text-gray-300 hover:text-glow-navy select-none"
            title="Arrastrá para cambiar la prioridad"
          >
            ⠿
          </span>
        )}

        <span className="font-montserrat text-[10px] text-gray-300 w-4">{orden}</span>

        <div className="flex-1 min-w-0">
          <p className="font-montserrat text-[11px] tracking-widest uppercase text-glow-navy truncate">
            {zona.nombre || <span className="text-gray-300">Sin nombre</span>}
          </p>
          <p className="font-montserrat text-[10px] text-gray-400 mt-0.5 truncate">
            {zona.cobertura}
          </p>
        </div>

        <div className="text-right">
          <span className="font-cormorant text-xl text-glow-navy">
            ${Number(zona.precio).toLocaleString('es-AR')}
          </span>
          {zona.envioGratis && (
            <p className="font-montserrat text-[9px] tracking-wide uppercase text-green-700 whitespace-nowrap">
              {zona.envioGratisDesde > 0
                ? `Gratis desde $${Number(zona.envioGratisDesde).toLocaleString('es-AR')}`
                : 'Siempre gratis'}
            </p>
          )}
        </div>

        <span
          className={`font-montserrat text-[9px] tracking-wide uppercase px-2 py-1 ${
            zona.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'
          }`}
        >
          {zona.activo ? 'Activa' : 'Inactiva'}
        </span>

        <button
          type="button"
          onClick={() => setAbierta((v) => !v)}
          className="font-montserrat text-[10px] tracking-wide uppercase text-glow-navy hover:opacity-60 transition-opacity"
        >
          {abierta ? 'Cerrar' : 'Editar'}
        </button>
      </div>

      {abierta && (
        <div className="border-t border-gray-100 p-5">
          <Editor
            titulo={zona.esDescarte ? 'Zona de descarte' : 'Editar zona'}
            inicial={{
              nombre: zona.nombre,
              descripcion: zona.descripcion ?? '',
              precio: zona.precio,
              activo: zona.activo,
              provincias: zona.provincias,
              codigosPostales: zona.codigosPostales,
              envioGratis: zona.envioGratis,
              envioGratisDesde: zona.envioGratisDesde,
            }}
            provincias={provincias}
            esDescarte={zona.esDescarte}
            onCancelar={() => setAbierta(false)}
            onBorrar={zona.esDescarte ? undefined : borrar}
            onGuardar={async (datos) => {
              const res = await fetch(`/api/admin/envio-zonas/${zona.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos),
              })
              const data = await res.json()
              if (!res.ok) {
                onError(data.error)
                return false
              }
              setAbierta(false)
              await onGuardado('Cambios guardados')
              return true
            }}
          />
        </div>
      )}
    </div>
  )
}

function Editor({
  titulo,
  inicial,
  provincias,
  esDescarte = false,
  onGuardar,
  onCancelar,
  onBorrar,
}: {
  titulo: string
  inicial: typeof ZONA_NUEVA
  provincias: Provincia[]
  esDescarte?: boolean
  onGuardar: (datos: typeof ZONA_NUEVA) => Promise<boolean>
  onCancelar: () => void
  onBorrar?: () => Promise<void>
}) {
  const [datos, setDatos] = useState(inicial)
  const [guardando, setGuardando] = useState(false)

  function set<K extends keyof typeof ZONA_NUEVA>(campo: K, valor: (typeof ZONA_NUEVA)[K]) {
    setDatos((prev) => ({ ...prev, [campo]: valor }))
  }

  function alternarProvincia(slug: string) {
    setDatos((prev) => ({
      ...prev,
      provincias: prev.provincias.includes(slug)
        ? prev.provincias.filter((p) => p !== slug)
        : [...prev.provincias, slug],
    }))
  }

  const cantidadCP = (datos.codigosPostales.match(/\d{4}/g) || []).length

  return (
    <div className="border border-gray-200 bg-white p-5">
      <p className="font-montserrat text-[10px] tracking-widest uppercase text-gray-400 mb-4">
        {titulo}
      </p>

      <div className="grid md:grid-cols-[1fr_180px] gap-4">
        <div>
          <label className={LABEL}>Nombre</label>
          <input
            value={datos.nombre}
            onChange={(e) => set('nombre', e.target.value)}
            placeholder="Envíos GBA | Rapiboy"
            className={INPUT}
          />
          <p className="font-montserrat text-[10px] text-gray-400 mt-1">
            Tus clientes verán el nombre de este método de envío.
          </p>
        </div>
        <div>
          <label className={LABEL}>Precio</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={datos.precio}
            onChange={(e) => set('precio', Number(e.target.value))}
            className={INPUT}
          />
          <p className="font-montserrat text-[10px] text-gray-400 mt-1">
            En 0 se cobra envío gratis.
          </p>
        </div>
      </div>

      <div className="mt-4 border border-gray-100 bg-gray-50/60 px-4 py-3">
        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={datos.envioGratis}
            onChange={(e) => set('envioGratis', e.target.checked)}
            className="cursor-pointer accent-glow-navy"
          />
          <span className="font-montserrat text-[10px] tracking-wide uppercase text-gray-500">
            Activar envío gratis
          </span>
        </label>

        {datos.envioGratis && (
          <div className="mt-3 flex items-end gap-3">
            <div className="w-[180px]">
              <label className={LABEL}>Desde una compra de</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={datos.envioGratisDesde}
                onChange={(e) => set('envioGratisDesde', Number(e.target.value))}
                className={INPUT}
              />
            </div>
            <p className="font-montserrat text-[10px] text-gray-400 mb-2.5 max-w-sm leading-relaxed">
              Si la compra llega a ese monto, esta zona no cobra envío. En 0 el envío es gratis
              siempre, que es como se arma una promo para una zona puntual.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4">
        <label className={LABEL}>Descripción</label>
        <textarea
          value={datos.descripcion}
          onChange={(e) => set('descripcion', e.target.value)}
          placeholder="Envíos en el día comprando antes de las 12hs. Llegan entre las 15 y las 20hs."
          rows={2}
          className={INPUT + ' resize-y'}
        />
      </div>

      {esDescarte ? (
        <p className="mt-4 font-montserrat text-[10px] text-gray-400 leading-relaxed max-w-xl">
          Esta zona recoge lo que no entra en ninguna otra, así que no se le eligen provincias ni
          códigos postales, y no se puede borrar. Es lo que garantiza que ninguna dirección quede
          sin envío.
        </p>
      ) : (
        <>
          <div className="mt-5">
            <label className={LABEL}>Provincias que cubre</label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {provincias.map((p) => {
                const elegida = datos.provincias.includes(p.slug)
                return (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => alternarProvincia(p.slug)}
                    className={`font-montserrat text-[10px] tracking-wide px-2.5 py-1.5 border transition-colors ${
                      elegida
                        ? 'border-glow-navy bg-glow-navy text-white'
                        : 'border-gray-200 text-gray-500 hover:border-glow-navy/40'
                    }`}
                  >
                    {p.nombre}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-5">
            <label className={LABEL}>
              Códigos postales {cantidadCP > 0 && `(${cantidadCP})`}
            </label>
            <textarea
              value={datos.codigosPostales}
              onChange={(e) => set('codigosPostales', e.target.value)}
              rows={4}
              spellCheck={false}
              placeholder="1602, 1603, 1604…"
              className={INPUT + ' resize-y font-mono text-[11px] leading-relaxed'}
            />
            <p className="font-montserrat text-[10px] text-gray-400 mt-1 max-w-xl">
              Opcional. Si los cargás, la zona cubre solo esos códigos dentro de las provincias
              elegidas; si lo dejás vacío, cubre las provincias enteras. Separados por coma,
              espacio o renglón.
            </p>
          </div>
        </>
      )}

      <div className="mt-5 flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={datos.activo}
            onChange={(e) => set('activo', e.target.checked)}
            className="cursor-pointer accent-glow-navy"
          />
          <span className="font-montserrat text-[10px] tracking-wide uppercase text-gray-500">
            Activa
          </span>
        </label>

        <div className="flex-1" />

        {onBorrar && (
          <button
            type="button"
            onClick={onBorrar}
            className="font-montserrat text-[10px] tracking-wide uppercase text-gray-400 hover:text-red-500 transition-colors"
          >
            Borrar zona
          </button>
        )}
        <button
          type="button"
          onClick={onCancelar}
          className="font-montserrat text-[10px] tracking-wide uppercase text-gray-400 hover:text-glow-navy transition-colors"
        >
          Cancelar
        </button>
        <Button
          onClick={async () => {
            setGuardando(true)
            await onGuardar(datos)
            setGuardando(false)
          }}
          loading={guardando}
          size="sm"
          variant="primary"
        >
          Guardar
        </Button>
      </div>
    </div>
  )
}
