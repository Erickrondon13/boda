export default function Lugar() {
  return (
    <section className="section" id="ubicacion">
      <div className="container">
        <div className="section-title fade-up">Lugar</div>
        <h2 className="section-heading fade-up">Salsipuedes</h2>
        <p className="section-subtitle fade-up">
          El lugar donde celebraremos el comienzo de nuestra historia como esposos.
        </p>

        <div className="location-card glass-card fade-up">
          <div className="location-copy">
            <span className="location-badge">📍 Medellín, Antioquia</span>
            <h3>Salsipuedes</h3>
            <p>
              Hemos preparado este día con muchísimo amor y nos encantará compartirlo contigo
              en un ambiente elegante, cálido y lleno de momentos inolvidables.
            </p>

            <a
              className="btn btn-primary"
              href="https://maps.google.com/?q=Salsipuedes+Medellin"
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: 'fit-content' }}
            >
              Ver ubicación
            </a>
          </div>

          <div className="location-side" aria-label="Foto decorativa de la boda" />
        </div>
      </div>
    </section>
  )
}
