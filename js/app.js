let currentGuest = null;
let currentId = null;

document.addEventListener('DOMContentLoaded', () => {
    initInvitation();
});

async function initInvitation() {
    const guestLoading = document.getElementById('guestLoading');
    const guestContent = document.getElementById('guestContent');
    const errorBox = document.getElementById('errorBox');

    try {
        currentId = getIdFromUrl();

        if (!currentId) {
            throw new Error('No se encontró el ID de invitación en la URL.');
        }

        const guest = await fetchGuest(currentId);
        currentGuest = guest;

        renderGuestInfo(guest);

        guestLoading.classList.add('hidden');
        guestContent.classList.remove('hidden');

        bindRsvpForm(guest);
    } catch (error) {
        console.error(error);
        guestLoading.classList.add('hidden');
        guestContent.classList.remove('hidden');
        showError(error.message || 'No se pudo cargar la invitación.');
    }
}

function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function fetchGuest(id) {
    const { data, error } = await supabaseClient
        .from('invitados')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) throw new Error('Invitación no válida o invitado no encontrado.');
    return data;
}

function renderGuestInfo(guest) {
    const guestNameEl = document.getElementById('guestName');
    const guestSlotsEl = document.getElementById('guestSlots');
    const alreadyConfirmedBox = document.getElementById('alreadyConfirmedBox');
    const rsvpBox = document.getElementById('rsvpBox');
    const confirmedCount = document.getElementById('confirmedCount');
    const companionsGroup = document.getElementById('companionsGroup');
    const attendanceSelect = document.getElementById('attendanceSelect');

    guestNameEl.textContent = guest.nombre_apellido;
    guestSlotsEl.textContent = guest.cupos;

    fillConfirmedCountOptions(confirmedCount, guest.cupos);

    attendanceSelect.addEventListener('change', () => {
        if (attendanceSelect.value === 'si') {
            companionsGroup.classList.remove('hidden');
        } else {
            companionsGroup.classList.add('hidden');
        }
    });

    companionsGroup.classList.add('hidden');

    if (guest.confirmado) {
        alreadyConfirmedBox.classList.remove('hidden');
        rsvpBox.classList.add('hidden');
    } else {
        alreadyConfirmedBox.classList.add('hidden');
        rsvpBox.classList.remove('hidden');
    }
}

function fillConfirmedCountOptions(selectEl, maxCount) {
    selectEl.innerHTML = '';

    for (let i = 1; i <= maxCount; i++) {
        const option = document.createElement('option');
        option.value = String(i);
        option.textContent = String(i);
        selectEl.appendChild(option);
    }
}

function bindRsvpForm(guest) {
    const form = document.getElementById('rsvpForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        hideError();

        const attendanceValue = document.getElementById('attendanceSelect').value;
        const confirmedCountValue = document.getElementById('confirmedCount').value;

        if (!attendanceValue) {
            showError('Por favor selecciona si asistirás o no.');
            return;
        }

        let asiste = false;
        let cantidadConfirmada = 0;

        if (attendanceValue === 'si') {
            asiste = true;
            cantidadConfirmada = Number(confirmedCountValue || 1);

            if (cantidadConfirmada < 1 || cantidadConfirmada > guest.cupos) {
                showError('La cantidad confirmada no es válida.');
                return;
            }
        }

        try {
            const now = new Date().toISOString();

            const { error } = await supabaseClient
                .from('invitados')
                .update({
                    confirmado: asiste,
                    cantidad_confirmada: cantidadConfirmada,
                    fecha_confirmacion: now
                })
                .eq('id', guest.id);

            if (error) throw error;

            showSuccess();
            document.getElementById('rsvpBox').classList.add('hidden');
        } catch (error) {
            console.error(error);
            showError('No se pudo guardar tu confirmación. Intenta nuevamente.');
        }
    });
}

function showSuccess() {
    const successBox = document.getElementById('successBox');
    const alreadyConfirmedBox = document.getElementById('alreadyConfirmedBox');
    successBox.classList.remove('hidden');
    alreadyConfirmedBox.classList.add('hidden');
}

function showError(message) {
    const errorBox = document.getElementById('errorBox');
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
}

function hideError() {
    const errorBox = document.getElementById('errorBox');
    errorBox.textContent = '';
    errorBox.classList.add('hidden');
}
