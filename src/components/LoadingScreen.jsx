import { useState, useEffect } from 'react'
import { useSiteSettings } from '../hooks/useSiteSettings'

export default function LoadingScreen({ onComplete }) {
  const { settings } = useSiteSettings()
  const [phase, setPhase] = useState('enter') // enter → hold → exit

  useEffect(() => {
    const hold = setTimeout(() => setPhase('hold'), 800)
    return () => clearTimeout(hold)
  }, [])

  useEffect(() => {
    if (phase !== 'hold') return
    const exit = setTimeout(() => setPhase('exit'), 600)
    return () => clearTimeout(exit)
  }, [phase])

  useEffect(() => {
    if (phase !== 'exit') return
    const done = setTimeout(() => onComplete?.(), 600)
    return () => clearTimeout(done)
  }, [phase, onComplete])

  const isImage = settings?.logo_type === 'image' && settings?.logo_image_url

  return (
    <div className={`loading-screen ${phase === 'exit' ? 'loading-exit' : ''}`}>
      <div className={`loading-logo ${phase === 'enter' ? 'loading-logo-in' : 'loading-logo-hold'}`}>
        {isImage ? (
          <img src={settings.logo_image_url} alt="" className="loading-logo-img" />
        ) : settings?.logo_text ? (
          <span>{settings.logo_text}</span>
        ) : null}
      </div>
      <div className={`loading-bar-track ${phase !== 'enter' ? 'loading-bar-active' : ''}`}>
        <div className="loading-bar-fill" />
      </div>
    </div>
  )
}
