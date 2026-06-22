import { useRef, useState } from 'react'

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
    setPlaying(!playing)
  }

  return (
    <>
      <audio ref={audioRef} loop preload="none">
        <source src="" type="audio/mpeg" />
      </audio>
      <button
        className={`music-toggle ${playing ? '' : 'paused'}`}
        onClick={toggle}
        aria-label={playing ? 'Pausar música' : 'Reproducir música'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </button>
    </>
  )
}
