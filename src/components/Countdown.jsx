import useCountdown from '../hooks/useCountdown'

const TARGET = new Date('2026-11-15T16:00:00-05:00')

export default function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(TARGET)

  return (
    <section className="section">
      <div className="container">
        <div className="fade-up">
          <div className="section-title">Cuenta regresiva</div>
          <h2 className="section-heading">Faltan solo unos instantes para nuestro gran día</h2>
          <p className="section-subtitle">
            Cada segundo nos acerca al &ldquo;sí, acepto&rdquo;.
          </p>

          <div className="countdown-wrap">
            <div className="countdown">
              <div className="time-card">
                <span className="num">{days}</span>
                <span className="label">Días</span>
              </div>
              <div className="time-card">
                <span className="num">{hours}</span>
                <span className="label">Horas</span>
              </div>
              <div className="time-card">
                <span className="num">{minutes}</span>
                <span className="label">Minutos</span>
              </div>
              <div className="time-card">
                <span className="num">{seconds}</span>
                <span className="label">Segundos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
