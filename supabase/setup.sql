-- Pinchos Caña — contenido editable de la carta
--
-- Ejecutar una vez en el SQL Editor de Supabase. Es idempotente: puedes
-- repetirlo sin miedo.
--
-- La carta entera vive en UNA fila de `site_content`, con la clave que indique
-- VITE_CONTENT_KEY (por defecto 'carta_pinchos_cana'). Así un mismo proyecto de
-- Supabase puede alojar las cartas de varios restaurantes sin pisarse.

create table if not exists site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table site_content enable row level security;

drop policy if exists "site_content: lectura pública" on site_content;
create policy "site_content: lectura pública"
  on site_content for select using (true);

drop policy if exists "site_content: insertar solo autenticados" on site_content;
create policy "site_content: insertar solo autenticados"
  on site_content for insert to authenticated with check (true);

drop policy if exists "site_content: actualizar solo autenticados" on site_content;
create policy "site_content: actualizar solo autenticados"
  on site_content for update to authenticated using (true) with check (true);

-- Sincronización en vivo entre dispositivos: si el dueño cambia un precio
-- desde su móvil, las mesas lo ven sin recargar. Protegido para que no tumbe
-- el script si la publicación ya incluye la tabla.
do $$
begin
  alter publication supabase_realtime add table site_content;
exception when others then
  raise notice 'Realtime no activado (%) — el resto sigue funcionando', sqlerrm;
end $$;

-- ─────────────────────────────────────────────────────────────────────────
-- Usuario propietario
--
-- No se crea por SQL: hazlo en Authentication → Users → "Add user",
-- con "Auto Confirm User" activado y estos datos:
--
--   Email:    admin@acceso.pinchoscana.local
--   Password: (la que elijas)
--
-- En la web se entra escribiendo solo "admin" y esa contraseña.
-- ─────────────────────────────────────────────────────────────────────────
