export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-glow-cream pt-24">
      <div className="max-w-[800px] mx-auto px-6 py-16">
        <h1 className="font-cormorant text-4xl md:text-5xl text-glow-navy font-light tracking-wide mb-2">
          Términos y Condiciones
        </h1>
        <p className="font-montserrat text-xs text-glow-navy/40 tracking-widest uppercase mb-12">
          The Glow Market
        </p>

        <div className="flex flex-col gap-8 font-montserrat text-sm text-glow-navy/70 leading-relaxed">
          <p>Titular: Julieta Demaria | CUIT: 27-41589176-3<br />
          Contacto: admin@theglowmarket.com.ar</p>

          <div>
            <h2 className="font-cormorant text-xl text-glow-navy font-light mb-2">1. Aceptación</h2>
            <p>Al utilizar este sitio web y realizar compras, aceptás estos Términos y Condiciones en su totalidad.</p>
          </div>

          <div>
            <h2 className="font-cormorant text-xl text-glow-navy font-light mb-2">2. Productos físicos (Market)</h2>
            <p>Los productos se envían a todo el país. El plazo de entrega depende del destino y el servicio de correo seleccionado. Los precios incluyen IVA.</p>
          </div>

          <div>
            <h2 className="font-cormorant text-xl text-glow-navy font-light mb-2">3. Cursos online</h2>
            <p>Los cursos son productos de contenido digital. Una vez realizada la compra y otorgado el acceso, no se realizan devoluciones ni reembolsos bajo ninguna circunstancia, dado que el contenido queda disponible de manera inmediata.</p>
          </div>

          <div>
            <h2 className="font-cormorant text-xl text-glow-navy font-light mb-2">4. Acceso y uso</h2>
            <p>El acceso a los cursos es personal e intransferible. Está prohibido compartir credenciales, distribuir el contenido o reproducirlo por cualquier medio. El incumplimiento puede resultar en la suspensión del acceso sin reembolso.</p>
          </div>

          <div>
            <h2 className="font-cormorant text-xl text-glow-navy font-light mb-2">5. Precios</h2>
            <p>Los precios están expresados en pesos argentinos. The Glow Market se reserva el derecho de modificarlos sin previo aviso.</p>
          </div>

          <div>
            <h2 className="font-cormorant text-xl text-glow-navy font-light mb-2">6. Pagos</h2>
            <p>Los pagos se procesan a través de MercadoPago. The Glow Market no almacena datos de tarjetas de crédito.</p>
          </div>

          <div>
            <h2 className="font-cormorant text-xl text-glow-navy font-light mb-2">7. Propiedad intelectual</h2>
            <p>Todo el contenido de este sitio (textos, imágenes, videos, materiales de cursos) es propiedad de Julieta Demaria. Queda prohibida su reproducción sin autorización expresa.</p>
          </div>

          <div>
            <h2 className="font-cormorant text-xl text-glow-navy font-light mb-2">8. Contacto</h2>
            <p>Para consultas: admin@theglowmarket.com.ar</p>
          </div>
        </div>
      </div>
    </main>
  )
}
