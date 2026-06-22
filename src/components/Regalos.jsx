export default function Regalos() {
  return (
    <section className="section" id="regalos">
      <div className="container">
        <div className="section-title fade-up">Regalos</div>
        <h2 className="section-heading fade-up">Su presencia es nuestro mejor regalo</h2>
        <p className="section-subtitle fade-up">
          Pero si desean tener un detalle con nosotros, estaremos profundamente agradecidos.
        </p>

        <div className="gifts-grid">
          <div className="info-card center fade-up">
            <span className="big-icon">🎁</span>
            <h3 className="card-title">Lluvia de Sobres</h3>
            <p className="muted">
              Su presencia es nuestro mejor regalo. Pero si desean tener un detalle con nosotros:
            </p>

            <div className="gift-highlight">
              ✉️ Buzón en recepción
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
