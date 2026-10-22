'use client'

export default function CatalogError({ reset }: { reset: () => void }) {
  return (
    <main className="min-h-screen bg-glow-cream px-6 pt-40 pb-20 text-center text-glow-navy">
      <h1 className="font-display text-4xl mb-6">Estamos teniendo una interrupción temporal</h1>
      <p className="mb-8">No pudimos cargar esta información. Por favor, volvé a intentarlo más tarde.</p>
      <button onClick={() => reset()} className="rounded-full border border-current px-6 py-3">Volver a intentar</button>
    </main>
  )
}
