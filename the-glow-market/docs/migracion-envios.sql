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

commit;
