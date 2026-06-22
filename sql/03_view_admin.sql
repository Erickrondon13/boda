create or replace view public.v_invitados_admin as
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
    i.created_at,
    i.updated_at,
    'https://Erickrondon13.github.io/boda/?id=' || i.token::text as link_invitacion
from public.invitados i
order by i.nombre_apellido;