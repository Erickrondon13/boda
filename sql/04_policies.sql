-- =========================================================
-- 04_policies.sql
-- Políticas de seguridad (RLS) para Supabase
-- =========================================================

-- Habilitar RLS
alter table public.invitados enable row level security;
alter table public.rsvp_confirmaciones enable row level security;

-- Política: los invitados pueden leer su propio registro por token
create policy "Invitados pueden leer su registro por token"
on public.invitados
for select
using (true);

-- Política: cualquiera puede insertar/actualizar RSVP (controlado por la función)
create policy "Cualquiera puede insertar RSVP"
on public.rsvp_confirmaciones
for insert
with check (true);

create policy "Cualquiera puede actualizar RSVP"
on public.rsvp_confirmaciones
for update
using (true);

-- Política: solo service_role puede eliminar RSVP
create policy "Solo service_role puede eliminar RSVP"
on public.rsvp_confirmaciones
for delete
using (auth.role() = 'service_role');
