import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import { useSiteSettings } from '../hooks/useSiteSettings'

export default function Navigation() {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const location = useLocation()
  const { settings } = useSiteSettings()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length > 0) {
        focusableElements[0].focus()
      }
    }
  }, [isMenuOpen])

  function renderLogo() {
    if (settings?.logo_type === 'image' && settings?.logo_image_url) {
      return (
        <img
          src={settings.logo_image_url}
          alt={settings.logo_text || 'Logo'}
          className="brand-logo"
        />
      )
    }
    const logoText = settings?.logo_text || 'AK'
    return (
      <>
        {logoText}
      </>
    )
  }

  return (
    <nav className="nav">
      <Link className="brand" to="/" aria-label={t('nav.ariaHome')}>
        {renderLogo()}
      </Link>

      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>{t('nav.home')}</Link>
        <Link
          to="/portfolio"
          className={location.pathname.startsWith('/portfolio') || location.pathname.startsWith('/project') ? 'active' : ''}
        >
          {t('nav.projects')}
        </Link>
        <Link to="/contact" className={location.pathname.startsWith('/contact') ? 'active' : ''}>{t('nav.contact')}</Link>
      </div>

      <LanguageSwitcher />

      <button
        className="nav-hamburger"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-expanded={isMenuOpen}
        aria-label={t('nav.ariaHome')}
        aria-controls="mobile-menu"
      >
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`} />
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`} />
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`} />
      </button>

      {isMenuOpen && (
        <div
          className="nav-overlay"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        id="mobile-menu"
        ref={menuRef}
        className={`nav-mobile-menu ${isMenuOpen ? 'open' : ''}`}
        role="navigation"
        aria-label={t('nav.ariaHome')}
      >
        <div className="nav-mobile-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>{t('nav.home')}</Link>
          <Link
            to="/portfolio"
            className={location.pathname.startsWith('/portfolio') || location.pathname.startsWith('/project') ? 'active' : ''}
          >
            {t('nav.projects')}
          </Link>
          <Link to="/contact" className={location.pathname.startsWith('/contact') ? 'active' : ''}>{t('nav.contact')}</Link>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  )
}
