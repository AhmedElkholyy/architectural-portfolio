import { useState, useEffect } from 'react'
import { Outlet, Navigate, Link, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import LanguageSwitcher from '../LanguageSwitcher'

export default function AdminLayout() {
  const { t } = useTranslation()
  const { user, loading, signOut } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [location])

  if (loading) {
    return <div className="admin-loading">{t('admin.loading')}</div>
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  const links = [
    { to: '/admin/home', label: t('admin.homePage'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { to: '/admin/projects', label: t('admin.projects'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    { to: '/admin/contact', label: t('admin.contactAdmin'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
  ]

  return (
    <div className="admin-layout">
      <div className={`admin-sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-top">
          <p className="admin-logo">ADMIN DASHBOARD</p>
          <nav className="admin-nav">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`admin-nav-link ${location.pathname === link.to || (link.to !== '/admin/home' && location.pathname.startsWith(link.to)) ? 'active' : ''}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
          <LanguageSwitcher />
        </div>
        <button className="admin-signout" onClick={signOut}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>{t('admin.signOut')}</span>
        </button>
      </aside>
      <main className="admin-main">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button className="admin-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
        </div>
        <div className="page-fade" key={location.pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
