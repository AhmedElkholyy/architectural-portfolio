import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <button
      className="lang-switch"
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      aria-label={language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
    >
      <span className={`lang-option ${language === 'ar' ? 'active' : ''}`}>AR</span>
      <span className="lang-option-divider">/</span>
      <span className={`lang-option ${language === 'en' ? 'active' : ''}`}>EN</span>
    </button>
  )
}
