# Andreani API — referencia

> ✅ DECISIÓN (actualizado con los Excel oficiales de la cuenta de la usuaria):
> usamos la **API clásica**, host **`apis.andreani.com`** (QA **`apisqa.andreani.com`**).
> Los Excel `api-cotizador-v2-1`, `api-obtener-etiqueta-v2-0`, `api-tracking`, `api-localidades`,
> `api-sucursales` son todos de la clásica y consistentes entre sí → **esta es la fuente de verdad**.
> La sección "Beta / transporte-distribucion" del portal developers era una API paralela incompleta
> (solo alta) y NO se usa. Auth: `Authorization: Bearer {token}` (mandamos también `x-authorization-token`).
>
> ## Endpoints confirmados (todos en el host clásico) — implementados en `lib/andreani.ts`
> - **Alta de orden**: `POST /v2/ordenes-de-envio`. Body: `destinatario` array,
>   `documentoTipo`/`documentoNumero`, `bultos[].volumenCm`, `sucursalClienteID` numérico.
>   Respuesta → `bultos[].numeroDeEnvio`, `agrupadorDeBultos`, `etiquetasPorAgrupador`.
> - **Cotizar**: `GET /v1/tarifas?contrato=&cpDestino=&sucursalOrigen=&bultos[0][kilos]=&bultos[0][valorDeclarado]=&bultos[0][volumen]=`
>   → `{ pesoAforado, tarifaSinIva:{total}, tarifaConIva:{total} }` (totales string).
> - **Etiqueta**: `GET /v2/ordenes-de-envio/{numeroAndreani|agrupador}/etiquetas` → PDF (o ZPL con
>   `Accept: application/zpl`). Requiere token → proxy con auth. B2C = agrupador, B2B = numeroDeEnvio.
> - **Trazas/tracking**: `GET /v2/envios/{numeroAndreani}/trazas` → array de
>   `{ Fecha, Estado, Evento, EstadoId, Sucursal }`.
> - **Localidades** (opcional, futuro): `GET /v1/localidades?codigosPostales=` → localidad/provincia por CP.
> - **Sucursales** (opcional, futuro): `GET /v2/sucursales` → listado de sucursales (envío a sucursal).
> - **Código de barras / QR** (`GET /v1/codigos-de-barras/{info}`, `/v1/codigos-qr/{info}`): NO se usan;
>   la etiqueta PDF ya trae el barcode.
>
> ## Único pendiente real
> Las **credenciales de API** (usuario/contraseña). Hoy la usuaria tiene solo el portal comercial →
> debe pedir el **alta a la API** al ejecutivo, + `tipoDeServicio` y `sucursalClienteID`.
>
> ---
> Lo de abajo es el relevamiento viejo del portal Beta (queda como histórico; NO es lo que usamos).

## Autenticación
- [DOC] Header: `Authorization: Bearer {token}` (JWT, apiKey en header `Authorization`).
  Fuente: https://developers-sandbox.andreani.com/docs/andreani/prueba-andreani-sandbox-document-apis
- [NO EN LA DOC — a confirmar con Andreani] Cómo se obtiene ese token (endpoint de login) y las
  credenciales (usuario, contraseña, contrato) y ambientes (sandbox/QA vs producción). La doc de
  esta API no describe el login; hay que pedírselo a Andreani.

## 1. Alta de orden de envío  ✅ documentado
```
POST https://apissandbox.andreani.com/beta/transporte-distribucion/ordenes-de-envio
Authorization: Bearer {token}
Content-Type: application/json
Accept: text/plain
```
- [DOC] El `curl` de la doc usa `Accept: text/plain`. La doc también ofrece como opciones válidas
  `application/json`, `text/json` y `application/*+json` (para request y response).

### Request body (nombres exactos; valores = placeholders del schema)
```json
{
  "contrato": "string",
  "tipoDeServicio": "string",
  "sucursalClienteID": 0,
  "origen": {
    "postal": {
      "codigoPostal": "string", "calle": "string", "numero": "string",
      "piso": "string", "departamento": "string", "localidad": "string",
      "region": "string", "pais": "string", "casillaDeCorreo": "string",
      "componentesDeDireccion": [ { "meta": "string", "contenido": "string" } ]
    },
    "sucursal": {
      "id": "string", "nomenclatura": "string", "descripcion": "string",
      "direccion": { "codigoPostal": "string", "calle": "string", "numero": "string", "piso": "string", "departamento": "string", "localidad": "string", "region": "string", "pais": "string", "casillaDeCorreo": "string", "componentesDeDireccion": [ { "meta": "string", "contenido": "string" } ] },
      "telefonos": { "telefono": [ { "tipo": 0, "numero": "string" } ] },
      "datosAdicionales": { "matadatos": [ { "meta": "string", "contenido": "string" } ] }
    },
    "coordenadas": { "elevacion": 0, "latitud": 0, "longitud": 0, "poligono": 0 }
  },
  "destino": {
    "postal": {
      "codigoPostal": "string", "calle": "string", "numero": "string",
      "piso": "string", "departamento": "string", "localidad": "string",
      "region": "string", "pais": "string", "casillaDeCorreo": "string",
      "componentesDeDireccion": [ { "meta": "string", "contenido": "string" } ]
    },
    "sucursal": {
      "id": "string", "nomenclatura": "string", "descripcion": "string",
      "direccion": { "codigoPostal": "string", "calle": "string", "numero": "string", "piso": "string", "departamento": "string", "localidad": "string", "region": "string", "pais": "string", "casillaDeCorreo": "string", "componentesDeDireccion": [ { "meta": "string", "contenido": "string" } ] },
      "telefonos": { "telefono": [ { "tipo": 0, "numero": "string" } ] },
      "datosAdicionales": { "matadatos": [ { "meta": "string", "contenido": "string" } ] }
    },
    "coordenadas": { "elevacion": 0, "latitud": 0, "longitud": 0, "poligono": 0 }
  },
  "idPedido": "string",
  "remitente": {
    "nombreCompleto": "string", "email": "string",
    "documentoTipo": "string", "documentoNumero": "string",
    "telefonos": [ { "tipo": 0, "numero": "string" } ]
  },
  "destinatario": [
    {
      "nombreCompleto": "string", "email": "string",
      "documentoTipo": "string", "documentoNumero": "string",
      "telefonos": [ { "tipo": 0, "numero": "string" } ]
    }
  ],
  "remito": { "numeroRemito": "string", "complementarios": [ "string" ] },
  "centroDeCostos": "string",
  "productoAEntregar": "string",
  "productoARetirar": "string",
  "tipoProducto": "string",
  "categoriaFacturacion": "string",
  "pagoDestino": 0,
  "valorACobrar": 0,
  "fechaDeEntrega": { "fecha": "string", "horaDesde": "string", "horaHasta": "string" },
  "codigoVerificadorDeEntrega": "string",
  "bultos": [
    {
      "kilos": 0, "largoCm": 0, "altoCm": 0, "anchoCm": 0, "volumenCm": 0,
      "valorDeclaradoSinImpuestos": 0, "valorDeclaradoConImpuestos": 0,
      "referencias": [ { "meta": "string", "contenido": "string" } ],
      "descripcion": "string",
      "numeroDeEnvio": "string",
      "valorDeclarado": 0,
      "componentes": { "numeroAgrupador": "string", "componentesHijos": [ { "numeroHijo": "string", "referencias": [ { "meta": "string", "contenido": "string" } ] } ] },
      "ean": "string"
    }
  ],
  "pagoPendienteEnMostrador": true
}
```
Notas:
- `destinatario` es **array**.
- `origen`/`destino` usan objeto **`postal`** (con `codigoPostal`, `calle`, `numero`, `localidad`, `region`…), o `sucursal`.

### Response 202 Accepted (exacto)
```json
{
  "estado": "string",
  "tipo": "string",
  "sucursalDeDistribucion": { "nomenclatura": "string", "descripcion": "string", "id": "string" },
  "sucursalDeRendicion":   { "nomenclatura": "string", "descripcion": "string", "id": "string" },
  "sucursalDeImposicion":  { "nomenclatura": "string", "descripcion": "string", "id": "string" },
  "sucursalAbastecedora":  { "nomenclatura": "string", "descripcion": "string", "id": "string" },
  "fechaCreacion": "string",
  "zonaDeReparto": "string",
  "numeroDePermisionaria": "string",
  "descripcionServicio": "string",
  "etiquetaRemito": "string",
  "bultos": [
    { "numeroDeBulto": "string", "numeroDeEnvio": "string", "totalizador": "string", "linking": [ { "meta": "string", "contenido": "string" } ] }
  ],
  "fechaEstimadaDeEntrega": "string",
  "huellaDeCarbono": "string",
  "gastoEnergetico": "string",
  "agrupadorDeBultos": "string",
  "etiquetasPorAgrupador": "string",
  "etiquetasDocumentoDeCambio": "string"
}
```
- [DOC] La respuesta trae `bultos[].numeroDeEnvio`.
- [INFERENCIA — a confirmar en QA] Que ese `numeroDeEnvio` sea el número de seguimiento/tracking
  no lo dice la doc textualmente; se deduce por el nombre del campo.

### Error 400
```json
[ { "code": "string", "property": "string", "message": "string" } ]
```

## 2. Etiqueta  ⚠️ sin endpoint propio en la doc oficial
- No existe un GET de etiqueta en el portal (verificado en el sitemap completo del sitio: no hay página de "etiqueta").
- La etiqueta viene **en la respuesta del alta**, como `string`:
  - `etiquetasPorAgrupador` (etiqueta/s por agrupador de bultos)
  - `etiquetaRemito`
  - `etiquetasDocumentoDeCambio`
- La doc NO especifica si es URL a PDF o identificador → **confirmar con el valor real en QA**.

## 3. Trazas / seguimiento  ❌ no documentado
- No hay endpoint de trazas en el portal oficial (Beta transporte-distribución).
- Pendiente: pedir a Andreani el endpoint oficial de tracking para esta API.

## 4. Endpoints DESCARTADOS (módulo "Almacenamiento" / WMS — NO aplican)
The Glow Market despacha desde su propio local: solo necesita **Transporte y distribución**, NO el
servicio de fulfillment donde Andreani guarda el stock. Todos estos son de Almacenamiento (se
reconocen por `almacen`, `lote`, `lpn`, `propietario`, `contratoWarehouse`, `articulo.codigo`) y
**no se usan**:
- `POST /almacenes/pedidos` — pedido de fulfillment (Andreani pickea y despacha tu stock).
- `POST /abastecimiento`, `GET /abastecimiento/:id` — reposición de depósito.
- `POST /traslado`, `GET /traslado/:id` — traslado de stock entre depósitos.
- `POST /propietario-sku`, `GET /propietario-sku/:id` — movimiento de SKU/propietario.
- `POST /acondicionamiento`, `GET /acondicionamiento/:id` — acondicionamiento en depósito.
- `POST /facturacion`, `GET /facturacion/:id` — facturación del servicio de fulfillment.
> Nota: `/almacenes/pedidos` confunde porque trae `destinatario` + dirección + `etiqueta`, pero
> exige `almacen`/`lineas`/`contratoWarehouse` → es fulfillment, no transporte simple.

## Pendientes a pedir/confirmar con el ejecutivo de Andreani (módulo Transporte y distribución)
1. **Credenciales** QA/sandbox y prod: usuario, contraseña, contrato, `tipoDeServicio`, `sucursalClienteID`.
2. **Login / auth**: endpoint para obtener el token y formato del header `Authorization`.
3. **Tarifas / cotización**: endpoint para el costo de envío por CP (lo usa el checkout).
4. **Trazas / seguimiento**: endpoint de tracking por número de envío (feature pausada hasta tenerlo).
5. **Etiqueta**: confirmar si `etiquetasPorAgrupador` es URL a PDF pública o requiere el token.
6. **Remitente / origen**: datos del remitente y dirección de origen completa a enviar en el alta.
