const SUPABASE_URL = 'sb_publishable_uOkx4yC8BQMKREvoNpTcMg_W83eCvYb';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoaXJjb2p3YWtiamFqenp3dmdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMzczMDgsImV4cCI6MjA5NzcxMzMwOH0.B8sWIxbdVJC_a7UIu62--vCKuJ6U1VGsRoNLj-kMX2Q';

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

const PUBLIC_INVITATION_BASE_URL = window.location.origin + window.location.pathname.replace(/[^/]*$/, '') + 'index.html';

async function fetchGuestByToken(token) {
    const { data, error } = await supabaseClient
        .from('invitados')
        .select('*')
        .eq('token', token)
        .eq('activo', true)
        .single();

    if (error || !data) throw new Error('Invitación no válida o invitado no encontrado.');
    return data;
}

async function fetchExistingRsvp(invitadoId) {
    const { data, error } = await supabaseClient
        .from('vw_invitados_rsvp')
        .select('asiste, cantidad_confirmada, telefono, mensaje, estado_rsvp')
        .eq('id', invitadoId)
        .single();

    if (error || !data || data.estado_rsvp === 'pendiente') return null;
    return data;
}

async function submitRsvp(token, asiste, cantidadConfirmada, telefono, mensaje) {
    const { data, error } = await supabaseClient.rpc('confirmar_rsvp_por_token', {
        p_token: token,
        p_asiste: asiste,
        p_cantidad_confirmada: cantidadConfirmada,
        p_telefono: telefono || null,
        p_mensaje: mensaje || null
    });

    if (error) throw error;
    return data;
}
