-- =========================================================
-- 08_comunidad.sql
-- Funcionalidad "Comunidad" accesible por un QR general:
--   Opción 1: Consejos y más (muro de mensajes + datos del regalo)
--   Opción 2: Galería (los invitados suben fotos/videos de la boda)
-- =========================================================

-- ───── Tabla: consejos / mensajes para los novios ─────
create table if not exists public.consejos (
    id uuid primary key default gen_random_uuid(),
    nombre text not null default 'Anónimo',
    tipo text not null default 'mensaje' check (tipo in ('mensaje', 'consejo', 'anecdota', 'deseo', 'cancion', 'lugar')),
    mensaje text not null,
    created_at timestamptz not null default now()
);

create index if not exists consejos_created_at_idx
    on public.consejos (created_at desc);

-- ───── Tabla: galería de fotos/videos ─────
create table if not exists public.galeria (
    id uuid primary key default gen_random_uuid(),
    autor text not null default 'Anónimo',
    url text not null,
    tipo text not null default 'imagen' check (tipo in ('imagen', 'video')),
    created_at timestamptz not null default now()
);

create index if not exists galeria_created_at_idx
    on public.galeria (created_at desc);

-- ───── RLS: cualquiera (anónimo) puede leer y escribir ─────
alter table public.consejos enable row level security;
alter table public.galeria enable row level security;

drop policy if exists "consejos_select" on public.consejos;
create policy "consejos_select"
    on public.consejos for select to anon, authenticated using (true);

drop policy if exists "consejos_insert" on public.consejos;
create policy "consejos_insert"
    on public.consejos for insert to anon, authenticated with check (true);

drop policy if exists "galeria_select" on public.galeria;
create policy "galeria_select"
    on public.galeria for select to anon, authenticated using (true);

drop policy if exists "galeria_insert" on public.galeria;
create policy "galeria_insert"
    on public.galeria for insert to anon, authenticated with check (true);

-- ───── Storage: bucket público para fotos/videos ─────
-- Si este INSERT falla (algunos proyectos restringen la creación por SQL),
-- crea el bucket "boda-media" manualmente en Storage > New bucket,
-- márcalo como "Public" y luego ejecuta solo las políticas de abajo.
insert into storage.buckets (id, name, public)
values ('boda-media', 'boda-media', true)
on conflict (id) do update set public = true;

drop policy if exists "boda_media_select" on storage.objects;
create policy "boda_media_select"
    on storage.objects for select to anon, authenticated
    using (bucket_id = 'boda-media');

drop policy if exists "boda_media_insert" on storage.objects;
create policy "boda_media_insert"
    on storage.objects for insert to anon, authenticated
    with check (bucket_id = 'boda-media');
