-- ============================================================
-- ENVÍOS: migración completa para PRODUCCIÓN (todo en uno)
-- ============================================================
-- Junta los tres pasos en una sola transacción, en orden. Es lo único que hay que
-- correr en la Supabase de producción, y va ANTES de mergear/deployar el código.
--
--   1. estructura            (era migracion-envios.sql)
--   2. zonas creables        (era migracion-envios-zonas.sql)
--   3. datos: precios y CP   (era zonas-envio-produccion.sql)
--
-- Los tres archivos originales siguen en docs/ por separado; este es el atajo.
--
-- Todo aditivo e idempotente: no borra ni pisa datos existentes de productos, cursos
-- ni órdenes, y se puede correr más de una vez. Va en UNA transacción: si algo falla,
-- no queda nada a medias.
--
-- POR QUÉ ANTES DEL DEPLOY: el código nuevo guarda `costo_envio` en cada orden, y
-- `cotizarEnvio` no inventa precios (si la zona no está configurada devuelve
-- `disponible: false` y el checkout corta con "No hay envío disponible para esa
-- dirección"). Sin esto corrido, el checkout de productos físicos queda caído.
--
-- REVISAR: el bloque 3 carga la zona 'chaco' a $1.000 con 7 a 15 días, siendo interior
-- —más barata que CABA ($3.500) y que el interior general ($10.000)—. Tiene pinta de
-- zona de prueba. Si no va, borrar esa línea antes de ejecutar.
--
-- Pegar en el SQL Editor de Supabase (producción) y ejecutar.
-- ============================================================

begin;

-- ===== PASO 1: estructura =====
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
alter table envio_zonas add column if not exists codigos_postales text[];

alter table envio_zonas enable row level security;
drop policy if exists "envio_zonas_public_read" on envio_zonas;
create policy "envio_zonas_public_read"
  on envio_zonas for select using (true);

-- 4. Las 26 zonas, vacías e inactivas. Son casilleros a completar desde /admin/envios, no
--    valores sugeridos. `do nothing` para no pisar lo que ya haya cargado.
insert into envio_zonas (id, orden) values
  ('gba', 1), ('gba2', 2), ('bsas-resto', 3), ('interior', 4),
  ('caba', 10), ('catamarca', 11), ('chaco', 12), ('chubut', 13), ('cordoba', 14),
  ('corrientes', 15), ('entre-rios', 16), ('formosa', 17), ('jujuy', 18), ('la-pampa', 19),
  ('la-rioja', 20), ('mendoza', 21), ('misiones', 22), ('neuquen', 23), ('rio-negro', 24),
  ('salta', 25), ('san-juan', 26), ('san-luis', 27), ('santa-cruz', 28), ('santa-fe', 29),
  ('santiago-del-estero', 30), ('tierra-del-fuego', 31), ('tucuman', 32)
on conflict (id) do nothing;

-- Punto de partida de las listas de CP de GBA y GBA2 (166 y 37). Son editables desde
-- /admin/envios: esto es solo el valor inicial para no arrancar con las zonas vacías.
update envio_zonas set codigos_postales = array[
    '1602','1603','1604','1605','1606','1607','1608','1609','1610','1611',
    '1612','1613','1614','1615','1616','1617','1618','1621','1624','1636',
    '1637','1638','1640','1641','1642','1643','1644','1645','1646','1648',
    '1650','1651','1653','1659','1660','1661','1662','1663','1665','1666',
    '1667','1670','1672','1674','1675','1676','1678','1682','1684','1685',
    '1686','1687','1688','1689','1690','1692','1702','1703','1704','1706',
    '1707','1708','1712','1713','1714','1715','1716','1718','1721','1722',
    '1723','1724','1739','1741','1745','1751','1752','1753','1754','1755',
    '1757','1758','1759','1761','1763','1764','1765','1766','1768','1770',
    '1772','1773','1774','1776','1778','1785','1786','1801','1802','1803',
    '1804','1805','1806','1807','1809','1812','1820','1822','1823','1824',
    '1825','1826','1828','1829','1832','1833','1834','1836','1837','1838',
    '1839','1840','1841','1842','1843','1844','1845','1846','1847','1848',
    '1849','1851','1852','1853','1854','1855','1856','1857','1859','1861',
    '1867','1868','1869','1870','1871','1872','1873','1874','1875','1876',
    '1877','1878','1879','1880','1881','1882','1883','1884','1885','1886',
    '1887','1888','1889','1890','1891','1893'
  ] where id = 'gba' and codigos_postales is null;

update envio_zonas set codigos_postales = array[
    '1619','1620','1623','1625','1626','1627','1628','1629','1630','1632',
    '1633','1634','1635','1664','1669','1727','1747','1748','1749','1750',
    '1781','1782','1783','1784','1787','1789','1790','1791','1792','1793',
    '1835','1858','1862','1864','1865','1866','1984'
  ] where id = 'gba2' and codigos_postales is null;

-- 5. Las provincias pasaron de tener precio propio a ser excepciones al precio del interior.
--    Las que ya tuvieran uno cargado se conservan como excepción (activo = true), así no se
--    pierde nada de lo que estuviera configurado.
update envio_zonas
   set activo = true
 where id not in ('gba', 'gba2', 'bsas-resto', 'interior')
   and nombre <> ''
   and precio > 0;


-- ===== PASO 2: zonas creables =====
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


-- Comprobación rápida:
--   select id, tipo, nombre, precio, activo, provincias,
--          coalesce(array_length(codigos_postales, 1), 0) as cps
--     from envio_zonas order by created_at;

-- ===== PASO 3: precios, textos y codigos postales =====
-- ============================================
-- ZONAS DE ENVÍO: configuración para producción
-- ============================================
-- Tercer y último paso, después de `migracion-envios.sql` y `migracion-envios-zonas.sql`.
--
-- Aquellas dos crean la estructura; esta carga los DATOS: precios, textos y códigos
-- postales. Se exportó de la base local, que es donde se configuraron las zonas.
--
-- IMPORTANTE: correr esto ANTES de deployar el código. Las migraciones dejan las zonas
-- con `activo = false` y precio 0, y una zona sin configurar hace que `cotizarEnvio`
-- devuelva `disponible: false`: el checkout de productos físicos responde "No hay envío
-- disponible para esa dirección" hasta que haya zonas cargadas. Los cursos no se ven
-- afectados (no pagan envío).
--
-- Es idempotente: `on conflict do update` pisa la fila si ya existe, así que se puede
-- correr de nuevo sin duplicar nada.
--
-- REVISAR ANTES DE CORRER: los precios son los que estaban cargados en local. Confirmar
-- con Julieta que son los que quiere cobrar. En particular la zona 'chaco' ($1000, 7 a 15
-- días) parece de prueba: es más barata que CABA y que el interior, siendo interior.
-- Si no va, borrar su bloque de acá abajo antes de ejecutar.
--
--   Pegar en el SQL Editor de Supabase (producción), o:
--   docker exec -i supabase_db_the-glow-market psql -U postgres -d postgres < docs/zonas-envio-produccion.sql


insert into envio_zonas (id, tipo, nombre, descripcion, precio, activo, orden, provincias, codigos_postales) values ('gba', 'normal', 'Envíos GBA | Rapiboy', 'Envíos en el día comprando antes de las 12hs. Llegan entre las 15 y las 20hs.', 4499.99, 't', 0, '{buenos-aires}'::text[], '{1602,1603,1604,1605,1606,1607,1608,1609,1610,1611,1612,1613,1614,1615,1616,1617,1618,1621,1624,1636,1637,1638,1640,1641,1642,1643,1644,1645,1646,1648,1650,1651,1653,1659,1660,1661,1662,1663,1665,1666,1667,1670,1672,1674,1675,1676,1678,1682,1684,1685,1686,1687,1688,1689,1690,1692,1702,1703,1704,1706,1707,1708,1712,1713,1714,1715,1716,1718,1721,1722,1723,1724,1739,1741,1745,1751,1752,1753,1754,1755,1757,1758,1759,1761,1763,1764,1765,1766,1768,1770,1772,1773,1774,1776,1778,1785,1786,1801,1802,1803,1804,1805,1806,1807,1809,1812,1820,1822,1823,1824,1825,1826,1828,1829,1832,1833,1834,1836,1837,1838,1839,1840,1841,1842,1843,1844,1845,1846,1847,1848,1849,1851,1852,1853,1854,1855,1856,1857,1859,1861,1867,1868,1869,1870,1871,1872,1873,1874,1875,1876,1877,1878,1879,1880,1881,1882,1883,1884,1885,1886,1887,1888,1889,1890,1891,1893}'::text[]) on conflict (id) do update set tipo = excluded.tipo, nombre = excluded.nombre, descripcion = excluded.descripcion, precio = excluded.precio, activo = excluded.activo, orden = excluded.orden, provincias = excluded.provincias, codigos_postales = excluded.codigos_postales;
insert into envio_zonas (id, tipo, nombre, descripcion, precio, activo, orden, provincias, codigos_postales) values ('gba2', 'normal', 'Envíos GBA2 | Rapiboy', 'Entrega en 24/48hs hábiles.', 6000.00, 't', 1, '{buenos-aires}'::text[], '{1619,1620,1623,1625,1626,1627,1628,1629,1630,1632,1633,1634,1635,1664,1669,1727,1747,1748,1749,1750,1781,1782,1783,1784,1787,1789,1790,1791,1792,1793,1835,1858,1862,1864,1865,1866,1984}'::text[]) on conflict (id) do update set tipo = excluded.tipo, nombre = excluded.nombre, descripcion = excluded.descripcion, precio = excluded.precio, activo = excluded.activo, orden = excluded.orden, provincias = excluded.provincias, codigos_postales = excluded.codigos_postales;
insert into envio_zonas (id, tipo, nombre, descripcion, precio, activo, orden, provincias, codigos_postales) values ('caba', 'normal', 'CABA | Moto', 'Entrega en el día.', 3500.00, 't', 2, '{caba}'::text[], '{}'::text[]) on conflict (id) do update set tipo = excluded.tipo, nombre = excluded.nombre, descripcion = excluded.descripcion, precio = excluded.precio, activo = excluded.activo, orden = excluded.orden, provincias = excluded.provincias, codigos_postales = excluded.codigos_postales;
insert into envio_zonas (id, tipo, nombre, descripcion, precio, activo, orden, provincias, codigos_postales) values ('chaco', 'normal', 'Envíos a Chaco', 'Envíos de 7 a 15 días hábiles.', 1000.00, 't', 3, '{chaco}'::text[], '{}'::text[]) on conflict (id) do update set tipo = excluded.tipo, nombre = excluded.nombre, descripcion = excluded.descripcion, precio = excluded.precio, activo = excluded.activo, orden = excluded.orden, provincias = excluded.provincias, codigos_postales = excluded.codigos_postales;
insert into envio_zonas (id, tipo, nombre, descripcion, precio, activo, orden, provincias, codigos_postales) values ('bsas-resto', 'resto-bsas', 'Resto de Buenos Aires', 'Entrega en 3 a 5 días hábiles.', 9000.00, 't', 9000, '{}'::text[], NULL::text[]) on conflict (id) do update set tipo = excluded.tipo, nombre = excluded.nombre, descripcion = excluded.descripcion, precio = excluded.precio, activo = excluded.activo, orden = excluded.orden, provincias = excluded.provincias, codigos_postales = excluded.codigos_postales;
insert into envio_zonas (id, tipo, nombre, descripcion, precio, activo, orden, provincias, codigos_postales) values ('interior', 'resto-pais', 'Envío al interior', 'Llega en 5 a 10 días hábiles.', 10000.00, 't', 9001, '{}'::text[], NULL::text[]) on conflict (id) do update set tipo = excluded.tipo, nombre = excluded.nombre, descripcion = excluded.descripcion, precio = excluded.precio, activo = excluded.activo, orden = excluded.orden, provincias = excluded.provincias, codigos_postales = excluded.codigos_postales;


-- Comprobación: las 6 zonas activas, con precio y nombre.
--   select id, tipo, nombre, precio, activo, orden,
--          coalesce(array_length(codigos_postales, 1), 0) as cps
--     from envio_zonas order by orden, created_at;

commit;

-- Comprobación (correr aparte, después del commit):
--   select id, tipo, nombre, precio, activo, orden,
--          coalesce(array_length(codigos_postales, 1), 0) as cps
--     from envio_zonas order by orden, created_at;
--   -- deben salir 6 zonas, todas con activo = t y precio > 0
