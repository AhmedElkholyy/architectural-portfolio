import { useEffect, useRef } from 'react'

const INTERACTIVE = 'a, button, [role="button"], summary, .project-card, .gallery-thumb, [tabindex], select'
const EDITABLE = 'input, textarea, select, [contenteditable]'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(any-pointer: fine)').matches) return

    const root = document.documentElement
    root.classList.add('custom-cursor')

    const dot = dotRef.current
    const ring = ringRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ease = reduceMotion ? 1 : 0.18

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let raf = 0
    let running = false

    const position = (el, px, py) => {
      el.style.transform = `translate3d(${px}px, ${py}px, 0)`
    }

    const loop = () => {
      rx += (x - rx) * ease
      ry += (y - ry) * ease
      position(ring, rx, ry)
      raf = requestAnimationFrame(loop)
    }

    const show = () => {
      if (!running) {
        running = true
        dot.classList.add('is-visible')
        ring.classList.add('is-visible')
        raf = requestAnimationFrame(loop)
      }
    }

    const hide = () => {
      running = false
      cancelAnimationFrame(raf)
      dot.classList.remove('is-visible', 'is-active')
      ring.classList.remove('is-visible', 'is-active')
    }

    const updateState = (el) => {
      if (el.closest(EDITABLE)) {
        root.classList.add('cursor-muted')
        dot.classList.remove('is-active')
        ring.classList.remove('is-active')
        return
      }
      root.classList.remove('cursor-muted')
      const active = !!el.closest(INTERACTIVE)
      dot.classList.toggle('is-active', active)
      ring.classList.toggle('is-active', active)
    }

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      position(dot, x, y)
      show()
      updateState(e.target)
    }
    const onDown = () => root.classList.add('cursor-pressed')
    const onUp = () => root.classList.remove('cursor-pressed')
    const onLeave = () => hide()

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)
    window.addEventListener('blur', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('blur', onLeave)
      cancelAnimationFrame(raf)
      root.classList.remove('custom-cursor', 'cursor-muted', 'cursor-pressed')
    }
  }, [])

  return (
    <div className="custom-cursor-el" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring">
        <span className="cursor-ring-inner" />
      </div>
      <div ref={dotRef} className="cursor-dot">
        <span className="cursor-dot-inner" />
      </div>
    </div>
  )
}