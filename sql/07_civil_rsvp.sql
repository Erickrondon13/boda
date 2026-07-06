-- 1. Eliminar vista para evitar dependencias
drop view if exists public.v_invitados_admin;

-- 2. Agregar columnas RSVP para boda civil
alter table public.invitados add column if not exists civil_confirmado boolean not null default false;
alter table public.invitados add column if not exists civil_cantidad_confirmada integer not null default 0;
alter table public.invitados add column if not exists civil_fecha_confirmacion timestamptz;

-- 3. Recrear vista con las nuevas columnas
create view public.v_invitados_admin as
select
    i.id,
    i.nombre_apellido,
    i.cupos,
    i.confirmado,
    i.cantidad_confirmada,
    i.civil_confirmado,
    i.civil_cantidad_confirmada,
    i.civil_fecha_confirmacion,
    i.token,
    i.telefono,
    i.mensaje,
    i.civil,
    i.fecha_confirmacion,
    i.tipo_invitacion_especial,
    i.invitacion_especial_aceptada,
    i.created_at,
    i.updated_at,
    'https://erickrondon13.github.io/boda/?id=' || i.token::text as link_invitacion,
    'https://erickrondon13.github.io/boda/civil.html?token=' || i.token::text as link_civil,
    'https://erickrondon13.github.io/boda/especial.html?token=' || i.token::text as link_invitacion_especial
from public.invitados i
order by i.nombre_apellido;
