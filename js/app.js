// =========================================================
// REFERENCIAS DOM
// =========================================================
const guestNamesEl = document.getElementById('guestNames')
const guestSpotsEl = document.getElementById('guestSpots')
const guestRoleBadgeEl = document.getElementById('guestRoleBadge')
const guestStatusBoxEl = document.getElementById('guestStatusBox')

const rsvpCardEl = document.getElementById('rsvpCard')
const rsvpFormWrapperEl = document.getElementById('rsvpFormWrapper')
const confirmSuccessBoxEl = document.getElementById('confirmSuccessBox')
const confirmSuccessTextEl = document.getElementById('confirmSuccessText')

const rsvpFormEl = document.getElementById('rsvpForm')
const btnConfirmarEl = document.getElementById('btnConfirmar')
const formStatusEl = document.getElementById('formStatus')

const cantidadSelectEl = document.getElementById('cantidad_confirmada')
const cantidadHelperEl = document.getElementById('cantidadHelper')
const groupCantidadEl = document.getElementById('groupCantidad')

const asisteSiEl = document.getElementById('asiste_si')
const asisteNoEl = document.getElementById('asiste_no')

const telefonoEl = document.getElementById('telefono')
const mensajeEl = document.getElementById('mensaje')

// =========================================================
// ESTADO
// =========================================================
let invitadoActual = null
let tokenActual = null

// =========================================================
// HELPERS UI
// =========================================================
function setStatus(element, type, message) {
  element.className = 'status-box show'

  if (type === 'success') {
    element.classList.add('status-success')
  } else if (type === 'error') {
    element.classList.add('status-error')
  } else {
    element.classList.add('status-info')
  }

  element.textContent = message
}

function clearStatus(element) {
  element.className = 'status-box'
  element.textContent = ''
}

function disableRsvpForm(disabled) {
  const controls = rsvpFormEl.querySelectorAll('input, select, textarea, button')
  controls.forEach(ctrl => ctrl.disabled = disabled)
}

function escapeHtml(text) {
  return String(text ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get('token')
}

function fillCantidadOptions(maxCupos) {
  cantidadSelectEl.innerHTML = ''

  for (let i = 1; i <= maxCupos; i++) {
    const option = document.createElement('option')
    option.value = String(i)
    option.textContent = String(i)
    cantidadSelectEl.appendChild(option)
  }

  cantidadHelperEl.textContent =
    `Tienes ${maxCupos} lugar${maxCupos > 1 ? 'es' : ''} reservado${maxCupos > 1 ? 's' : ''}.`
}

function toggleCantidadByAsistencia() {
  const asiste = asisteSiEl.checked
  groupCantidadEl.classList.toggle('hidden', !asiste)
}

function renderInvitado(invitado) {
  invitadoActual = invitado

  guestNamesEl.textContent = `Hola, ${invitado.nombre_apellido}`
  guestSpotsEl.textContent = invitado.cupos_reservados
  guestRoleBadgeEl.textContent = invitado.rol || APP_CONFIG.defaultRoleLabel

  fillCantidadOptions(invitado.cupos_reservados)
  setStatus(guestStatusBoxEl, 'info', 'Tu invitación está lista. Ya puedes confirmar tu asistencia.')
}

function renderRsvpExistente(rsvp) {
  if (!rsvp) return

  if (rsvp.asiste === true) {
    confirmSuccessTextEl.innerHTML = `
      ¡Qué alegría! Ya contamos contigo para el gran día.
      <strong>Erick Rondón y Telma Verónica</strong>.
    `
  } else {
    confirmSuccessTextEl.innerHTML = `
      Gracias por confirmarnos. Lamentaremos no contar contigo ese día,
      pero agradecemos mucho que nos hayas avisado 💛
    `
  }

  rsvpFormWrapperEl.classList.add('hidden')
  confirmSuccessBoxEl.classList.remove('hidden')
}

function renderInvitacionInvalida(message) {
  guestNamesEl.textContent = 'Invitación no disponible'
  guestSpotsEl.textContent = '0'
  guestRoleBadgeEl.textContent = 'Acceso no válido'

  setStatus(guestStatusBoxEl, 'error', message || 'No encontramos una invitación válida para este enlace.')

  rsvpFormWrapperEl.classList.add('hidden')
}

// =========================================================
// ANIMACIONES
// =========================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show')
    }
  })
}, { threshold: 0.12 })

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))

// =========================================================
// FORM RSVP
// =========================================================
function buildRsvpPayload() {
  const asiste = rsvpFormEl.querySelector('input[name="asiste"]:checked')?.value === 'true'
  const cantidad = asiste ? Number(cantidadSelectEl.value || 1) : 0

  return {
    p_token: tokenActual,
    p_asiste: asiste,
    p_cantidad_confirmada: cantidad,
    p_telefono: telefonoEl.value.trim() || null,
    p_mensaje: mensajeEl.value.trim() || null,
  }
}

async function onSubmitRsvp(event) {
  event.preventDefault()
  clearStatus(formStatusEl)

  if (!tokenActual || !invitadoActual) {
    setStatus(formStatusEl, 'error', 'No hay una invitación válida para confirmar.')
    return
  }

  const payload = buildRsvpPayload()

  try {
    disableRsvpForm(true)
    btnConfirmarEl.textContent = 'Guardando confirmación...'

    await confirmarRsvpPorToken(payload)

    if (payload.p_asiste) {
      confirmSuccessTextEl.innerHTML = `
        ¡Qué alegría! Ya contamos contigo para el gran día.
        <strong>Erick Rondón y Telma Verónica</strong>.
      `
    } else {
      confirmSuccessTextEl.innerHTML = `
        Gracias por confirmarnos. Lamentaremos no contar contigo ese día,
        pero agradecemos mucho que nos hayas avisado 💛
      `
    }

    rsvpFormWrapperEl.classList.add('hidden')
    confirmSuccessBoxEl.classList.remove('hidden')
    setStatus(guestStatusBoxEl, 'success', 'Tu confirmación ya quedó registrada.')

  } catch (error) {
    console.error(error)
    setStatus(formStatusEl, 'error', error?.message || 'No se pudo guardar la confirmación. Intenta de nuevo.')
  } finally {
    disableRsvpForm(false)
    btnConfirmarEl.textContent = 'Confirmar asistencia'
  }
}

// =========================================================
// INIT
// =========================================================
async function initPage() {
  try {
    tokenActual = getTokenFromUrl()

    if (!tokenActual) {
      renderInvitacionInvalida('Este enlace no contiene token de invitación.')
      return
    }

    const invitado = await cargarInvitadoPorToken(tokenActual)
    renderInvitado(invitado)

    const rsvpExistente = await cargarRsvpPorInvitadoId(invitado.id)

    if (rsvpExistente) {
      renderRsvpExistente(rsvpExistente)
    }
  } catch (error) {
    console.error(error)
    renderInvitacionInvalida(error?.message || 'No se pudo cargar la invitación.')
  }
}

// Eventos
asisteSiEl.addEventListener('change', toggleCantidadByAsistencia)
asisteNoEl.addEventListener('change', toggleCantidadByAsistencia)
rsvpFormEl.addEventListener('submit', onSubmitRsvp)

toggleCantidadByAsistencia()
initPage()
