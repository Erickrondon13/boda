const weddingDate = new Date(APP_CONFIG.weddingDate).getTime()

function pad(num) {
  return String(num).padStart(2, '0')
}

function updateCountdown() {
  const now = new Date().getTime()
  const distance = weddingDate - now

  if (distance <= 0) {
    document.getElementById('days').textContent = '00'
    document.getElementById('hours').textContent = '00'
    document.getElementById('minutes').textContent = '00'
    document.getElementById('seconds').textContent = '00'
    return
  }

  document.getElementById('days').textContent = pad(Math.floor(distance / (1000 * 60 * 60 * 24)))
  document.getElementById('hours').textContent = pad(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
  document.getElementById('minutes').textContent = pad(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
  document.getElementById('seconds').textContent = pad(Math.floor((distance % (1000 * 60)) / 1000))
}

updateCountdown()
setInterval(updateCountdown, 1000)
