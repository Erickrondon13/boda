(function initCountdown() {
    var container = document.getElementById('countdown');
    if (!container) return;

    var targetDate = new Date(
        container.dataset.target || '2026-11-15T16:00:00-05:00'
    ).getTime();

    var daysEl = document.getElementById('days');
    var hoursEl = document.getElementById('hours');
    var minutesEl = document.getElementById('minutes');
    var secondsEl = document.getElementById('seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
        return;
    }

    function pad(value) {
        return String(value).padStart(2, '0');
    }

    function updateCountdown() {
        var now = Date.now();
        var diff = targetDate - now;

        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        var totalSeconds = Math.floor(diff / 1000);
        var days = Math.floor(totalSeconds / (60 * 60 * 24));
        var hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
        var minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        var seconds = totalSeconds % 60;

        daysEl.textContent = pad(days);
        hoursEl.textContent = pad(hours);
        minutesEl.textContent = pad(minutes);
        secondsEl.textContent = pad(seconds);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
})();
