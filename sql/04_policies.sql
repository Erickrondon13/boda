alter table public.invitados enable row level security;

drop policy if exists "invitados_select_all" on public.invitados;
create policy "invitados_select_all"
on public.invitados
for select
to anon, authenticated
using (true);

drop policy if exists "invitados_update_all" on public.invitados;
create policy "invitados_update_all"
on public.invitados
for update
to anon, authenticated
using (true)
with check (true);