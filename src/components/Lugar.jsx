export default function Lugar() {
  return (
    <section className="section lugar-section" id="lugar">
      <h2 className="section-title">Lugar</h2>
      <p className="lugar-nombre">Salsipuedes</p>
      <p className="lugar-descripcion">
        Un lugar mágico rodeado de naturaleza para celebrar nuestro amor.
      </p>
      <a
        className="btn-ubicacion"
        href="https://www.google.com/maps/search/Salsipuedes+Colombia"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        Ver Ubicación
      </a>
    </section>
  )
}
