const ROLE_CONFIG = {
    'Dama de Honor': { icon: '👗', color: 'var(--mint)' },
    'Caballero de Honor': { icon: '🤵', color: 'var(--silver)' },
    Cantante: { icon: '🎤', color: 'var(--gold)' },
    Fotografo: { icon: '📷', color: 'var(--navy-light)' },
};

let currentGuest = null;
let currentToken = null;

document.addEventListener('DOMContentLoaded', () => {
    initEspecial();
});

async function initEspecial() {
    const loadingSection = document.getElementById('loadingSection');
    const contentSection = document.getElementById('contentSection');
    const errorSection = document.getElementById('errorSection');
    const errorBox = document.getElementById('errorBox');

    try {
        currentToken = getTokenFromUrl();

        if (!currentToken) {
            throw new Error('No se encontró un token de invitación en la URL.');
        }

        const guest = await fetchGuest(currentToken);
        currentGuest = guest;

        if (!guest.tipo_invitacion_especial) {
            throw new Error('Esta invitación no tiene un rol especial asignado.');
        }

        renderRoleInfo(guest);

        loadingSection.classList.add('hidden');
        contentSection.classList.remove('hidden');

        bindRsvpForm(guest);
    } catch (error) {
        console.error(error);
        loadingSection.classList.add('hidden');
        errorSection.classList.remove('hidden');
        errorBox.textContent = error.message || 'No se pudo cargar la invitación especial.';
    }
}

function getTokenFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('token') || params.get('id');
}

async function fetchGuest(token) {
    const { data, error } = await supabaseClient
        .from('invitados')
        .select('*')
        .eq('token', token)
        .single();

    if (error || !data) throw new Error('Invitación no válida o invitado no encontrado.');
    return data;
}

function renderRoleInfo(guest) {
    const roleLabel = document.getElementById('roleLabel');
    const roleIcon = document.getElementById('roleIcon');
    const especialSaludo = document.getElementById('especialSaludo');
    const especialAlreadyConfirmed = document.getElementById('especialAlreadyConfirmed');
    const rsvpBox = document.getElementById('rsvpEspecialBox');
    const especialConfirmedText = document.getElementById('especialConfirmedText');

    const role = guest.tipo_invitacion_especial;
    const config = ROLE_CONFIG[role] || { icon: '⭐' };

    roleLabel.textContent = role;
    roleIcon.textContent = config.icon;

    const saludos = {
        'Dama de Honor': `${guest.nombre_apellido}, como Dama de Honor, tu lugar junto a nosotros en el altar es muy especial.`,
        'Caballero de Honor': `${guest.nombre_apellido}, como Caballero de Honor, te queremos a nuestro lado en este día tan importante.`,
        'Cantante': `${guest.nombre_apellido}, tu voz hará que nuestra ceremonia sea aún más mágica.`,
        'Fotografo': `${guest.nombre_apellido}, confiamos en tu talento para capturar cada momento especial de nuestra boda.`,
    };
    especialSaludo.textContent = saludos[role] || `${guest.nombre_apellido}, tenemos un lugar especial para ti.`;

    // Highlight the matching dress code
    if (role === 'Dama de Honor') {
        document.getElementById('dressDama')?.classList.add('highlighted');
    } else if (role === 'Caballero de Honor') {
        document.getElementById('dressCaballero')?.classList.add('highlighted');
    }

    if (guest.invitacion_especial_aceptada !== null && guest.invitacion_especial_aceptada !== undefined) {
        const accepted = guest.invitacion_especial_aceptada;
        especialAlreadyConfirmed.classList.remove('hidden');
        rsvpBox.classList.add('hidden');

        if (accepted) {
            especialConfirmedText.textContent = '¡Gracias por aceptar ser parte de nuestro día especial!';
        } else {
            especialConfirmedText.textContent = 'Entendemos tu respuesta. Te esperamos como invitado.';
        }
    } else {
        especialAlreadyConfirmed.classList.add('hidden');
        rsvpBox.classList.remove('hidden');
    }
}

function bindRsvpForm(guest) {
    const form = document.getElementById('rsvpEspecialForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const attendanceValue = document.getElementById('especialAttendanceSelect').value;
        const message = document.getElementById('especialMessage').value.trim();

        if (!attendanceValue) {
            alert('Por favor selecciona si aceptas o no el rol.');
            return;
        }

        const acepta = attendanceValue === 'si';

        try {
            const updateData = {
                invitacion_especial_aceptada: acepta,
                mensaje: message || null,
            };

            const { error } = await supabaseClient
                .from('invitados')
                .update(updateData)
                .eq('id', guest.id);

            if (error) throw error;

            document.getElementById('rsvpEspecialBox').classList.add('hidden');
            document.getElementById('especialAlreadyConfirmed').classList.add('hidden');

            const successBox = document.getElementById('especialSuccessBox');
            const successText = document.getElementById('especialSuccessText');

            if (acepta) {
                successText.textContent = '¡Gracias por aceptar ser parte de nuestro día especial! Te esperamos con mucha ilusión.';
            } else {
                successText.textContent = 'Entendemos tu respuesta. Igualmente te esperamos para celebrar juntos.';
            }

            successBox.classList.remove('hidden');
        } catch (error) {
            console.error(error);
            alert('No se pudo guardar tu respuesta. Intenta nuevamente.');
        }
    });
}
