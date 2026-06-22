const ITEMS = [
  {
    hora: '4:00 PM',
    icono: '💍',
    titulo: 'Ceremonia',
    desc: 'El momento en el que uniremos nuestras vidas delante de Dios y de las personas que amamos.',
  },
  {
    hora: '5:30 PM',
    icono: '📸',
    titulo: 'Sesión de Fotos',
    desc: 'Sonrisas, abrazos, familia y recuerdos que quedarán para siempre en nuestra historia.',
  },
  {
    hora: '6:30 PM',
    icono: '🥂',
    titulo: 'Cena y Brindis',
    desc: 'Compartiremos la mesa, celebraremos el amor y levantaremos las copas por este nuevo comienzo.',
  },
  {
    hora: '9:30 PM',
    icono: '✨',
    titulo: 'Cierre de la Velada',
    desc: 'El broche final de una noche inolvidable, llena de gratitud, alegría y muchísimo amor.',
  },
]

export default function Itinerario() {
  return (
    <section className="section" id="itinerario">
      <div className="container">
        <div className="section-title fade-up">Itinerario</div>
        <h2 className="section-heading fade-up">Así celebraremos nuestro gran día</h2>
        <p className="section-subtitle fade-up">
          Una noche para recordar, brindar, sonreír y celebrar juntos.
        </p>

        <div className="timeline">
          {ITEMS.map((item, i) => (
            <article className="timeline-item fade-up" key={i}>
              <span className="timeline-time">{item.hora}</span>
              <span className="timeline-icon">{item.icono}</span>
              <h3 className="timeline-title">{item.titulo}</h3>
              <p className="timeline-desc">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
