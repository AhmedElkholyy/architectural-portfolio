import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1>404</h1>
      <p>{t('common.notFound')}</p>
      <p>{t('common.notFoundDesc')}</p>
      <Link to="/" style={{ color: 'var(--accent)', marginTop: '1rem', display: 'inline-block' }}>
        ← {t('nav.home')}
      </Link>
    </div>
  )
}
