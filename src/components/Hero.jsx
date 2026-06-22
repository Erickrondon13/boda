import { useEffect, useRef } from 'react'

export default function Hero() {
  const heroRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return
      const scrolled = window.scrollY
      const hero = heroRef.current
      hero.style.transform = `translateY(${scrolled * 0.3}px)`
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToFrase = () => {
    document.getElementById('frase')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="hero">
      <div className="hero-bg" ref={heroRef}>
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80"
          alt="Erick & Telma"
          loading="lazy"
        />
      </div>
      <div className="hero-overlay" />

      <div className="hero-content">
        <p className="hero-subtitle">Nos casamos</p>
        <h1 className="hero-title">
          Erick &amp; Telma
          <span>15 · 11 · 2026</span>
        </h1>
        <p className="hero-date">Salsipuedes, Colombia</p>
      </div>

      <div className="scroll-indicator" onClick={scrollToFrase}>
        <svg viewBox="0 0 24 24">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </header>
  )
}
