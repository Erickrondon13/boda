// =========================================================
// ADMIN - Lógica del panel de administración
// =========================================================

const adminTableBody = document.getElementById('adminTableBody')
const adminLoading = document.getElementById('adminLoading')
const adminError = document.getElementById('adminError')
const totalCount = document.getElementById('totalCount')
const confirmedCount = document.getElementById('confirmedCount')
const pendingCount = document.getElementById('pendingCount')
const declinedCount = document.getElementById('declinedCount')

let invitadosData = []
let filtroActual = 'all'

// =========================================================
// CARGAR DATOS
// =========================================================
async function cargarInvitados() {
  try {
    const client = initSupabase()
    const { data, error } = await client
      .from('vw_invitados_rsvp')
      .select('*')
      .order('nombre_apellido')

    if (error) throw error
    return data || []
  } catch (err) {
    throw err
  }
}

// =========================================================
// RENDER
// =========================================================
function renderAdmin(data) {
  const filtrados = filtroActual === 'all'
    ? data
    : data.filter(inv => inv.estado_rsvp === filtroActual)

  // Resumen
  const total = data.length
  const confirmados = data.filter(inv => inv.estado_rsvp === 'confirmado').length
  const pendientes = data.filter(inv => inv.estado_rsvp === 'pendiente').length
  const rechazados = data.filter(inv => inv.estado_rsvp === 'rechazado').length

  totalCount.textContent = total
  confirmedCount.textContent = confirmados
  pendingCount.textContent = pendientes
  declinedCount.textContent = rechazados

  // Tabla
  if (filtrados.length === 0) {
    adminTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-soft);">
      No hay invitados con este filtro.
    </td></tr>`
    return
  }

  const baseUrl = `${window.location.origin}${window.location.pathname.replace(/admin\.html$/, '')}index.html`

  adminTableBody.innerHTML = filtrados.map(inv => {
    const badgeClass = inv.estado_rsvp === 'confirmado' ? 'badge-confirmado'
      : inv.estado_rsvp === 'rechazado' ? 'badge-rechazado'
      : 'badge-pendiente'

    const badgeText = inv.estado_rsvp === 'confirmado' ? 'Confirmado'
      : inv.estado_rsvp === 'rechazado' ? 'Rechazado'
      : 'Pendiente'

    const link = `${baseUrl}?token=${inv.token}`

    return `<tr>
      <td><strong>${escapeHtml(inv.nombre_apellido)}</strong></td>
      <td>${inv.cupos_reservados}</td>
      <td>${escapeHtml(inv.rol || '-')}</td>
      <td><span class="badge ${badgeClass}">${badgeText}</span></td>
      <td>${inv.cantidad_confirmada ?? '-'}</td>
      <td>${escapeHtml(inv.telefono || '-')}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapeHtml(inv.mensaje || '')}">
        ${escapeHtml(inv.mensaje || '-')}
      </td>
      <td class="token-cell" title="${escapeHtml(link)}">
        <a href="${link}" target="_blank" style="color:var(--gold);">${inv.token}</a>
      </td>
    </tr>`
  }).join('')
}

// =========================================================
// FILTROS
// =========================================================
function aplicarFiltro(filtro) {
  filtroActual = filtro

  document.querySelectorAll('.filter-btn').forEach(btn => {
    const isActive = btn.dataset.filter === filtro
    btn.classList.toggle('active', isActive)
    btn.classList.toggle('btn-primary', isActive)
    btn.classList.toggle('btn-secondary', !isActive)
  })

  renderAdmin(invitadosData)
}

// =========================================================
// INIT
// =========================================================
async function initAdmin() {
  try {
    initSupabase()

    invitadosData = await cargarInvitados()

    adminLoading.classList.remove('show')
    adminLoading.classList.add('hidden')

    renderAdmin(invitadosData)
  } catch (err) {
    console.error(err)
    adminLoading.classList.remove('show')
    adminLoading.classList.add('hidden')
    adminError.classList.add('show')
    adminError.textContent = 'Error al cargar los datos: ' + (err.message || 'Error de conexión')
  }
}

// Eventos filtros
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => aplicarFiltro(btn.dataset.filter))
})

initAdmin()
