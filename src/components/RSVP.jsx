import { useState, useEffect } from 'react'
import { getInvitadoByToken, getRsvpByInvitadoId, confirmarAsistencia, cancelarConfirmacion } from '../supabase'

const DEFAULT_ROLE = 'Invitación especial'

export default function RSVP() {
  const [token, setToken] = useState(null)
  const [invitado, setInvitado] = useState(null)
  const [rsvp, setRsvp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [asiste, setAsiste] = useState(true)
  const [cantidad, setCantidad] = useState(1)
  const [telefono, setTelefono] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [formStatus, setFormStatus] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tok = params.get('token')
    if (!tok) {
      setLoading(false)
      return
    }
    setToken(tok)

    getInvitadoByToken(tok)
      .then(async (inv) => {
        if (!inv) {
          setError('No encontramos una invitación válida para este enlace.')
          setLoading(false)
          return
        }
        setInvitado(inv)
        setCantidad(1)

        try {
          const existente = await getRsvpByInvitadoId(inv.id)
          if (existente) setRsvp(existente)
        } catch {}

        setLoading(false)
      })
      .catch(() => {
        setError('No se pudo cargar la invitación.')
        setLoading(false)
      })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormStatus(null)

    if (!token || !invitado) {
      setFormStatus({ type: 'error', message: 'No hay una invitación válida para confirmar.' })
      return
    }

    setEnviando(true)
    try {
      const payload = {
        p_token: token,
        p_asiste: asiste,
        p_cantidad_confirmada: asiste ? cantidad : 0,
        p_telefono: telefono.trim() || null,
        p_mensaje: mensaje.trim() || null,
      }

      await confirmarAsistencia(
        payload.p_token,
        payload.p_asiste,
        payload.p_cantidad_confirmada,
        payload.p_telefono,
        payload.p_mensaje
      )

      setRsvp({ asiste: payload.p_asiste, cantidad_confirmada: payload.p_cantidad_confirmada })
      setFormStatus({ type: 'success', message: 'Tu confirmación ya quedó registrada.' })
    } catch (err) {
      setFormStatus({ type: 'error', message: err?.message || 'No se pudo guardar la confirmación. Intenta de nuevo.' })
    } finally {
      setEnviando(false)
    }
  }

  const handleCancelar = async () => {
    if (!window.confirm('¿Estás seguro de cancelar tu confirmación?')) return
    try {
      await cancelarConfirmacion(token)
      setRsvp(null)
      setFormStatus(null)
    } catch {
      alert('Error al cancelar. Contacta a los novios.')
    }
  }

  if (loading) {
    return (
      <section className="section" id="invitados">
        <div className="container" style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div className="spinner" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section" id="invitados">
        <div className="container">
        <div className="section-title fade-up">Invitados</div>
        <h2 className="section-heading fade-up">Invitación no disponible</h2>
          <p className="section-subtitle">{error}</p>
        </div>
      </section>
    )
  }

  if (!invitado) {
    return (
      <section className="section" id="invitados">
        <div className="container">
        <div className="section-title fade-up">Invitados</div>
        <h2 className="section-heading fade-up">Invitación General</h2>
          <p className="section-subtitle">
            Gracias por visitar nuestra invitación. Para confirmar tu asistencia, usa el enlace personalizado que te enviamos.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="section" id="invitados">
      <div className="container">
        <div className="section-title fade-up">Invitados</div>
        <h2 className="section-heading fade-up">Nos encantará celebrar contigo</h2>
        <p className="section-subtitle fade-up">
          Hemos reservado un lugar especial para ustedes en esta noche inolvidable.
        </p>

        <div className="guests-grid">
          {/* TARJETA INVITADO */}
          <div className="info-card guest-box fade-up">
            <span className="big-icon">💌</span>
            <div className="guest-names">
              Hola, {invitado.nombre_apellido}
            </div>
            <p className="muted">
              Hemos reservado <strong>{invitado.cupos_reservados}</strong> {invitado.cupos_reservados === 1 ? 'lugar' : 'lugares'} para ustedes.
            </p>
            <div className="guest-badge">
              {invitado.rol || DEFAULT_ROLE}
            </div>
            {formStatus && (
              <div className={`status-box show status-${formStatus.type}`}>
                {formStatus.message}
              </div>
            )}
          </div>

          {/* FORM / CONFIRMACION */}
          {rsvp ? (
            <div className="confirm-box fade-up">
              <div className="success">💌</div>
              <h3 className="confirm-title">
                {rsvp.asiste ? '¡Confirmación Recibida!' : 'Confirmación recibida'}
              </h3>
              <p className="muted">
                {rsvp.asiste
                  ? `¡Qué alegría! Ya contamos contigo para el gran día.${rsvp.cantidad_confirmada > 1 ? ` (${rsvp.cantidad_confirmada} personas)` : ''} <strong>Erick Rondón y Telma Verónica</strong>.`
                  : 'Gracias por confirmarnos. Lamentaremos no contar contigo ese día, pero agradecemos mucho que nos hayas avisado 💛'
                }
              </p>
              <button className="btn btn-primary" onClick={handleCancelar} style={{ margin: '0 auto' }}>
                Cancelar confirmación
              </button>
            </div>
          ) : (
            <div className="info-card fade-up">
              <h3 className="card-title" style={{ textAlign: 'center' }}>Confirmar asistencia</h3>
              <p className="muted" style={{ textAlign: 'center', marginTop: 6 }}>
                Nos ayudaría muchísimo que confirmes tu asistencia.
              </p>

              <form className="rsvp-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">¿Nos acompañarás?</label>
                  <div className="radio-group">
                    <div className="radio-option">
                      <input
                        type="radio"
                        name="asiste"
                        id="asiste_si"
                        checked={asiste === true}
                        onChange={() => setAsiste(true)}
                      />
                      <label htmlFor="asiste_si">💍 Sí, asistiré</label>
                    </div>
                    <div className="radio-option">
                      <input
                        type="radio"
                        name="asiste"
                        id="asiste_no"
                        checked={asiste === false}
                        onChange={() => setAsiste(false)}
                      />
                      <label htmlFor="asiste_no">💔 No podré asistir</label>
                    </div>
                  </div>
                </div>

                <div className={`form-group ${asiste ? '' : 'hidden'}`}>
                  <label className="form-label" htmlFor="cantidad">¿Cuántos asistirán?</label>
                  <select
                    id="cantidad"
                    className="form-control"
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                  >
                    {Array.from({ length: invitado.cupos_reservados }, (_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <div className="helper-text">
                    Tienes {invitado.cupos_reservados} {invitado.cupos_reservados === 1 ? 'lugar' : 'lugares'} reservado{invitado.cupos_reservados > 1 ? 's' : ''}.
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="telefono">Teléfono</label>
                  <input
                    id="telefono"
                    type="text"
                    className="form-control"
                    placeholder="3001234567"
                    maxLength={30}
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="mensaje">Mensaje para los novios</label>
                  <textarea
                    id="mensaje"
                    className="form-control"
                    placeholder="Déjanos un mensaje bonito 💛"
                    maxLength={500}
                    rows={4}
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                  />
                </div>

                {formStatus && (
                  <div className={`status-box show status-${formStatus.type}`}>
                    {formStatus.message}
                  </div>
                )}

                <button type="submit" className="btn btn-primary" disabled={enviando}>
                  {enviando ? 'Guardando confirmación...' : 'Confirmar asistencia'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
