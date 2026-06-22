export default function Hero() {
  return (
    <header className="hero">
      <div className="container hero-content">
        <div className="hero-card">
          <span className="eyebrow">Invitación de boda</span>

          <h1>
            Erick <span className="ampersand">&amp;</span> Telma
          </h1>

          <p>
            Con el amor que nos une, la bendición de Dios y el apoyo de nuestros padres,
            te invitamos a celebrar el día más especial de nuestras vidas.
          </p>

          <div className="hero-date">15 de noviembre 2026</div>

          <div className="hero-actions">
            <a href="#ubicacion" className="btn btn-primary">Ver detalles</a>
            <a href="#invitados" className="btn btn-secondary">Confirmar asistencia</a>
          </div>
        </div>
      </div>
    </header>
  )
}
