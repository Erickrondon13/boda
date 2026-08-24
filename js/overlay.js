(function () {
    var overlay = document.getElementById('letterOverlay');
    var nameEl = document.getElementById('letterGuestName');
    var audio = document.getElementById('bgMusic');
    var musicBtn = document.getElementById('musicBtn');
    var isPlaying = false;

    function toggleMusic() {
        if (isPlaying) {
            audio.pause();
            musicBtn.classList.remove('playing');
        } else {
            audio.play().then(function () {
                musicBtn.classList.add('playing');
            }).catch(function () {});
        }
        isPlaying = !isPlaying;
    }

    musicBtn?.addEventListener('click', toggleMusic);

    overlay?.addEventListener('click', function () {
        this.classList.add('hidden');
        if (audio) {
            audio.play().then(function () {
                isPlaying = true;
                if (musicBtn) musicBtn.classList.add('playing');
            }).catch(function () {});
        }
    });

    var params = new URLSearchParams(window.location.search);
    var token = params.get('token') || params.get('id');

    if (token && nameEl) {
        supabaseClient
            .from('invitados')
            .select('nombre_apellido')
            .eq('token', token)
            .single()
            .then(function (res) {
                if (res.data && res.data.nombre_apellido) {
                    nameEl.textContent = res.data.nombre_apellido;
                }
            })
            .catch(function () {});
    }
})();
