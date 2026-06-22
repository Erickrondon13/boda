export default function Regalos() {
  return (
    <section className="section regalos-section" id="regalos">
      <span className="regalos-icono">🎁</span>
      <h2 className="section-title">Regalos</h2>
      <p className="regalos-texto">
        Su presencia es nuestro mejor regalo. Pero si desean tener un detalle con nosotros:
      </p>
      <div className="regalos-opciones">
        <div className="regalos-opcion">
          <span>💌</span>
          <span>Lluvia de Sobres</span>
        </div>
        <div className="regalos-opcion">
          <span>📬</span>
          <span>Buzón en recepción</span>
        </div>
        <div className="regalos-opcion">
          <span>✉️</span>
          <span>Transferencia o Nequi</span>
        </div>
      </div>
    </section>
  )
}
