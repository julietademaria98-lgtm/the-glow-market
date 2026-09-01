'use client'

import { useState } from 'react'
import { resetPasswordFromForm } from '@/lib/admin/actions'

export default function ResetPasswordForm() {
  const [estado, setEstado] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [mensaje, setMensaje] = useState('')

  return (
    <div className="bg-white rounded shadow-sm p-6">
      <p className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-1">
        Resetear contraseña de una alumna
      </p>
      <p className="font-montserrat text-[10px] text-gray-400 mb-4">
        Para cuando a alguien no le llegan los mails de confirmación o de recuperar contraseña.
      </p>
      <form
        action={async (formData) => {
          setEstado('loading')
          setMensaje('')
          try {
            await resetPasswordFromForm(formData)
            setEstado('ok')
            setMensaje('Listo, ya podés pasarle la contraseña nueva.')
          } catch (err) {
            setEstado('error')
            setMensaje(err instanceof Error ? err.message : 'Error al resetear la contraseña')
          }
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <input
          name="email"
          type="email"
          required
          placeholder="Email de la alumna"
          className="admin-input flex-1"
        />
        <input
          name="nueva_password"
          required
          minLength={6}
          placeholder="Contraseña nueva (mín. 6 caracteres)"
          className="admin-input flex-1"
        />
        <button
          type="submit"
          disabled={estado === 'loading'}
          className="bg-glow-navy text-white font-montserrat text-[9px] tracking-wide uppercase px-4 py-2 whitespace-nowrap disabled:opacity-50"
        >
          {estado === 'loading' ? 'Guardando...' : 'Resetear contraseña'}
        </button>
      </form>
      {mensaje && (
        <p className={`font-montserrat text-[10px] mt-2 ${estado === 'error' ? 'text-red-500' : 'text-green-600'}`}>
          {mensaje}
        </p>
      )}
    </div>
  )
}
