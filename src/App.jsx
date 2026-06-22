import { useEffect } from 'react'
import Hero from './components/Hero'
import Frase from './components/Frase'
import Countdown from './components/Countdown'
import Lugar from './components/Lugar'
import Itinerario from './components/Itinerario'
import Vestimenta from './components/Vestimenta'
import Regalos from './components/Regalos'
import RSVP from './components/RSVP'
import MusicPlayer from './components/MusicPlayer'
import Footer from './components/Footer'

export default function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.15 }
    )

    const elements = document.querySelectorAll('.section, .frase, .fecha-section, .rsvp-section')
    elements.forEach((el) => {
      if (!el.classList.contains('fade-in')) {
        el.classList.add('fade-in')
      }
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Hero />
      <Frase />
      <div className="divider">✦ ✦ ✦</div>
      <Countdown />
      <Lugar />
      <div className="divider">✦ ✦ ✦</div>
      <Itinerario />
      <div className="divider">✦ ✦ ✦</div>
      <Vestimenta />
      <div className="divider">✦ ✦ ✦</div>
      <Regalos />
      <div className="divider">✦ ✦ ✦</div>
      <RSVP />
      <MusicPlayer />
      <Footer />
    </>
  )
}
