-- ============================================
-- MIGRACIÓN: cotizador de envíos por zonas
-- ============================================
-- `supabase-schema.sql` crea la base desde cero, así que sobre una base que ya existe
-- (producción) hay que correr ESTE archivo, no aquel.
--
-- Es aditivo e idempotente: no borra ni modifica datos, y se puede correr más de una vez.
--
-- IMPORTANTE: aplicar esto ANTES de deployar el código. Si el código sale primero, el
-- checkout se rompe al intentar guardar `costo_envio` en una columna que todavía no existe.
--
--   docker exec -i supabase_db_the-glow-market psql -U postgres -d postgres < docs/migracion-envios.sql
--   (o pegarlo en el SQL Editor de Supabase para producción)

begin;

-- 1. Órdenes: guardar cuánto se cobró de envío y qué zona se aplicó.
alter table ordenes add column if not exists costo_envio decimal(10,2) default 0;
alter table ordenes add column if not exists envio_zona  text;

-- 2. Tabla de zonas. El matcheo dirección → zona vive en lib/envios/zonas.ts; acá solo está
--    lo que decide la dueña del negocio: cuánto cuesta y qué texto ve el comprador.
create table if not exists envio_zonas (
  id          text primary key,
  nombre      text not null default '',
  descripcion text,
  precio      decimal(10,2) not null default 0,
  activo      boolean not null default false,
  orden       int not null default 0,
  updated_at  timestamptz default now()
);

-- 3. Lectura pública (el checkout necesita precio y texto). La escritura queda sin policy a
--    propósito: solo se toca con service-role desde el admin.
alter table envio_zonas enable row level security;
drop policy if exists "envio_zonas_public_read" on envio_zonas;
create policy "envio_zonas_public_read"
  on envio_zonas for select using (true);

-- 4. Las 26 zonas, vacías e inactivas. Son casilleros a completar desde /admin/envios, no
--    valores sugeridos. `do nothing` para no pisar lo que ya haya cargado.
insert into envio_zonas (id, orden) values
  ('gba', 1), ('gba2', 2), ('bsas-resto', 3),
  ('caba', 10), ('catamarca', 11), ('chaco', 12), ('chubut', 13), ('cordoba', 14),
  ('corrientes', 15), ('entre-rios', 16), ('formosa', 17), ('jujuy', 18), ('la-pampa', 19),
  ('la-rioja', 20), ('mendoza', 21), ('misiones', 22), ('neuquen', 23), ('rio-negro', 24),
  ('salta', 25), ('san-juan', 26), ('san-luis', 27), ('santa-cruz', 28), ('santa-fe', 29),
  ('santiago-del-estero', 30), ('tierra-del-fuego', 31), ('tucuman', 32)
on conflict (id) do nothing;

commit;
