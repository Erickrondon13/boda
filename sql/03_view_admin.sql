-- =========================================================
-- 03_view_admin.sql
-- Vista para panel de administración
-- =========================================================

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
left join public.rsvp_confirmaciones r on r.invitado_id = i.id;

comment on view public.vw_invitados_rsvp is 'Vista resumen de invitados y su estado RSVP';
