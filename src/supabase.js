import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ahircojwakbjajzzwvgc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoaXJjb2p3YWtiamFqenp3dmdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMzczMDgsImV4cCI6MjA5NzcxMzMwOH0.B8sWIxbdVJC_a7UIu62--vCKuJ6U1VGsRoNLj-kMX2Q'
)

export async function getInvitadoByToken(token) {
  const { data, error } = await supabase
    .from('invitados')
    .select('*')
    .eq('token', token)
    .eq('activo', true)
    .single()
  if (error) return null
  return data
}

export async function getConfirmacionByInvitadoId(invitadoId) {
  const { data, error } = await supabase
    .from('rsvp_confirmaciones')
    .select('*')
    .eq('invitado_id', invitadoId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function confirmarAsistencia(token, asiste, cantidadConfirmada, telefono, mensaje) {
  const { data, error } = await supabase.rpc('confirmar_rsvp_por_token', {
    p_token: token,
    p_asiste: asiste,
    p_cantidad_confirmada: cantidadConfirmada,
    p_telefono: telefono || null,
    p_mensaje: mensaje || null,
  })
  if (error) throw error
  return data
}

export async function cancelarConfirmacion(token) {
  const invitado = await getInvitadoByToken(token)
  if (!invitado) throw new Error('Invitado no encontrado')
  const { error } = await supabase
    .from('rsvp_confirmaciones')
    .delete()
    .eq('invitado_id', invitado.id)
  if (error) throw error
}
