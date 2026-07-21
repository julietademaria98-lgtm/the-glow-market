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
  items             jsonb not null,
  datos_envio       jsonb,
  created_at        timestamptz default now()
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

-- ============================================
-- STORAGE BUCKETS
-- (Crear manualmente en Supabase > Storage)
-- ============================================
-- 1. "product-images" — PÚBLICO — para fotos de productos
-- 2. "videos-privados" — PRIVADO — para videos de cursos

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
