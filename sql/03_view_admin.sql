create or replace view public.v_invitados_admin as
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
    i.created_at,
    i.updated_at,
    case
        when i.confirmado then 'confirmado'
        when i.fecha_confirmacion is not null then 'rechazado'
        else 'pendiente'
    end as estado,
    case
        when i.civil_confirmado then 'confirmado'
        when i.civil_fecha_confirmacion is not null then 'rechazado'
        else 'pendiente'
    end as civil_estado,
    'https://erickrondon13.github.io/boda/?id=' || i.token::text as link_invitacion,
    'https://erickrondon13.github.io/boda/civil.html?token=' || i.token::text as link_civil
from public.invitados i
order by i.nombre_apellido;