const SUPABASE_CONFIG = {
  url: 'https://ahircojwakbjajzzwvgc.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoaXJjb2p3YWtiamFqenp3dmdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMzczMDgsImV4cCI6MjA5NzcxMzMwOH0.B8sWIxbdVJC_a7UIu62--vCKuJ6U1VGsRoNLj-kMX2Q'
};

let supabaseClient = null;

function initSupabase() {
  if (supabaseClient) return supabaseClient;
  supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  return supabaseClient;
}

async function getInvitadoByToken(token) {
  const client = initSupabase();
  const { data, error } = await client
    .from('invitados')
    .select('*')
    .eq('token', token)
    .eq('activo', true)
    .single();
  if (error) return null;
  return data;
}

async function confirmarAsistencia(token, asiste, cantidadConfirmada, telefono, mensaje) {
  const client = initSupabase();
  const { data, error } = await client.rpc('confirmar_rsvp_por_token', {
    p_token: token,
    p_asiste: asiste,
    p_cantidad_confirmada: cantidadConfirmada,
    p_telefono: telefono || null,
    p_mensaje: mensaje || null
  });
  if (error) throw error;
  return data;
}

async function cancelarConfirmacion(token) {
  const invitado = await getInvitadoByToken(token);
  if (!invitado) throw new Error('Invitado no encontrado');
  const client = initSupabase();
  const { error } = await client
    .from('rsvp_confirmaciones')
    .delete()
    .eq('invitado_id', invitado.id);
  if (error) throw error;
}
