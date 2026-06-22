let currentGuest = null;
let currentToken = null;

document.addEventListener('DOMContentLoaded', () => {
    initInvitation();
});

async function initInvitation() {
    const guestLoading = document.getElementById('guestLoading');
    const guestContent = document.getElementById('guestContent');
    const errorBox = document.getElementById('errorBox');

    try {
        currentToken = getTokenFromUrl();

        if (!currentToken) {
            throw new Error('No se encontró el token de invitación en la URL.');
        }

        const guest = await fetchGuestByToken(currentToken);
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

function getTokenFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
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
    guestSlotsEl.textContent = guest.cupos_reservados;

    fillConfirmedCountOptions(confirmedCount, guest.cupos_reservados);

    attendanceSelect.addEventListener('change', () => {
        if (attendanceSelect.value === 'si') {
            companionsGroup.classList.remove('hidden');
        } else {
            companionsGroup.classList.add('hidden');
        }
    });

    companionsGroup.classList.add('hidden');

    checkExistingConfirmation(guest.id);
}

async function checkExistingConfirmation(invitadoId) {
    const alreadyConfirmedBox = document.getElementById('alreadyConfirmedBox');
    const rsvpBox = document.getElementById('rsvpBox');

    try {
        const existing = await fetchExistingRsvp(invitadoId);
        if (existing) {
            alreadyConfirmedBox.classList.remove('hidden');
            rsvpBox.classList.add('hidden');
        } else {
            alreadyConfirmedBox.classList.add('hidden');
            rsvpBox.classList.remove('hidden');
        }
    } catch {
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
        const guestMessage = document.getElementById('guestMessage').value.trim();

        if (!attendanceValue) {
            showError('Por favor selecciona si asistirás o no.');
            return;
        }

        let asiste = false;
        let cantidadConfirmada = 0;

        if (attendanceValue === 'si') {
            asiste = true;
            cantidadConfirmada = Number(confirmedCountValue || 1);

            if (cantidadConfirmada < 1 || cantidadConfirmada > guest.cupos_reservados) {
                showError('La cantidad confirmada no es válida.');
                return;
            }
        }

        try {
            await submitRsvp(currentToken, asiste, cantidadConfirmada, null, guestMessage || null);

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
    successBox.classList.remove('hidden');
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
