'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

interface Config {
  entorno: 'sandbox' | 'prod'
  base_url: string
  usuario: string
  password: string
  contrato: string
  cp_origen: string
  sucursal_origen: string | null
  tipo_servicio: string | null
  sucursal_cliente_id: string | null
  peso_default_kg: string
  costo_envio_fallback: string
}

const EMPTY: Config = {
  entorno: 'sandbox',
  base_url: '',
  usuario: '',
  password: '',
  contrato: '',
  cp_origen: '',
  sucursal_origen: '',
  tipo_servicio: '',
  sucursal_cliente_id: '',
  peso_default_kg: '0.5',
  costo_envio_fallback: '0',
}

type Msg = { ok: boolean; text: string } | null

export default function AndreaniAdminPage() {
  const [cfg, setCfg] = useState<Config>(EMPTY)
  const [loadingCfg, setLoadingCfg] = useState(true)
  const [savingCfg, setSavingCfg] = useState(false)
  const [cfgMsg, setCfgMsg] = useState<Msg>(null)
  const [hasStoredPassword, setHasStoredPassword] = useState(false)

  const [pinging, setPinging] = useState(false)
  const [pingMsg, setPingMsg] = useState<Msg>(null)

  const [cotiz, setCotiz] = useState({ cpDestino: '', kilos: '0.3', volumen: '', valorDeclarado: '' })
  const [cotizando, setCotizando] = useState(false)
  const [cotizResult, setCotizResult] = useState<{ tarifaConIva: number; tarifaSinIva: number; raw: unknown } | null>(null)
  const [cotizError, setCotizError] = useState<string | null>(null)
  const [verRaw, setVerRaw] = useState(false)

  useEffect(() => {
    fetch('/api/andreani/config')
      .then((r) => r.json())
      .then(({ config }) => {
        if (config) {
          setCfg({ ...EMPTY, ...config, password: '' })
          setHasStoredPassword(true)
        }
      })
      .finally(() => setLoadingCfg(false))
  }, [])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setSavingCfg(true)
    setCfgMsg(null)
    const res = await fetch('/api/andreani/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cfg),
    })
    const data = await res.json()
    setSavingCfg(false)
    if (!res.ok) {
      setCfgMsg({ ok: false, text: data.error || 'Error al guardar' })
    } else {
      setCfgMsg({ ok: true, text: 'Guardado ✓' })
      if (cfg.password) setHasStoredPassword(true)
      setCfg((c) => ({ ...c, password: '' }))
    }
  }

  async function probarConexion() {
    setPinging(true)
    setPingMsg(null)
    const res = await fetch('/api/andreani/ping', { method: 'POST' })
    const data = await res.json()
    setPinging(false)
    setPingMsg({ ok: !!data.ok, text: data.ok ? data.message || 'Conexión OK' : data.error || 'Error' })
  }

  async function submitCotizar(e: React.FormEvent) {
    e.preventDefault()
    setCotizando(true)
    setCotizResult(null)
    setCotizError(null)
    const res = await fetch('/api/andreani/cotizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cpDestino: cotiz.cpDestino,
        kilos: Number(cotiz.kilos),
        volumen: cotiz.volumen ? Number(cotiz.volumen) : undefined,
        valorDeclarado: Number(cotiz.valorDeclarado),
      }),
    })
    const data = await res.json()
    setCotizando(false)
    if (!data.ok) setCotizError(data.error || 'Error al cotizar')
    else setCotizResult({ tarifaConIva: data.tarifaConIva, tarifaSinIva: data.tarifaSinIva, raw: data.raw })
  }

  return (
    <div className="p-10 max-w-3xl">
      <h1 className="font-cormorant text-4xl text-glow-navy font-light mb-2">Andreani</h1>
      <p className="font-montserrat text-xs text-gray-500 mb-8">
        Configurá las credenciales, probá la conexión y cotizá un envío.
      </p>

      {/* CONFIGURACIÓN */}
      <section className="bg-white rounded shadow-sm p-6 mb-6">
        <h2 className="font-cormorant text-2xl text-glow-navy mb-4">Configuración</h2>
        {loadingCfg ? (
          <p className="font-montserrat text-xs text-gray-400">Cargando...</p>
        ) : (
          <form onSubmit={guardar} className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Entorno</label>
              <select
                className="admin-input"
                value={cfg.entorno}
                onChange={(e) => setCfg({ ...cfg, entorno: e.target.value as 'sandbox' | 'prod' })}
              >
                <option value="sandbox">Sandbox</option>
                <option value="prod">Producción</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Base URL</label>
              <input
                className="admin-input"
                value={cfg.base_url}
                onChange={(e) => setCfg({ ...cfg, base_url: e.target.value })}
                placeholder="https://apis.qa.andreani.com"
                required
              />
            </div>
            <div>
              <label className="admin-label">Usuario</label>
              <input
                className="admin-input"
                value={cfg.usuario}
                onChange={(e) => setCfg({ ...cfg, usuario: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="admin-label">Contraseña</label>
              <input
                className="admin-input"
                type="password"
                value={cfg.password}
                onChange={(e) => setCfg({ ...cfg, password: e.target.value })}
                placeholder={hasStoredPassword ? '•••••••• (dejar vacío para conservar)' : ''}
                required={!hasStoredPassword}
              />
            </div>
            <div>
              <label className="admin-label">N° de contrato</label>
              <input
                className="admin-input"
                value={cfg.contrato}
                onChange={(e) => setCfg({ ...cfg, contrato: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="admin-label">CP origen</label>
              <input
                className="admin-input"
                value={cfg.cp_origen}
                onChange={(e) => setCfg({ ...cfg, cp_origen: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="admin-label">Sucursal origen (opcional)</label>
              <input
                className="admin-input"
                value={cfg.sucursal_origen || ''}
                onChange={(e) => setCfg({ ...cfg, sucursal_origen: e.target.value })}
              />
            </div>
            <div>
              <label className="admin-label">Tipo de servicio (lo da Andreani)</label>
              <input
                className="admin-input"
                value={cfg.tipo_servicio || ''}
                onChange={(e) => setCfg({ ...cfg, tipo_servicio: e.target.value })}
              />
            </div>
            <div>
              <label className="admin-label">Sucursal cliente ID (opcional)</label>
              <input
                className="admin-input"
                value={cfg.sucursal_cliente_id || ''}
                onChange={(e) => setCfg({ ...cfg, sucursal_cliente_id: e.target.value })}
              />
            </div>
            <div>
              <label className="admin-label">Peso por defecto (kg) — para cotizar</label>
              <input
                className="admin-input"
                type="number"
                step="0.01"
                value={String(cfg.peso_default_kg ?? '')}
                onChange={(e) => setCfg({ ...cfg, peso_default_kg: e.target.value })}
              />
            </div>
            <div>
              <label className="admin-label">Costo de envío de respaldo (ARS)</label>
              <input
                className="admin-input"
                type="number"
                value={String(cfg.costo_envio_fallback ?? '')}
                onChange={(e) => setCfg({ ...cfg, costo_envio_fallback: e.target.value })}
              />
            </div>
            <div className="col-span-2 flex items-center gap-4">
              <Button type="submit" variant="primary" size="sm" loading={savingCfg}>
                Guardar
              </Button>
              {cfgMsg && (
                <span
                  className={`font-montserrat text-xs ${cfgMsg.ok ? 'text-green-700' : 'text-red-700'}`}
                >
                  {cfgMsg.text}
                </span>
              )}
            </div>
          </form>
        )}
      </section>

      {/* CONEXIÓN */}
      <section className="bg-white rounded shadow-sm p-6 mb-6">
        <h2 className="font-cormorant text-2xl text-glow-navy mb-4">Conexión</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" loading={pinging} onClick={probarConexion}>
            Probar conexión
          </Button>
          {pingMsg && (
            <span
              className={`font-montserrat text-xs ${pingMsg.ok ? 'text-green-700' : 'text-red-700'}`}
            >
              {pingMsg.ok ? '✓' : '✗'} {pingMsg.text}
            </span>
          )}
        </div>
      </section>

      {/* COTIZACIÓN */}
      <section className="bg-white rounded shadow-sm p-6">
        <h2 className="font-cormorant text-2xl text-glow-navy mb-4">Cotizar envío</h2>
        <form onSubmit={submitCotizar} className="grid grid-cols-2 gap-4">
          <div>
            <label className="admin-label">CP destino</label>
            <input
              className="admin-input"
              value={cotiz.cpDestino}
              onChange={(e) => setCotiz({ ...cotiz, cpDestino: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="admin-label">Peso (kg)</label>
            <input
              className="admin-input"
              type="number"
              step="0.01"
              value={cotiz.kilos}
              onChange={(e) => setCotiz({ ...cotiz, kilos: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="admin-label">Volumen cm³ (opcional)</label>
            <input
              className="admin-input"
              type="number"
              value={cotiz.volumen}
              onChange={(e) => setCotiz({ ...cotiz, volumen: e.target.value })}
            />
          </div>
          <div>
            <label className="admin-label">Valor declarado (ARS)</label>
            <input
              className="admin-input"
              type="number"
              value={cotiz.valorDeclarado}
              onChange={(e) => setCotiz({ ...cotiz, valorDeclarado: e.target.value })}
              required
            />
          </div>
          <div className="col-span-2">
            <Button type="submit" variant="primary" size="sm" loading={cotizando}>
              Cotizar
            </Button>
          </div>
        </form>

        {cotizError && (
          <p className="font-montserrat text-xs text-red-700 mt-4 whitespace-pre-wrap">{cotizError}</p>
        )}
        {cotizResult && (
          <div className="mt-6 border-t pt-4">
            <p className="font-montserrat text-[10px] tracking-widest uppercase text-gray-400">
              Tarifa con IVA
            </p>
            <p className="font-cormorant text-4xl text-glow-navy font-light">
              {formatPrice(cotizResult.tarifaConIva)}
            </p>
            <p className="font-montserrat text-xs text-gray-500 mt-1">
              Sin IVA: {formatPrice(cotizResult.tarifaSinIva)}
            </p>
            <button
              type="button"
              onClick={() => setVerRaw((v) => !v)}
              className="mt-4 font-montserrat text-[10px] tracking-widest uppercase text-glow-navy underline"
            >
              {verRaw ? 'Ocultar' : 'Ver'} detalle
            </button>
            {verRaw && (
              <pre className="mt-2 text-[10px] bg-gray-50 p-3 rounded overflow-auto max-h-80 font-mono">
                {JSON.stringify(cotizResult.raw, null, 2)}
              </pre>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
