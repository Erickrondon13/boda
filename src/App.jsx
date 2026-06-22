import { useEffect } from 'react'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Countdown from './components/Countdown'
import Lugar from './components/Lugar'
import Itinerario from './components/Itinerario'
import Vestimenta from './components/Vestimenta'
import Regalos from './components/Regalos'
import RSVP from './components/RSVP'
import Footer from './components/Footer'

export default function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show')
          }
        })
      },
      { threshold: 0.12 }
    )

    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Hero />
      <Intro />
      <Countdown />
      <Lugar />
      <Itinerario />
      <Vestimenta />
      <Regalos />
      <RSVP />
      <Footer />
    </>
  )
}
