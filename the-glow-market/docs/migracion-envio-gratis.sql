-- ============================================
-- MIGRACIÓN: envío gratis por zona
-- ============================================
-- Agrega la promo de envío gratis a `envio_zonas`. Cada zona puede prenderla por su cuenta y
-- elegir desde qué monto de compra aplica: si el carrito llega a `envio_gratis_desde`, el envío
-- de esa zona sale 0; si no llega, se cobra el precio de siempre.
--
-- Poner el mínimo en 0 (o en 1) es la forma de dejar una zona con envío gratis siempre, que es
-- como se arma una promo del estilo "envío sin cargo a CABA".
--
-- Es aditiva e idempotente: las zonas que ya existen quedan con la promo apagada, o sea
-- cobrando exactamente lo mismo que antes.
--
--   docker exec -i supabase_db_the-glow-market psql -U postgres -d postgres < docs/migracion-envio-gratis.sql

begin;

alter table envio_zonas add column if not exists envio_gratis       boolean       not null default false;
alter table envio_zonas add column if not exists envio_gratis_desde decimal(10,2) not null default 0;

commit;

-- Comprobación rápida:
--   select id, tipo, nombre, precio, envio_gratis, envio_gratis_desde
--     from envio_zonas order by orden;
