export default function Vestimenta() {
  return (
    <section className="section" id="dresscode">
      <div className="container">
        <div className="section-title fade-up">Código de vestimenta</div>
        <h2 className="section-heading fade-up">Elegancia para una noche especial</h2>
        <p className="section-subtitle fade-up">
          Queremos que te sientas cómodo, pero también espectacular.
        </p>

        <div className="dress-grid">
          <div className="info-card center fade-up">
            <span className="big-icon">🤵</span>
            <h3 className="card-title">Formal</h3>
            <div className="dress-label">Caballeros</div>
            <p className="dress-note">
              Traje formal o vestimenta elegante acorde con la ocasión.
            </p>
          </div>

          <div className="info-card center fade-up">
            <span className="big-icon">👗</span>
            <h3 className="card-title">Largo</h3>
            <div className="dress-label">Damas</div>
            <p className="dress-note">
              Vestido largo o atuendo elegante para una celebración inolvidable.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
