create extension if not exists pgcrypto;

create table if not exists public.invitados (
    id uuid primary key default gen_random_uuid(),
    nombre_apellido text not null,
    cupos integer not null default 2,
    token uuid not null default gen_random_uuid(),
    confirmado boolean not null default false,
    cantidad_confirmada integer not null default 0,
    telefono text,
    mensaje text,
    fecha_confirmacion timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint invitados_cupos_chk check (cupos >= 1),
    constraint invitados_cantidad_confirmada_chk check (cantidad_confirmada >= 0 and cantidad_confirmada <= cupos)
);

create unique index if not exists invitados_token_uidx
    on public.invitados(token);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trg_invitados_updated_at on public.invitados;

create trigger trg_invitados_updated_at
before update on public.invitados
for each row
execute function public.set_updated_at();