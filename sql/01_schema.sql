-- =========================================================
-- 01_schema.sql
-- Esquema principal de la base de datos
-- =========================================================

create extension if not exists pgcrypto;

-- Limpieza opcional (comentar si ya existen datos)
drop view if exists public.vw_invitados_rsvp;
drop table if exists public.rsvp_confirmaciones;
drop table if exists public.invitados;

-- Tabla de invitados
create table public.invitados (
    id bigint generated always as identity primary key,
    nombre_apellido text not null,
    cupos_reservados integer not null default 1,
    rol text,
    token text not null unique default encode(gen_random_bytes(16), 'hex'),
    activo boolean not null default true,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),

    constraint invitados_cupos_reservados_chk
        check (cupos_reservados >= 1)
);

comment on table public.invitados is 'Listado de invitados de la boda';
comment on column public.invitados.nombre_apellido is 'Nombre visible del invitado o grupo invitado';
comment on column public.invitados.cupos_reservados is 'Cantidad máxima de personas reservadas para este invitado';
comment on column public.invitados.rol is 'Ej: Caballero de Honor, Dama de Honor, Cantante, etc.';
comment on column public.invitados.token is 'Token único para construir el link personalizado de invitación';

create index idx_invitados_token on public.invitados(token);
create index idx_invitados_nombre on public.invitados(nombre_apellido);

-- Tabla RSVP
create table public.rsvp_confirmaciones (
    id bigint generated always as identity primary key,
    invitado_id bigint not null,
    asiste boolean not null,
    cantidad_confirmada integer not null default 1,
    telefono text,
    mensaje text,
    confirmado_en timestamp with time zone not null default now(),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),

    constraint fk_rsvp_invitado
        foreign key (invitado_id)
        references public.invitados(id)
        on delete cascade,

    constraint uq_rsvp_invitado
        unique (invitado_id),

    constraint rsvp_cantidad_confirmada_chk
        check (cantidad_confirmada >= 0)
);

comment on table public.rsvp_confirmaciones is 'Respuesta RSVP de cada invitado';
comment on column public.rsvp_confirmaciones.asiste is 'true si asistirá, false si no asistirá';
comment on column public.rsvp_confirmaciones.cantidad_confirmada is 'Cantidad de personas que confirma el invitado';

create index idx_rsvp_invitado_id on public.rsvp_confirmaciones(invitado_id);
create index idx_rsvp_asiste on public.rsvp_confirmaciones(asiste);

-- Trigger para updated_at
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

drop trigger if exists trg_rsvp_updated_at on public.rsvp_confirmaciones;
create trigger trg_rsvp_updated_at
before update on public.rsvp_confirmaciones
for each row
execute function public.set_updated_at();

-- Validación de cupos
create or replace function public.validar_cupos_rsvp()
returns trigger
language plpgsql
as $$
declare
    v_cupos_reservados integer;
begin
    select cupos_reservados into v_cupos_reservados
    from public.invitados
    where id = new.invitado_id;

    if v_cupos_reservados is null then
        raise exception 'No existe el invitado con id %', new.invitado_id;
    end if;

    if new.asiste = false then
        new.cantidad_confirmada := 0;
        return new;
    end if;

    if new.cantidad_confirmada < 1 then
        raise exception 'La cantidad confirmada debe ser mínimo 1 cuando el invitado sí asiste';
    end if;

    if new.cantidad_confirmada > v_cupos_reservados then
        raise exception 'La cantidad confirmada (%) supera los cupos reservados (%) para el invitado %',
            new.cantidad_confirmada, v_cupos_reservados, new.invitado_id;
    end if;

    return new;
end;
$$;

drop trigger if exists trg_validar_cupos_rsvp on public.rsvp_confirmaciones;
create trigger trg_validar_cupos_rsvp
before insert or update on public.rsvp_confirmaciones
for each row
execute function public.validar_cupos_rsvp();

-- Función para confirmar RSVP por token
create or replace function public.confirmar_rsvp_por_token(
    p_token text,
    p_asiste boolean,
    p_cantidad_confirmada integer default 1,
    p_telefono text default null,
    p_mensaje text default null
)
returns public.rsvp_confirmaciones
language plpgsql
security definer
as $$
declare
    v_invitado public.invitados;
    v_result public.rsvp_confirmaciones;
begin
    select * into v_invitado
    from public.invitados
    where token = p_token and activo = true;

    if not found then
        raise exception 'Invitado no encontrado o inactivo';
    end if;

    insert into public.rsvp_confirmaciones (
        invitado_id, asiste, cantidad_confirmada, telefono, mensaje, confirmado_en
    ) values (
        v_invitado.id, p_asiste, p_cantidad_confirmada, p_telefono, p_mensaje, now()
    )
    on conflict (invitado_id)
    do update set
        asiste = excluded.asiste,
        cantidad_confirmada = excluded.cantidad_confirmada,
        telefono = excluded.telefono,
        mensaje = excluded.mensaje,
        confirmado_en = now(),
        updated_at = now()
    returning * into v_result;

    return v_result;
end;
$$;
