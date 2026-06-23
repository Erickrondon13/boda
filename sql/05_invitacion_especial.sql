-- 1. Eliminar vista para evitar dependencias
drop view if exists public.v_invitados_admin;

-- 2. Agregar columnas
alter table public.invitados add column if not exists tipo_invitacion_especial text;
alter table public.invitados add column if not exists invitacion_especial_aceptada boolean;

-- 3. Recrear vista con las nuevas columnas
create view public.v_invitados_admin as
select
    i.id,
    i.nombre_apellido,
    i.cupos,
    i.confirmado,
    i.cantidad_confirmada,
    i.token,
    i.telefono,
    i.mensaje,
    i.fecha_confirmacion,
    i.tipo_invitacion_especial,
    i.invitacion_especial_aceptada,
    i.created_at,
    i.updated_at,
    'https://erickrondon13.github.io/boda/?id=' || i.token::text as link_invitacion,
    'https://erickrondon13.github.io/boda/especial.html?token=' || i.token::text as link_invitacion_especial
from public.invitados i
order by i.nombre_apellido;



update public.invitados
set tipo_invitacion_especial = 'invitacion_especial'