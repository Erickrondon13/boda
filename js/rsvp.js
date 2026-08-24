function setupInvitacion(options) {
    var confirmedField = options.confirmedField;
    var welcomeText = options.welcome;
    var saveRsvp = options.save;

    document.addEventListener('DOMContentLoaded', init);

    async function init() {
        var guestLoading = document.getElementById('guestLoading');
        var guestContent = document.getElementById('guestContent');

        try {
            var token = getTokenFromUrl();

            if (!token) {
                guestLoading.classList.add('hidden');
                guestContent.classList.remove('hidden');
                return;
            }

            var guest = await fetchGuest(token);
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
        var params = new URLSearchParams(window.location.search);
        return params.get('token') || params.get('id');
    }

    async function fetchGuest(token) {
        var res = await supabaseClient
            .from('invitados')
            .select('*')
            .eq('token', token)
            .single();

        if (res.error || !res.data) {
            throw new Error('Invitación no válida o invitado no encontrado.');
        }
        return res.data;
    }

    function renderGuestInfo(guest) {
        var guestNameEl = document.getElementById('guestName');
        var guestSlotsEl = document.getElementById('guestSlots');
        var confirmationBox = document.getElementById('confirmationBox');
        var rsvpBox = document.getElementById('rsvpBox');
        var confirmedCount = document.getElementById('confirmedCount');
        var companionsGroup = document.getElementById('companionsGroup');
        var attendanceSelect = document.getElementById('attendanceSelect');
        var guestWelcome = document.getElementById('guestWelcome');
        var guestIntro = document.getElementById('guestIntro');

        guestNameEl.textContent = guest.nombre_apellido;
        guestSlotsEl.textContent = guest.cupos;

        guestWelcome.textContent = welcomeText(guest);
        guestWelcome.classList.remove('hidden');

        guestIntro.textContent =
            guest.nombre_apellido + ', estamos muy felices de que nos acompañes en este día tan especial.';
        guestIntro.classList.remove('hidden');

        fillConfirmedCountOptions(confirmedCount, guest.cupos);

        attendanceSelect.addEventListener('change', function () {
            if (attendanceSelect.value === 'si') {
                companionsGroup.classList.remove('hidden');
            } else {
                companionsGroup.classList.add('hidden');
            }
        });

        companionsGroup.classList.add('hidden');

        if (guest[confirmedField]) {
            confirmationBox.classList.remove('hidden');
            rsvpBox.classList.add('hidden');
        } else {
            confirmationBox.classList.add('hidden');
            rsvpBox.classList.remove('hidden');
        }
    }

    function fillConfirmedCountOptions(selectEl, maxCount) {
        selectEl.innerHTML = '';
        for (var i = 1; i <= maxCount; i++) {
            var option = document.createElement('option');
            option.value = String(i);
            option.textContent = String(i);
            selectEl.appendChild(option);
        }
    }

    function bindRsvpForm(guest) {
        var form = document.getElementById('rsvpForm');
        if (!form) return;

        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            hideError();

            var attendanceValue = document.getElementById('attendanceSelect').value;
            var confirmedCountValue = document.getElementById('confirmedCount').value;
            var messageEl = document.getElementById('guestMessage');
            var message = messageEl ? messageEl.value.trim() : '';

            if (!attendanceValue) {
                showError('Por favor selecciona si asistirás o no.');
                return;
            }

            var asiste = false;
            var cantidadConfirmada = 0;

            if (attendanceValue === 'si') {
                asiste = true;
                cantidadConfirmada = Number(confirmedCountValue || 1);
                if (cantidadConfirmada < 1 || cantidadConfirmada > guest.cupos) {
                    showError('La cantidad confirmada no es válida.');
                    return;
                }
            }

            try {
                await saveRsvp(guest, asiste, cantidadConfirmada, message);
                showSuccess();
                document.getElementById('rsvpBox').classList.add('hidden');
            } catch (error) {
                console.error(error);
                showError('No se pudo guardar tu confirmación. Intenta nuevamente.');
            }
        });
    }

    function showSuccess() {
        document.getElementById('confirmationBox').classList.remove('hidden');
    }

    function showError(message) {
        var errorBox = document.getElementById('errorBox');
        errorBox.textContent = message;
        errorBox.classList.remove('hidden');
    }

    function hideError() {
        var errorBox = document.getElementById('errorBox');
        errorBox.textContent = '';
        errorBox.classList.add('hidden');
    }
}
