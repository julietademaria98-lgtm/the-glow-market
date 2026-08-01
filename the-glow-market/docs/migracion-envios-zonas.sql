-- ============================================
-- MIGRACIÓN: de zonas fijas a zonas creables
-- ============================================
-- Segunda parte de `migracion-envios.sql`. Aquella creó `envio_zonas` con 27 filas fijas
-- (una por provincia + GBA/GBA2/resto). Esta la convierte en zonas que el admin crea y borra,
-- al estilo de las shipping zones de WooCommerce.
--
-- Qué cambia:
--   * cada zona dice qué provincias cubre (`provincias`) además de sus códigos postales
--   * `tipo` distingue las zonas normales de los dos descartes, que no se borran
--   * las provincias que nunca se configuraron dejan de existir como fila
--
-- Es aditiva e idempotente: no borra nada que tenga precio cargado y se puede correr de nuevo.
--
--   docker exec -i supabase_db_the-glow-market psql -U postgres -d postgres < docs/migracion-envios-zonas.sql

begin;

-- 1. Columnas nuevas.
alter table envio_zonas add column if not exists provincias text[] not null default '{}';
alter table envio_zonas add column if not exists tipo       text   not null default 'normal';
alter table envio_zonas add column if not exists created_at timestamptz default now();

-- 2. Los dos descartes. Antes eran 'bsas-resto' e 'interior'.
update envio_zonas set tipo = 'resto-bsas'  where id = 'bsas-resto';
update envio_zonas set tipo = 'resto-pais'  where id = 'interior';

-- 3. GBA y GBA2 pasan a declarar que sus códigos postales son de Buenos Aires. Sin esto, un
--    CP de GBA matchearía aunque el comprador hubiera elegido otra provincia.
update envio_zonas
   set provincias = array['buenos-aires']
 where id in ('gba', 'gba2')
   and provincias = '{}';

-- 4. Las provincias que estaban configuradas se vuelven zonas normales que cubren su
--    provincia. El id ya era el slug, así que alcanza con copiarlo.
update envio_zonas
   set provincias = array[id]
 where tipo = 'normal'
   and provincias = '{}'
   and id not in ('gba', 'gba2');

-- 5. Las provincias que nunca se usaron (sin nombre ni precio) dejan de existir: ahora las
--    zonas se crean a mano y no tiene sentido arrastrar 20 filas vacías por el panel.
delete from envio_zonas
 where tipo = 'normal'
   and id not in ('gba', 'gba2')
   and coalesce(nombre, '') = ''
   and coalesce(precio, 0) = 0;

-- 6. Antes, una provincia con precio propio podía no tener texto porque heredaba el del
--    interior. Ahora cada zona muestra el suyo, así que se le copia el que venía mostrando
--    para que el comprador siga viendo lo mismo.
update envio_zonas z
   set nombre      = coalesce(nullif(z.nombre, ''), r.nombre),
       descripcion = coalesce(z.descripcion, r.descripcion)
  from envio_zonas r
 where r.tipo = 'resto-pais'
   and z.tipo = 'normal'
   and z.activo
   and coalesce(z.nombre, '') = '';

-- 7. Orden de creación estable para que la lista del panel no baile.
update envio_zonas set created_at = now() - (interval '1 minute' * (100 - orden))
 where created_at is null;

commit;

-- Comprobación rápida:
--   select id, tipo, nombre, precio, activo, provincias,
--          coalesce(array_length(codigos_postales, 1), 0) as cps
--     from envio_zonas order by created_at;
