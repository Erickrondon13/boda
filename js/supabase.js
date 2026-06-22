const APP_CONFIG = {
  weddingDate: '2026-11-15T16:00:00',
  supabaseUrl: 'https://ahircojwakbjajzzwvgc.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoaXJjb2p3YWtiamFqenp3dmdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMzczMDgsImV4cCI6MjA5NzcxMzMwOH0.B8sWIxbdVJC_a7UIu62--vCKuJ6U1VGsRoNLj-kMX2Q',
  defaultRoleLabel: 'Invitación especial',
}

let supabaseClient = null

function initSupabase() {
  if (supabaseClient) return supabaseClient
  supabaseClient = supabase.createClient(APP_CONFIG.supabaseUrl, APP_CONFIG.supabaseAnonKey)
  return supabaseClient
}

async function cargarInvitadoPorToken(token) {
  const client = initSupabase()
  const { data, error } = await client
    .from('invitados')
    .select('id, nombre_apellido, cupos_reservados, rol, token, activo')
    .eq('token', token)
    .eq('activo', true)
    .single()

  if (error || !data) throw new Error('No encontramos una invitación válida para este enlace.')
  return data
}

async function cargarRsvpPorInvitadoId(invitadoId) {
  const client = initSupabase()
  const { data, error } = await client
    .from('vw_invitados_rsvp')
    .select('asiste, cantidad_confirmada, telefono, mensaje, estado_rsvp')
    .eq('id', invitadoId)
    .single()

  if (error || !data || data.estado_rsvp === 'pendiente') return null
  return data
}

async function confirmarRsvpPorToken(payload) {
  const client = initSupabase()
  const { data, error } = await client.rpc('confirmar_rsvp_por_token', payload)
  if (error) throw error
  return data
}
