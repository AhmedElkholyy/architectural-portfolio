import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useSiteSettings } from '../hooks/useSiteSettings'
import AnimatedBackground from '../components/AnimatedBackground'

export default function Home() {
  const { t, i18n } = useTranslation()
  const { settings, loading } = useSiteSettings()

  const lang = i18n.language
  const title1 = lang === 'ar' ? (settings?.hero_title_ar || t('home.heroTitle1')) : (settings?.hero_title_en || t('home.heroTitle1'))
  const title2 = lang === 'ar' ? (settings?.hero_subtitle_ar || t('home.heroTitle2')) : (settings?.hero_subtitle_en || t('home.heroTitle2'))
  const heroText = lang === 'ar' ? (settings?.hero_text_ar || t('home.heroFallback')) : (settings?.hero_text_en || t('home.heroFallback'))

  return (
    <>
      <AnimatedBackground faded />

      <div className="home-content">
      {loading ? (
        <section className="hero" id="top" />
      ) : (
      <section className="hero" id="top">
        <h1>{title1}<br /><em>{title2}</em></h1>
        <span className="hero-rule" aria-hidden="true" />
        <p className="hero-subtitle">{heroText}</p>
        <div className="hero-actions">
          <Link to="/contact" className="hero-btn hero-btn-primary">{t('home.contactMe')}</Link>
          <Link to="/portfolio" className="hero-btn">{t('home.viewPortfolio')}</Link>
        </div>
        {settings?.profile_image_url && (
          <div className="hero-photo-wrap">
            <div className="hero-photo-plate">
              <img
                src={settings.profile_image_url}
                alt={t('home.profileAlt')}
                className="hero-profile"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </section>
      )}
    </div>
    </>
  )
}
