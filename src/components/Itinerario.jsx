const ITEMS = [
  { hora: '4:00 PM', texto: 'Ceremonia', icono: '💍' },
  { hora: '5:30 PM', texto: 'Sesión de Fotos', icono: '📸' },
  { hora: '6:30 PM', texto: 'Cena y Brindis', icono: '🥂' },
  { hora: '9:30 PM', texto: 'Cierre de la Velada', icono: '✨' },
]

export default function Itinerario() {
  return (
    <section className="section itinerario-section" id="itinerario">
      <h2 className="section-title">Itinerario</h2>
      <div className="itinerario">
        {ITEMS.map((item, i) => (
          <div className="itinerario-item" key={i}>
            <span className="itinerario-icono">{item.icono}</span>
            <span className="itinerario-hora">{item.hora}</span>
            <div className="itinerario-contenido">
              <p className="itinerario-texto">{item.texto}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
