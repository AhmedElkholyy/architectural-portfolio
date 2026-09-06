import { useTranslation } from 'react-i18next'
import { useContactSettings } from '../hooks/useContactSettings'
import LoadingState from '../components/LoadingState'
import ContactForm from '../components/ContactForm'
import AnimatedBackground from '../components/AnimatedBackground'

export default function Contact() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { settings, loading, error } = useContactSettings()

  const heading = lang === 'ar' ? (settings?.heading_ar || t('contact.title')) : (settings?.heading_en || t('contact.title'))

  return (
    <>
      <AnimatedBackground faded />
      <section className="contact-page" id="top">
      <LoadingState loading={loading} error={error}>
        <div className="contact-header">
          <h1 className="contact-title">{heading}</h1>
          <p className="contact-intro">{t('contact.intro')}</p>
        </div>

        <div className="contact-body">
          <div className="contact-info">
            {settings?.email && (
              <a href={`mailto:${settings.email}`} className="contact-info-item">
                <div className="contact-info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 4L12 13L2 4" />
                  </svg>
                </div>
                <div>
                  <p className="contact-info-label">{t('contact.emailLabel')}</p>
                  <p className="contact-info-value">{settings.email}</p>
                </div>
              </a>
            )}
            {settings?.phone && (
              <a href={`tel:${settings.phone}`} className="contact-info-item">
                <div className="contact-info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="contact-info-label">{t('contact.phoneLabel')}</p>
                  <p className="contact-info-value">{settings.phone}</p>
                </div>
              </a>
            )}
            {settings?.location_en && (
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="contact-info-label">{t('contact.locationLabel')}</p>
                  <p className="contact-info-value">{lang === 'ar' ? settings.location_ar : settings.location_en}</p>
                </div>
              </div>
            )}
          </div>

          <ContactForm />
        </div>
      </LoadingState>
    </section>
    </>
  )
}
