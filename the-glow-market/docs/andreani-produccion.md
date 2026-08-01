# Andreani — pasos para pasar a producción

Todo lo de Andreani se desarrolló y probó contra la **Supabase local (Docker)**. Para que funcione
en la web real hay que replicar los cambios de base en la **Supabase de producción** (hosted) y
cargar las credenciales reales. Nada de esto toca los datos existentes (productos, cursos, órdenes):
son cambios **aditivos**.

> ⚠️ La base de producción es de un proyecto compartido. Antes de correr el SQL, avisá al dueño del
> proyecto (las tablas son inofensivas y aditivas, pero es su base).

## 1. Correr el SQL en Supabase (SQL Editor del proyecto de producción)

Es **idempotente** (se puede correr más de una vez sin romper nada). En el dashboard de Supabase →
**SQL Editor** → pegar y ejecutar:

```sql
-- Tabla de configuración de Andreani (una sola fila)
create table if not exists andreani_config (
  id                    text primary key default 'default' check (id = 'default'),
  entorno               text not null default 'sandbox' check (entorno in ('sandbox', 'prod')),
  base_url              text not null,
  usuario               text not null,
  password              text not null,
  contrato              text not null,
  cp_origen             text not null,
  sucursal_origen       text,
  tipo_servicio         text,
  sucursal_cliente_id   text,
  peso_default_kg       decimal(10,3) default 0.5,
  costo_envio_fallback  decimal(10,2) default 0,
  updated_at            timestamptz default now()
);
alter table andreani_config enable row level security;

-- Tabla de registro/respaldo de envíos
create table if not exists andreani_envios (
  id              uuid default uuid_generate_v4() primary key,
  orden_id        uuid references ordenes(id) on delete set null,
  cliente_nombre  text,
  cliente_email   text,
  cp_destino      text,
  numero_andreani text,
  agrupador       text,
  etiquetas_link  text,
  estado          text not null default 'pendiente'
                    check (estado in ('pendiente', 'creado', 'error')),
  kilos           decimal(10,3),
  valor_declarado decimal(10,2),
  dni_destino     text,
  error_message   text,
  raw_request     jsonb,
  raw_response    jsonb,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
alter table andreani_envios enable row level security;

-- Columna de costo de envío en órdenes
alter table ordenes add column if not exists costo_envio decimal(10,2) default 0;
```

> Nota: en Supabase hosted los permisos de `service_role`/`anon` se otorgan automáticamente (a
> diferencia de la base local por psql, donde hubo que hacer GRANT a mano). No hace falta correr los
> GRANT en producción.

`andreani_config` y `andreani_envios` quedan **sin políticas RLS públicas**: solo se acceden con
service-role desde el server (rutas `/api/andreani/*`), igual que en local.

## 2. Variables de entorno (Vercel / hosting)

Confirmar que en producción estén las de Supabase **del proyecto real** (no las locales):
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

Andreani **no usa variables de entorno**: toda su config vive en la tabla `andreani_config` y se
carga desde el panel. No hay que agregar env vars para Andreani.

## 3. Cargar credenciales reales en el panel

Con la web en producción, entrar a `/admin/andreani` (logueada como admin) y cargar:
- **Base URL**: `https://apis.andreani.com` (producción) o `https://apisqa.andreani.com` (QA/pruebas).
- **Usuario** y **contraseña** de API (las que da el ejecutivo de Andreani).
- **Contrato**, **tipoDeServicio**, **sucursalClienteID** (también los da Andreani).
- **CP origen** y, si aplica, **sucursal origen**.
- **Peso por defecto** (kg) y **costo de envío de respaldo** (ARS) para el fallback del checkout.

Después: **Probar conexión** → debe dar verde → **Cotizar** un CP real → probar **Generar envío**
desde una orden → **Imprimir etiqueta** y **Ver tracking**.

## 4. Webhook de Mercado Pago (recordatorio, no es de Andreani)

El costo de envío ya se suma al total y se pasa a Mercado Pago (`shipments.cost`). Para que las
órdenes pasen a "aprobado" automáticamente, el webhook de MP necesita la **URL pública** de
producción (en local no funciona). Ver `NEXT_PUBLIC_URL` y la config de `create-preference`.

## Checklist rápido
- [ ] Avisar al dueño del proyecto Supabase.
- [ ] Correr el SQL de la sección 1 en la Supabase de producción.
- [ ] Verificar env vars de Supabase en el hosting.
- [ ] Cargar credenciales de Andreani en `/admin/andreani` y **Probar conexión**.
- [ ] Prueba end-to-end: cotizar → generar envío → etiqueta → tracking.
