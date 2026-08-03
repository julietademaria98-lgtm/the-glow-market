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

begin;

insert into envio_zonas (id, tipo, nombre, descripcion, precio, activo, orden, provincias, codigos_postales) values ('gba', 'normal', 'Envíos GBA | Rapiboy', 'Envíos en el día comprando antes de las 12hs. Llegan entre las 15 y las 20hs.', 4499.99, 't', 0, '{buenos-aires}'::text[], '{1602,1603,1604,1605,1606,1607,1608,1609,1610,1611,1612,1613,1614,1615,1616,1617,1618,1621,1624,1636,1637,1638,1640,1641,1642,1643,1644,1645,1646,1648,1650,1651,1653,1659,1660,1661,1662,1663,1665,1666,1667,1670,1672,1674,1675,1676,1678,1682,1684,1685,1686,1687,1688,1689,1690,1692,1702,1703,1704,1706,1707,1708,1712,1713,1714,1715,1716,1718,1721,1722,1723,1724,1739,1741,1745,1751,1752,1753,1754,1755,1757,1758,1759,1761,1763,1764,1765,1766,1768,1770,1772,1773,1774,1776,1778,1785,1786,1801,1802,1803,1804,1805,1806,1807,1809,1812,1820,1822,1823,1824,1825,1826,1828,1829,1832,1833,1834,1836,1837,1838,1839,1840,1841,1842,1843,1844,1845,1846,1847,1848,1849,1851,1852,1853,1854,1855,1856,1857,1859,1861,1867,1868,1869,1870,1871,1872,1873,1874,1875,1876,1877,1878,1879,1880,1881,1882,1883,1884,1885,1886,1887,1888,1889,1890,1891,1893}'::text[]) on conflict (id) do update set tipo = excluded.tipo, nombre = excluded.nombre, descripcion = excluded.descripcion, precio = excluded.precio, activo = excluded.activo, orden = excluded.orden, provincias = excluded.provincias, codigos_postales = excluded.codigos_postales;
insert into envio_zonas (id, tipo, nombre, descripcion, precio, activo, orden, provincias, codigos_postales) values ('gba2', 'normal', 'Envíos GBA2 | Rapiboy', 'Entrega en 24/48hs hábiles.', 6000.00, 't', 1, '{buenos-aires}'::text[], '{1619,1620,1623,1625,1626,1627,1628,1629,1630,1632,1633,1634,1635,1664,1669,1727,1747,1748,1749,1750,1781,1782,1783,1784,1787,1789,1790,1791,1792,1793,1835,1858,1862,1864,1865,1866,1984}'::text[]) on conflict (id) do update set tipo = excluded.tipo, nombre = excluded.nombre, descripcion = excluded.descripcion, precio = excluded.precio, activo = excluded.activo, orden = excluded.orden, provincias = excluded.provincias, codigos_postales = excluded.codigos_postales;
insert into envio_zonas (id, tipo, nombre, descripcion, precio, activo, orden, provincias, codigos_postales) values ('caba', 'normal', 'CABA | Moto', 'Entrega en el día.', 3500.00, 't', 2, '{caba}'::text[], '{}'::text[]) on conflict (id) do update set tipo = excluded.tipo, nombre = excluded.nombre, descripcion = excluded.descripcion, precio = excluded.precio, activo = excluded.activo, orden = excluded.orden, provincias = excluded.provincias, codigos_postales = excluded.codigos_postales;
insert into envio_zonas (id, tipo, nombre, descripcion, precio, activo, orden, provincias, codigos_postales) values ('chaco', 'normal', 'Envíos a Chaco', 'Envíos de 7 a 15 días hábiles.', 1000.00, 't', 3, '{chaco}'::text[], '{}'::text[]) on conflict (id) do update set tipo = excluded.tipo, nombre = excluded.nombre, descripcion = excluded.descripcion, precio = excluded.precio, activo = excluded.activo, orden = excluded.orden, provincias = excluded.provincias, codigos_postales = excluded.codigos_postales;
insert into envio_zonas (id, tipo, nombre, descripcion, precio, activo, orden, provincias, codigos_postales) values ('bsas-resto', 'resto-bsas', 'Resto de Buenos Aires', 'Entrega en 3 a 5 días hábiles.', 9000.00, 't', 9000, '{}'::text[], NULL::text[]) on conflict (id) do update set tipo = excluded.tipo, nombre = excluded.nombre, descripcion = excluded.descripcion, precio = excluded.precio, activo = excluded.activo, orden = excluded.orden, provincias = excluded.provincias, codigos_postales = excluded.codigos_postales;
insert into envio_zonas (id, tipo, nombre, descripcion, precio, activo, orden, provincias, codigos_postales) values ('interior', 'resto-pais', 'Envío al interior', 'Llega en 5 a 10 días hábiles.', 10000.00, 't', 9001, '{}'::text[], NULL::text[]) on conflict (id) do update set tipo = excluded.tipo, nombre = excluded.nombre, descripcion = excluded.descripcion, precio = excluded.precio, activo = excluded.activo, orden = excluded.orden, provincias = excluded.provincias, codigos_postales = excluded.codigos_postales;

commit;

-- Comprobación: las 6 zonas activas, con precio y nombre.
--   select id, tipo, nombre, precio, activo, orden,
--          coalesce(array_length(codigos_postales, 1), 0) as cps
--     from envio_zonas order by orden, created_at;
