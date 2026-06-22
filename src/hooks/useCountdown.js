import { useState, useEffect } from 'react'

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(calcularTiempoRestante(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcularTiempoRestante(targetDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return timeLeft
}

function calcularTiempoRestante(target) {
  const diff = target - Date.now()
  if (diff <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00' }

  return {
    days: pad(Math.floor(diff / (1000 * 60 * 60 * 24))),
    hours: pad(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
    minutes: pad(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))),
    seconds: pad(Math.floor((diff % (1000 * 60)) / 1000)),
  }
}
