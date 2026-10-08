import { Resend } from 'resend'

interface NinaWelcomeParams {
  to: string
  ordenId: string
  courseId: string
}

export async function sendNinaWelcome({ to, ordenId, courseId }: NinaWelcomeParams) {
  // El enlace no contiene credenciales: el curso conserva su control de acceso.
  const courseUrl = `https://theglowmarket.com.ar/mi-curso/curso/${encodeURIComponent(courseId)}`
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: 'Nina · The Glow Market <hola@theglowmarket.com.ar>',
    to,
    subject: 'Bienvenida a Day to Night Glow ✨',
    text: `¡Hola!

Qué lindo que te hayas sumado a Day to Night Glow. Me hace mucha ilusión acompañarte a descubrir cómo, con pocos productos y algunos pasos, podés crear un maquillaje que te haga sentir vos.

Reservate un ratito para vos.
Elegí un momento de la semana y agendalo. No necesitás hacerlo todo de una vez: podés avanzar de a poco, practicar y volver a cada clase cuando lo necesites.

Tené tus productos a mano.
Buscá un espejo, un lugar con buena luz y el maquillaje que ya usás. Mirar las técnicas mientras las probás te va a ayudar a incorporarlas.

Descargá las guías en PDF.
Son el complemento de las clases: guardalas para consultarlas mientras practicás y tenerlas cerca la próxima vez que te maquilles.

Date tiempo para probar.
No hace falta que todo salga perfecto a la primera. La idea es que descubras qué te gusta, qué te resulta cómodo y cómo adaptar cada look a vos.

Empezar mi curso: ${courseUrl}
Si es tu primera vez, creá tu contraseña desde el correo de confirmación de compra. También podés usar «Recuperar contraseña» en Mi cuenta, con el email de tu compra.

Gracias por compartir este espacio conmigo. Nos vemos en la primera clase 🤍

Nina Amateis
Day to Night Glow · The Glow Market`,
    html: `<!doctype html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bienvenida a Day to Night Glow</title></head>
<body style="margin:0;padding:0;background:#e9e2da;color:#192149;font-family:Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Unas palabras de Nina y todo lo que necesitás para empezar.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9e2da;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">
<tr><td align="center" style="padding:8px 0 28px;font-family:Georgia,serif;font-size:18px;letter-spacing:3px;">THE <span style="font-size:30px;">GLOW</span> MARKET</td></tr>
<tr><td style="background:#e1c8cb;padding:36px 28px;border-radius:40px 40px 0 0;text-align:center;">
<p style="margin:0 0 16px;font-size:11px;letter-spacing:2px;">UNA NOTA DE NINA</p>
<h1 style="font-family:Georgia,serif;font-size:36px;line-height:1.15;font-weight:400;margin:0;">Bienvenida a<br>Day to Night Glow.</h1>
</td></tr>
<tr><td style="background:#f4efe9;padding:32px 28px;border-radius:0 0 24px 24px;font-size:16px;line-height:1.75;">
<p style="margin:0 0 18px;">¡Hola!</p>
<p style="margin:0 0 28px;">Qué lindo que te hayas sumado a <strong>Day to Night Glow</strong>. Me hace mucha ilusión acompañarte a descubrir cómo, con pocos productos y algunos pasos, podés crear un maquillaje que te haga sentir vos.</p>
<p style="margin:0 0 24px;">Antes de empezar, te dejo algunas recomendaciones para aprovechar el curso:</p>
<h2 style="font-family:Georgia,serif;font-size:23px;font-weight:400;margin:0 0 8px;">Reservate un ratito para vos.</h2>
<p style="margin:0 0 24px;">Elegí un momento de la semana y agendalo. No necesitás hacerlo todo de una vez: podés avanzar de a poco, practicar y volver a cada clase cuando lo necesites.</p>
<h2 style="font-family:Georgia,serif;font-size:23px;font-weight:400;margin:0 0 8px;">Tené tus productos a mano.</h2>
<p style="margin:0 0 24px;">Buscá un espejo, un lugar con buena luz y el maquillaje que ya usás. Mirar las técnicas mientras las probás te va a ayudar a incorporarlas.</p>
<h2 style="font-family:Georgia,serif;font-size:23px;font-weight:400;margin:0 0 8px;">Descargá las guías en PDF.</h2>
<p style="margin:0 0 24px;">Son el complemento de las clases: guardalas para consultarlas mientras practicás y tenerlas cerca la próxima vez que te maquilles.</p>
<h2 style="font-family:Georgia,serif;font-size:23px;font-weight:400;margin:0 0 8px;">Date tiempo para probar.</h2>
<p style="margin:0 0 28px;">No hace falta que todo salga perfecto a la primera. La idea es que descubras qué te gusta, qué te resulta cómodo y cómo adaptar cada look a vos.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:4px 0 12px;"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td bgcolor="#192149" style="border-radius:999px;"><a href="${courseUrl}" style="display:inline-block;padding:17px 28px;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;text-decoration:none;color:#ffffff;">Empezar mi curso</a></td></tr></table></td></tr></table>
<p style="font-size:13px;line-height:1.6;color:#525a76;text-align:center;margin:0 0 32px;">Si es tu primera vez, creá tu contraseña desde el correo de confirmación de compra. También podés usar «Recuperar contraseña» en Mi cuenta, con el email de tu compra.</p>
<p style="margin:0 0 20px;">Gracias por compartir este espacio conmigo. Nos vemos en la primera clase 🤍</p>
<p style="font-family:Georgia,serif;font-size:28px;margin:0;">Nina Amateis</p>
<p style="font-size:12px;color:#525a76;margin:4px 0 0;">Day to Night Glow · The Glow Market</p>
</td></tr>
<tr><td align="center" style="padding:24px 8px;font-size:12px;color:#525a76;">The Glow Market · Menos pasos. Más vos.</td></tr>
</table></td></tr></table>
</body></html>`,
  }, { idempotencyKey: `nina-welcome/${ordenId}` })
  if (error) throw new Error('No se pudo enviar la bienvenida del curso')
}
