# 🎊 Boda Erick & Telma — Invitación Web

Invitación de boda interactiva con RSVP conectado a Supabase.

## 🚀 Deploy en Vercel

1. Crea un proyecto en [Supabase](https://supabase.com) y ejecuta el SQL de `README.md` para crear las tablas.
2. Obtén tu `Project URL` y `anon public key` desde Ajustes → API.
3. Abre `js/supabase.js` y reemplaza los valores de `SUPABASE_CONFIG`.
4. Sube el repo a GitHub.
5. En [Vercel](https://vercel.com), importa el repo y despliega (no necesita build command).
6. **Opcional:** Agrega una foto real de los novios en `img/foto-novios.jpg` y actualiza `index.html`.

## 🔗 Links Personalizados

Cada invitado tiene un `token` único. El link se forma así:

```
https://tu-dominio.vercel.app/?token=TOKEN_DEL_INVITADO
```

## 🎵 Música de Fondo

Coloca un archivo `.mp3` en `musica/cancion.mp3` y actualiza el `<source>` en `index.html`.

---

# boda-- =========================================================
-- BODA - MODELO COMPLETO
-- Erick & Telma
-- Incluye:
-- 1) invitados
-- 2) rsvp_confirmaciones
-- 3) vista resumen
-- 4) carga inicial de invitados
-- =========================================================

-- ---------------------------------------------------------
-- 0. EXTENSIONES
-- ---------------------------------------------------------
create extension if not exists pgcrypto;

-- ---------------------------------------------------------
-- 1. LIMPIEZA OPCIONAL (si quieres reiniciar)
--    Si NO quieres borrar lo existente, comenta este bloque
-- ---------------------------------------------------------
drop view if exists public.vw_invitados_rsvp;
drop table if exists public.rsvp_confirmaciones;
drop table if exists public.invitados;

-- ---------------------------------------------------------
-- 2. TABLA DE INVITADOS
-- ---------------------------------------------------------
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

-- ---------------------------------------------------------
-- 3. TABLA RSVP / CONFIRMACIONES
--    Una fila por invitado. Si vuelve a confirmar, se actualiza.
-- ---------------------------------------------------------
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

-- ---------------------------------------------------------
-- 4. FUNCION PARA updated_at
-- ---------------------------------------------------------
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

-- ---------------------------------------------------------
-- 5. FUNCION PARA VALIDAR CUPOS EN RSVP
--    Evita que alguien confirme más cupos de los reservados
-- ---------------------------------------------------------
create or replace function public.validar_cupos_rsvp()
returns trigger
language plpgsql
as $$
declare
    v_cupos_reservados integer;
begin
    select cupos_reservados
      into v_cupos_reservados
      from public.invitados
     where id = new.invitado_id;

    if v_cupos_reservados is null then
        raise exception 'No existe el invitado con id %', new.invitado_id;
    end if;

    -- Si NO asiste, cantidad_confirmada debe ser 0
    if new.asiste = false then
        new.cantidad_confirmada := 0;
        return new;
    end if;

    -- Si asiste, debe confirmar al menos 1
    if new.cantidad_confirmada < 1 then
        raise exception 'La cantidad confirmada debe ser mínimo 1 cuando el invitado sí asiste';
    end if;

    -- No puede superar los cupos reservados
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

-- ---------------------------------------------------------
-- 6. VISTA RESUMEN PARA CONSULTAR TODO FÁCIL
-- ---------------------------------------------------------
create or replace view public.vw_invitados_rsvp as
select
    i.id,
    i.nombre_apellido,
    i.cupos_reservados,
    i.rol,
    i.token,
    i.activo,
    case
        when r.id is null then 'pendiente'
        when r.asiste = true then 'confirmado'
        when r.asiste = false then 'rechazado'
    end as estado_rsvp,
    r.asiste,
    r.cantidad_confirmada,
    r.telefono,
    r.mensaje,
    r.confirmado_en,
    i.created_at,
    i.updated_at
from public.invitados i
left join public.rsvp_confirmaciones r
       on r.invitado_id = i.id;

comment on view public.vw_invitados_rsvp is 'Vista resumen de invitados y su estado RSVP';

-- ---------------------------------------------------------
-- 7. FUNCION OPCIONAL PARA CONFIRMAR RSVP POR TOKEN
--    Esto te sirve si desde el frontend mandas token en vez de id.
-- ---------------------------------------------------------
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
    select *
      into v_invitado
      from public.invitados
     where token = p_token
       and activo = true;

    if not found then
        raise exception 'Invitado no encontrado o inactivo';
    end if;

    insert into public.rsvp_confirmaciones (
        invitado_id,
        asiste,
        cantidad_confirmada,
        telefono,
        mensaje,
        confirmado_en
    )
    values (
        v_invitado.id,
        p_asiste,
        p_cantidad_confirmada,
        p_telefono,
        p_mensaje,
        now()
    )
    on conflict (invitado_id)
    do update
       set asiste = excluded.asiste,
           cantidad_confirmada = excluded.cantidad_confirmada,
           telefono = excluded.telefono,
           mensaje = excluded.mensaje,
           confirmado_en = now(),
           updated_at = now()
    returning * into v_result;

    return v_result;
end;
$$;

comment on function public.confirmar_rsvp_por_token(text, boolean, integer, text, text)
is 'Inserta o actualiza el RSVP de un invitado usando el token único del link';

-- ---------------------------------------------------------
-- 8. CARGA INICIAL DE INVITADOS
--    OJO: aquí por defecto todos quedan con 2 cupos.
--    Puedes cambiar el cupo por persona luego con UPDATE.
-- ---------------------------------------------------------
insert into public.invitados (nombre_apellido, cupos_reservados, rol)
values
('Almenia', 2, null),
('William', 2, null),
('Arlenis', 2, null),
('Natalia', 2, null),
('Ricardo', 2, null),
('Jose', 2, null),
('Yarlis', 2, null),
('Rosa', 2, null),
('Ñato', 2, null),
('Marian', 2, null),
('Esteban', 2, 'Caballero de Honor'),
('Andres', 2, 'Caballero de Honor'),
('Nicolas', 2, 'Caballero de Honor'),
('Lizeth', 2, 'Acompañante de Nicolas'),
('Natalia', 2, null),
('Ana', 2, null),
('Esposo Ana', 2, null),
('Luz Stella', 2, null),
('Rocio', 2, null),
('Lola Sther', 2, null),
('Daniel', 2, 'Acompañante de Lola'),
('Niña', 2, 'Acompañante de Lola'),
('Raúl', 2, null),
('Nancy', 2, null),
('Liz', 2, null),
('Nelson', 2, null),
('Danna', 2, null),
('Majo', 2, null),
('Santi', 2, null),
('Lady Luz', 2, null),
('Carlos Alberto', 2, null),
('Duván', 2, null),
('Ana Isabella', 2, null),
('Luisa', 2, null),
('Erick', 2, null),
('Juan Sebastian', 2, null),
('Jesús David', 2, null),
('Carlos Andrés', 2, null),
('Daviana', 2, null),
('Salomé', 2, null),
('Eliza', 2, 'Dama de Honor'),
('Mady', 2, 'Dama de Honor'),
('Shanty', 2, 'Dama de Honor'),
('Erika', 2, null),
('Fredy', 2, null),
('Jeronimo', 2, null),
('Sophia', 2, null),
('Ediner', 2, null),
('Maria de los angeles', 2, null),
('Jaime Posada', 2, null),
('Catalina', 2, null),
('Rebeca', 2, null),
('Marisol', 2, null),
('Diego', 2, null),
('Juan Diego', 2, null),
('Johana A', 2, null),
('Mauricio', 2, null),
('Daniel', 2, null),
('Sulay', 2, null),
('Quimbayo', 2, null),
('Nohemi', 2, null),
('Luisa', 2, 'Cantante'),
('Esneider', 2, null),
('Cristian', 2, null),
('Jenine Fryling', 2, null),
('Jorge Marin', 2, null);

-- ---------------------------------------------------------
-- 9. EJEMPLOS UTILES
-- ---------------------------------------------------------

-- Ver todos los invitados con su token y estado RSVP
-- select * from public.vw_invitados_rsvp order by nombre_apellido;

-- Buscar un invitado por token
-- select * from public.invitados where token = 'TOKEN_AQUI';

-- Confirmar RSVP usando la funcion por token
-- select * from public.confirmar_rsvp_por_token(
--   'TOKEN_AQUI',
--   true,
--   2,
--   '3001234567',
--   'Allá estaremos con mucho cariño'
-- );

-- Cambiar cupos de un invitado
-- update public.invitados
--    set cupos_reservados = 4
--  where nombre_apellido = 'William';

-- Ver solo los confirmados
-- select * from public.vw_invitados_rsvp
--  where estado_rsvp = 'confirmado'
--  order by nombre_apellido;