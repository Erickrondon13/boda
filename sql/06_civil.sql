-- 1. Eliminar vista para evitar dependencias
drop view if exists public.v_invitados_admin;

-- 2. Agregar columna civil
alter table public.invitados add column if not exists civil boolean not null default false;

-- 3. Recrear vista con la nueva columna
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
    i.civil,
    i.fecha_confirmacion,
    i.tipo_invitacion_especial,
    i.invitacion_especial_aceptada,
    i.created_at,
    i.updated_at,
    'https://erickrondon13.github.io/boda/?id=' || i.token::text as link_invitacion,
    'https://erickrondon13.github.io/boda/especial.html?token=' || i.token::text as link_invitacion_especial
from public.invitados i
order by i.nombre_apellido;

-- 4. Inicialmente todos los invitados son de boda religiosa (civil = false)
update public.invitados set civil = false where civil is null;
