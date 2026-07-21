import { useTranslation } from 'react-i18next'

export default function LoadingState({ loading, error, empty, children }) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>{t('loading.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>
        <p>{t('loading.error')}{error}</p>
      </div>
    )
  }

  if (empty) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>{t('loading.noData')}</p>
      </div>
    )
  }

  return children
}
