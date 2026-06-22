import useCountdown from '../hooks/useCountdown'

const TARGET = new Date('2026-11-15T16:00:00-05:00')

export default function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(TARGET)

  return (
    <section className="fecha-section" id="fecha">
      <h2 className="section-title">Cuenta Regresiva</h2>
      <p className="fecha-texto">15 de Noviembre de 2026</p>

      <div className="countdown">
        <div className="countdown-item">
          <span className="countdown-numero">{days}</span>
          <span className="countdown-label">Días</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-item">
          <span className="countdown-numero">{hours}</span>
          <span className="countdown-label">Horas</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-item">
          <span className="countdown-numero">{minutes}</span>
          <span className="countdown-label">Minutos</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-item">
          <span className="countdown-numero">{seconds}</span>
          <span className="countdown-label">Segundos</span>
        </div>
      </div>
    </section>
  )
}
