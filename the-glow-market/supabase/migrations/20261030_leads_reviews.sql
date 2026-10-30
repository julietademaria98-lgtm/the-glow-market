-- Tabla leads: capturas de mail para la guía gratis
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  source text not null default 'guia-infaltables',
  token text unique not null,
  token_expires_at timestamptz not null,
  dispositivos_usados int not null default 0,
  unsubscribed boolean not null default false,
  created_at timestamptz not null default now(),
  constraint leads_email_unique unique (email)
);

create index if not exists leads_token_idx on leads(token);
create index if not exists leads_email_idx on leads(email);

-- RLS: solo acceso via service role (API server-side)
alter table leads enable row level security;

-- Tabla reviews: reseñas de alumnas al terminar el Módulo 4
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  nombre text not null,
  instagram text,
  rating int not null check (rating between 1 and 5),
  texto text not null,
  foto_path text,
  permiso_texto boolean not null default false,
  permiso_foto boolean not null default false,
  aprobado boolean not null default false,
  cupon_codigo text,
  created_at timestamptz not null default now(),
  constraint reviews_user_unique unique (user_id)
);

alter table reviews enable row level security;

-- Función para incrementar dispositivos_usados de forma segura
create or replace function increment_lead_dispositivos(lead_id uuid)
returns void language sql security definer as $$
  update leads set dispositivos_usados = dispositivos_usados + 1 where id = lead_id;
$$;

-- Bucket privado para fotos de reseñas (correr en Supabase Dashboard > Storage)
-- insert into storage.buckets (id, name, public) values ('reviews-fotos', 'reviews-fotos', false);
