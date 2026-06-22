/* ===================================================
   APP - Lógica principal de la invitación
   =================================================== */

// ======== ESTADO GLOBAL ========
const state = {
  token: null,
  invitado: null,
  asiste: null,
  confirmado: false
};

// ======== CRONOMETRO ========
(function initCountdown() {
  const TARGET = new Date('2026-11-15T16:00:00-05:00');

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function update() {
    const now = new Date();
    const diff = TARGET - now;

    if (diff <= 0) {
      document.getElementById('cd-dias').textContent = '00';
      document.getElementById('cd-horas').textContent = '00';
      document.getElementById('cd-minutos').textContent = '00';
      document.getElementById('cd-segundos').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-dias').textContent = pad(days);
    document.getElementById('cd-horas').textContent = pad(hours);
    document.getElementById('cd-minutos').textContent = pad(minutes);
    document.getElementById('cd-segundos').textContent = pad(seconds);
  }

  update();
  setInterval(update, 1000);
})();

// ======== SCROLL ANIMATIONS ========
(function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
})();

// ======== MUSICA ========
let musicaReproduciendo = false;

function toggleMusic() {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('music-toggle');

  if (!audio.querySelector('source').src) {
    return;
  }

  if (musicaReproduciendo) {
    audio.pause();
    btn.classList.add('paused');
  } else {
    audio.play().catch(() => {});
    btn.classList.remove('paused');
  }
  musicaReproduciendo = !musicaReproduciendo;
}

// ======== INICIALIZAR RSVP ========
document.addEventListener('DOMContentLoaded', initRSVP);

async function initRSVP() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  if (!token) {
    mostrarInvitacionGeneral();
    ocultarCarga();
    return;
  }

  state.token = token;

  try {
    const invitado = await getInvitadoByToken(token);

    if (!invitado) {
      ocultarCarga();
      document.getElementById('token-error').classList.add('mostrar');
      return;
    }

    state.invitado = invitado;
    ocultarCarga();
    mostrarRsvp(invitado);
  } catch (err) {
    console.error('Error al cargar invitado:', err);
    ocultarCarga();
    document.getElementById('token-error').classList.add('mostrar');
  }
}

function mostrarInvitacionGeneral() {
  document.getElementById('rsvp-loading').style.display = 'none';
  const content = document.getElementById('rsvp-content');
  content.style.display = 'block';
  content.querySelector('.section-title').textContent = 'Invitación General';

  document.getElementById('rsvp-saludo').innerHTML = 'Gracias por visitar nuestra invitación';
  document.getElementById('invitado-nombre').textContent = '';
  document.getElementById('rsvp-cupos').innerHTML =
    'Para confirmar tu asistencia, usa el enlace personalizado que te enviamos.';

  document.getElementById('rsvp-botones').style.display = 'none';
  document.getElementById('rsvp-form').classList.remove('mostrar');
}

function ocultarCarga() {
  document.getElementById('rsvp-loading').style.display = 'none';
}

function mostrarRsvp(invitado) {
  const content = document.getElementById('rsvp-content');
  content.style.display = 'block';

  document.getElementById('invitado-nombre').textContent = invitado.nombre_apellido;
  document.getElementById('invitado-cupos').textContent = invitado.cupos_reservados;

  const cuposSelect = document.getElementById('cantidad');
  cuposSelect.innerHTML = '';
  for (let i = 1; i <= invitado.cupos_reservados; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = i + (i === 1 ? ' persona' : ' personas');
    cuposSelect.appendChild(opt);
  }

  // Si ya confirmó antes, mostrar estado
  verificarConfirmacionPrevia(invitado);
}

async function verificarConfirmacionPrevia(invitado) {
  try {
    const client = initSupabase();
    const { data } = await client
      .from('rsvp_confirmaciones')
      .select('*')
      .eq('invitado_id', invitado.id)
      .single();

    if (data) {
      state.confirmado = true;
      state.asiste = data.asiste;

      if (data.asiste) {
        mostrarConfirmacion(data.cantidad_confirmada);
      } else {
        // No asiste - mostrar confirmación de no asistencia
        document.getElementById('rsvp-botones').style.display = 'none';
        document.getElementById('confirmacion').classList.add('mostrar');
        document.querySelector('.confirmacion-titulo').textContent = 'Confirmación recibida';
        document.querySelector('.confirmacion-texto').innerHTML =
          'Hemos recibido tu respuesta. Entendemos que no podrás acompañarnos.<br /><br />' +
          '<strong>Erick Rondón</strong> y <strong>Telma Verónica</strong> 💕';
      }
    }
  } catch (e) {
    // No hay confirmación previa - mostrar botones
  }
}

// ======== SELECCION DE ASISTENCIA ========
function seleccionarAsistencia(asiste) {
  state.asiste = asiste;
  const form = document.getElementById('rsvp-form');
  const botones = document.getElementById('rsvp-botones');

  if (asiste) {
    form.classList.add('mostrar');
    form.style.display = 'block';
    botones.style.display = 'none';
  } else {
    // No asiste - enviar directamente
    enviarConfirmacionNoAsiste();
  }
}

// ======== ENVIAR CONFIRMACION ========
async function enviarConfirmacion() {
  const cantidad = parseInt(document.getElementById('cantidad').value);
  const telefono = document.getElementById('telefono').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();
  const btn = document.getElementById('btn-enviar');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  try {
    await confirmarAsistencia(state.token, true, cantidad, telefono, mensaje);
    mostrarConfirmacion(cantidad);
  } catch (err) {
    alert('Error al enviar confirmación. Por favor intenta de nuevo.');
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Confirmar Asistencia';
  }
}

async function enviarConfirmacionNoAsiste() {
  const btn = document.getElementById('btn-enviar');
  try {
    await confirmarAsistencia(state.token, false, 0, null, null);
    document.getElementById('rsvp-botones').style.display = 'none';
    document.getElementById('confirmacion').classList.add('mostrar');
    document.querySelector('.confirmacion-titulo').textContent = 'Confirmación recibida';
    document.querySelector('.confirmacion-texto').innerHTML =
      'Hemos recibido tu respuesta. Entendemos que no podrás acompañarnos.<br /><br />' +
      '<strong>Erick Rondón</strong> y <strong>Telma Verónica</strong> 💕';
  } catch (err) {
    alert('Error al enviar confirmación. Por favor intenta de nuevo.');
    console.error(err);
  }
}

function mostrarConfirmacion(cantidad) {
  document.getElementById('rsvp-form').classList.remove('mostrar');
  document.getElementById('rsvp-form').style.display = 'none';
  document.getElementById('rsvp-botones').style.display = 'none';
  document.getElementById('confirmacion').classList.add('mostrar');
  document.querySelector('.confirmacion-titulo').textContent = '¡Confirmación Recibida!';
  document.querySelector('.confirmacion-texto').innerHTML =
    '¡Qué alegría! Ya contamos contigo para el gran día.' +
    (cantidad > 1 ? ' (' + cantidad + ' personas)' : '') +
    '<br /><br />' +
    '<strong>Erick Rondón</strong> y <strong>Telma Verónica</strong> 💕';
}

// ======== CANCELAR CONFIRMACION ========
async function cancelarConfirmacion() {
  if (!confirm('¿Estás seguro de cancelar tu confirmación?')) return;

  try {
    await cancelarConfirmacion(state.token);
    state.confirmado = false;
    state.asiste = null;

    document.getElementById('confirmacion').classList.remove('mostrar');
    document.getElementById('rsvp-botones').style.display = 'flex';
    document.getElementById('rsvp-form').classList.remove('mostrar');
    document.getElementById('rsvp-form').style.display = 'none';
    document.querySelector('.confirmacion-titulo').textContent = '¡Confirmación Recibida!';
    document.querySelector('.confirmacion-texto').innerHTML =
      '¡Qué alegría! Ya contamos contigo para el gran día.<br /><br />' +
      '<strong>Erick Rondón</strong> y <strong>Telma Verónica</strong> 💕';
  } catch (err) {
    alert('Error al cancelar. Contacta a los novios.');
    console.error(err);
  }
}

// ======== AÑADIR CLASE FADE-IN A SECCIONES ========
document.querySelectorAll('.section, .frase, .fecha-section, .rsvp-section').forEach(el => {
  if (!el.classList.contains('fade-in')) {
    el.classList.add('fade-in');
  }
});
