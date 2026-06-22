import { useState, useEffect } from 'react'
import { getInvitadoByToken, getConfirmacionByInvitadoId, confirmarAsistencia, cancelarConfirmacion } from '../supabase'

export default function RSVP() {
  const [token, setToken] = useState(null)
  const [invitado, setInvitado] = useState(null)
  const [confirmacion, setConfirmacion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [asiste, setAsiste] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [cantidad, setCantidad] = useState(1)
  const [telefono, setTelefono] = useState('')
  const [mensaje, setMensaje] = useState('')

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
          setError(true)
          setLoading(false)
          return
        }
        setInvitado(inv)
        try {
          const conf = await getConfirmacionByInvitadoId(inv.id)
          if (conf) setConfirmacion(conf)
        } catch {}
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  const handleAsistir = () => setAsiste(true)
  const handleNoAsistir = async () => {
    setAsiste(false)
    setEnviando(true)
    try {
      await confirmarAsistencia(token, false, 0, null, null)
      setConfirmacion({ asiste: false })
    } catch (err) {
      alert('Error al enviar confirmación')
      setAsiste(null)
    } finally {
      setEnviando(false)
    }
  }

  const handleConfirmar = async (e) => {
    e.preventDefault()
    setEnviando(true)
    try {
      const data = await confirmarAsistencia(token, true, cantidad, telefono || null, mensaje || null)
      setConfirmacion(data || { asiste: true, cantidad_confirmada: cantidad })
      setAsiste(null)
    } catch (err) {
      alert('Error al enviar confirmación. Intenta de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  const handleCancelar = async () => {
    if (!window.confirm('¿Estás seguro de cancelar tu confirmación?')) return
    try {
      await cancelarConfirmacion(token)
      setConfirmacion(null)
      setAsiste(null)
    } catch {
      alert('Error al cancelar. Contacta a los novios.')
    }
  }

  if (loading) {
    return (
      <section className="rsvp-section" id="rsvp">
        <div className="loading">
          <div className="spinner" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="rsvp-section" id="rsvp">
        <div className="token-error mostrar">
          <h2>Invitación no encontrada</h2>
          <p>El enlace no es válido o ha expirado. Por favor contacta a los novios.</p>
        </div>
      </section>
    )
  }

  if (!invitado) {
    return (
      <section className="rsvp-section" id="rsvp">
        <h2 className="section-title">Invitación General</h2>
        <p style={{ color: 'var(--color-gold-light)', textAlign: 'center', maxWidth: 400, margin: '0 auto' }}>
          Gracias por visitar nuestra invitación. Para confirmar tu asistencia, usa el enlace personalizado que te enviamos.
        </p>
      </section>
    )
  }

  if (confirmacion) {
    return (
      <section className="rsvp-section" id="rsvp">
        <h2 className="section-title">Confirma tu Asistencia</h2>
        <div className="confirmacion mostrar">
          <span className="confirmacion-icono">💌</span>
          <h3 className="confirmacion-titulo">
            {confirmacion.asiste ? '¡Confirmación Recibida!' : 'Confirmación recibida'}
          </h3>
          <p className="confirmacion-texto">
            {confirmacion.asiste
              ? `¡Qué alegría! Ya contamos contigo para el gran día.${confirmacion.cantidad_confirmada > 1 ? ` (${confirmacion.cantidad_confirmada} personas)` : ''}<br /><br /><strong>Erick Rondón</strong> y <strong>Telma Verónica</strong> 💕`
              : 'Hemos recibido tu respuesta. Entendemos que no podrás acompañarnos.<br /><br /><strong>Erick Rondón</strong> y <strong>Telma Verónica</strong> 💕'
            }
          </p>
          <button className="btn-cancelar" onClick={handleCancelar}>
            Cancelar confirmación
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="rsvp-section" id="rsvp">
      <h2 className="section-title">Confirma tu Asistencia</h2>

      <p className="rsvp-saludo">
        Hola, <span>{invitado.nombre_apellido}</span>
      </p>
      <p className="rsvp-cupos">
        Hemos reservado <span>{invitado.cupos_reservados}</span> {invitado.cupos_reservados === 1 ? 'lugar' : 'lugares'} para ustedes
      </p>

      {asiste === null && (
        <div className="rsvp-botones">
          <button className="btn-rsvp btn-asistir" onClick={handleAsistir}>
            ¡Sí, asistiré! 🎉
          </button>
          <button className="btn-rsvp btn-no-asistir" onClick={handleNoAsistir} disabled={enviando}>
            {enviando ? 'Enviando...' : 'No podré asistir 😢'}
          </button>
        </div>
      )}

      {asiste === true && (
        <form className="rsvp-form mostrar" onSubmit={handleConfirmar}>
          <div className="form-grupo">
            <label className="form-label" htmlFor="cantidad">¿Cuántos asistirán?</label>
            <select
              className="form-select"
              id="cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            >
              {Array.from({ length: invitado.cupos_reservados }, (_, i) => (
                <option key={i} value={i + 1}>{i + 1} {i === 0 ? 'persona' : 'personas'}</option>
              ))}
            </select>
          </div>
          <div className="form-grupo">
            <label className="form-label" htmlFor="telefono">Teléfono (opcional)</label>
            <input
              className="form-input"
              type="tel"
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="300 123 4567"
            />
          </div>
          <div className="form-grupo">
            <label className="form-label" htmlFor="mensaje">Mensaje (opcional)</label>
            <textarea
              className="form-textarea"
              id="mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="¡Allá estaremos con mucho cariño!"
              rows="3"
            />
          </div>
          <button className="btn-enviar" type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Confirmar Asistencia'}
          </button>
        </form>
      )}
    </section>
  )
}
