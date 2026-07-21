import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

export default function Dashboard() {
  const { t } = useTranslation()

  const pages = [
    {
      to: '/admin/projects',
      label: t('admin.projects'),
      desc: t('admin.dashboardProjectsDesc'),
    },
    {
      to: '/admin/home',
      label: t('admin.homePage'),
      desc: t('admin.dashboardHomeDesc'),
    },
    {
      to: '/admin/contact',
      label: t('admin.contactAdmin'),
      desc: t('admin.dashboardContactDesc'),
    },
  ]

  return (
    <div>
      <h1>{t('admin.dashboard')}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
        {pages.map((page) => (
          <Link
            key={page.to}
            to={page.to}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '2rem',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--background)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--surface)'}
          >
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '20px' }}>{page.label}</h2>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>{page.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
