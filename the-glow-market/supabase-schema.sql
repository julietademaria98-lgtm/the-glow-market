-- ================================================
-- THE GLOW MARKET — Schema de Supabase
-- Ejecutar en: supabase.com > tu proyecto > SQL Editor
-- ================================================

-- Habilitar extensión UUID
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLA: productos
-- ============================================
create table productos (
  id            uuid default uuid_generate_v4() primary key,
  slug          text unique not null,
  nombre        text not null,
  descripcion   text,
  precio        decimal(10,2) not null,
  precio_oferta decimal(10,2),
  categoria     text not null default 'accesorios',
  material      text,
  dimensiones   text,
  peso          text,
  colores       text[],
  stock         integer default 0,
  activo        boolean default true,
  destacado     boolean default false,
  created_at    timestamptz default now()
);

-- ============================================
-- TABLA: producto_imagenes
-- ============================================
create table producto_imagenes (
  id          uuid default uuid_generate_v4() primary key,
  producto_id uuid references productos(id) on delete cascade,
  url         text not null,
  orden       integer default 0,
  es_principal boolean default false
);

-- ============================================
-- TABLA: cursos
-- ============================================
create table cursos (
  id                 uuid default uuid_generate_v4() primary key,
  slug               text unique not null,
  titulo             text not null,
  descripcion        text,
  descripcion_larga  text,
  precio             decimal(10,2) not null,
  imagen_url         text,
  activo             boolean default true,
  created_at         timestamptz default now()
);

-- ============================================
-- TABLA: lecciones
-- ============================================
create table lecciones (
  id          uuid default uuid_generate_v4() primary key,
  curso_id    uuid references cursos(id) on delete cascade,
  titulo      text not null,
  descripcion text,
  video_path  text not null,
  duracion    text,
  orden       integer default 0,
  es_preview  boolean default false
);

-- ============================================
-- TABLA: accesos_curso
-- ============================================
create table accesos_curso (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  curso_id    uuid references cursos(id) on delete cascade,
  activo      boolean default true,
  created_at  timestamptz default now(),
  unique(user_id, curso_id)
);

-- ============================================
-- TABLA: ordenes
-- ============================================
create table ordenes (
  id                uuid default uuid_generate_v4() primary key,
  user_id           uuid references auth.users(id),
  mp_preference_id  text,
  mp_payment_id     text,
  estado            text default 'pendiente',
  total             decimal(10,2) not null,
  costo_envio       decimal(10,2) default 0,
  envio_zona        text,             -- id de la zona aplicada (deja rastro de qué se cobró)
  items             jsonb not null,
  datos_envio       jsonb,
  created_at        timestamptz default now()
);

-- ============================================
-- TABLA: envio_zonas (precios y textos de envío)
-- ============================================
-- Una fila por zona. El matcheo dirección → zona vive en lib/envios/zonas.ts; acá solo está
-- lo que decide la dueña del negocio: cuánto cuesta y qué texto ve el comprador.
-- Las zonas las crea el admin desde /admin/envios, al estilo de las shipping zones de
-- WooCommerce. Cada una dice qué cubre; el matcheo va de lo más específico a lo más general
-- (ver lib/envios/zonas.ts) y las dos zonas de descarte aseguran que ninguna dirección quede
-- sin envío.
create table envio_zonas (
  id               text primary key,
  nombre           text not null default '',  -- lo que ve el comprador: "Envíos GBA | Rapiboy"
  descripcion      text,                      -- "Envíos en el día comprando antes de las 12hs."
  precio           decimal(10,2) not null default 0,
  activo           boolean not null default false,
  -- 'normal' | 'resto-bsas' | 'resto-pais'. Los dos descartes son únicos y no se borran.
  tipo             text not null default 'normal',
  -- Slugs de provincia que cubre ('buenos-aires', 'cordoba'). Vacío en los descartes.
  provincias       text[] not null default '{}',
  -- Si tiene, la zona cubre solo esos CP dentro de sus provincias.
  codigos_postales text[],
  -- Promo de envío gratis: con `envio_gratis` prendido, el envío sale 0 cuando la compra llega
  -- a `envio_gratis_desde`. En 0 cualquier compra lo alcanza, o sea gratis siempre.
  envio_gratis       boolean not null default false,
  envio_gratis_desde decimal(10,2) not null default 0,
  orden            int not null default 0,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Productos: lectura pública (solo activos), escritura solo admins
alter table productos enable row level security;
create policy "productos_public_read"
  on productos for select using (activo = true);

-- Imagenes de productos: lectura pública
alter table producto_imagenes enable row level security;
create policy "imagenes_public_read"
  on producto_imagenes for select using (true);

-- Cursos: lectura pública (solo activos)
alter table cursos enable row level security;
create policy "cursos_public_read"
  on cursos for select using (activo = true);

-- Lecciones: previews públicas, resto requiere acceso
alter table lecciones enable row level security;
create policy "lecciones_preview_public"
  on lecciones for select using (es_preview = true);
create policy "lecciones_con_acceso"
  on lecciones for select using (
    es_preview = true or
    exists (
      select 1 from accesos_curso
      where accesos_curso.curso_id = lecciones.curso_id
        and accesos_curso.user_id = auth.uid()
        and accesos_curso.activo = true
    )
  );

-- Accesos: cada usuario ve solo los suyos
alter table accesos_curso enable row level security;
create policy "accesos_propios"
  on accesos_curso for select using (user_id = auth.uid());

-- Órdenes: cada usuario ve solo las suyas; inserción anónima permitida
alter table ordenes enable row level security;
create policy "ordenes_propias_select"
  on ordenes for select using (user_id = auth.uid());
create policy "ordenes_insert"
  on ordenes for insert with check (true);

-- Zonas de envío: lectura pública (el checkout necesita el precio y el texto).
-- La escritura no tiene policy a propósito: solo se toca con service-role desde el admin.
alter table envio_zonas enable row level security;
create policy "envio_zonas_public_read"
  on envio_zonas for select using (true);

-- ============================================
-- STORAGE BUCKETS
-- (Crear manualmente en Supabase > Storage)
-- ============================================
-- 1. "product-images" — PÚBLICO — para fotos de productos
-- 2. "videos-privados" — PRIVADO — para videos de cursos

-- ============================================
-- ZONAS DE ENVÍO (no es opcional: el panel lista estas filas)
-- ============================================
-- Se siembran vacías e inactivas a propósito: son casilleros a completar, no valores
-- sugeridos. El precio y los textos los carga la dueña desde /admin/envios, y hasta que una
-- zona no tenga nombre y precio queda inactiva y el checkout la trata como "sin envío".
--
-- Solo se crean cuatro. Las demás zonas (CABA, Córdoba, Tierra del Fuego…) las agrega ella
-- cuando las necesita: las que no existan se cobran con el precio de "Resto del país".
insert into envio_zonas (id, tipo, provincias, orden) values
  ('gba',        'normal',     array['buenos-aires'], 1),
  ('gba2',       'normal',     array['buenos-aires'], 2),
  ('bsas-resto', 'resto-bsas', '{}',                  3),
  ('interior',   'resto-pais', '{}',                  4)
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


-- ============================================
-- DATOS DE EJEMPLO (opcional, para testing)
-- ============================================
insert into productos (slug, nombre, descripcion, precio, categoria, material, stock, activo, destacado)
values
  ('collar-luna', 'Collar Luna', 'Delicado collar de plata con dije de luna creciente', 8500, 'collares', 'Plata 925', 10, true, true),
  ('aros-estrella', 'Aros Estrella', 'Aros minimalistas con forma de estrella de 4 puntas', 5500, 'aros', 'Acero quirúrgico bañado en oro', 15, true, true),
  ('pulsera-glow', 'Pulsera Glow', 'Pulsera delicada con cristales de Swarovski', 7200, 'pulseras', 'Plata 925 + cristales', 8, true, true),
  ('anillo-eternal', 'Anillo Eternal', 'Anillo apilable liso, diseño minimalista atemporal', 4800, 'anillos', 'Acero inoxidable dorado', 20, true, true);

insert into cursos (slug, titulo, descripcion, precio, activo)
values
  ('curso-estilo-personal', 'Estilo Personal con The Glow Market', 'Aprendé a construir un estilo auténtico que refleje tu esencia y te haga brillar en cada ocasión.', 15000, true);
