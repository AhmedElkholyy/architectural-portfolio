import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import ConfirmModal from '../../components/ConfirmModal'

export default function Projects() {
  const { t } = useTranslation()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)

  useEffect(() => { fetchProjects() }, [])

  async function fetchProjects() {
    const { data } = await supabase
      .from('projects')
      .select('id, title_en, title_ar, subtitle_en, subtitle_ar, published, cover_image_url, featured_position, created_at')
      .order('created_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  async function togglePublish(project) {
    await supabase
      .from('projects')
      .update({ published: !project.published, updated_at: new Date().toISOString() })
      .eq('id', project.id)
    fetchProjects()
  }

  async function toggleFeatured(project) {
    const currentFeatured = projects.filter(p => p.featured_position).sort((a, b) => a.featured_position - b.featured_position)
    if (project.featured_position) {
      await supabase.from('projects').update({ featured_position: null, updated_at: new Date().toISOString() }).eq('id', project.id)
    } else if (currentFeatured.length < 3) {
      await supabase.from('projects').update({ featured_position: currentFeatured.length + 1, updated_at: new Date().toISOString() }).eq('id', project.id)
    }
    fetchProjects()
  }

  async function moveFeatured(project, direction) {
    const currentFeatured = projects.filter(p => p.featured_position).sort((a, b) => a.featured_position - b.featured_position)
    const idx = currentFeatured.findIndex(p => p.id === project.id)
    if (idx < 0) return
    const swapIdx = idx + direction
    if (swapIdx < 0 || swapIdx >= currentFeatured.length) return
    const other = currentFeatured[swapIdx]
    await supabase.from('projects').update({ featured_position: swapIdx + 1, updated_at: new Date().toISOString() }).eq('id', project.id)
    await supabase.from('projects').update({ featured_position: idx + 1, updated_at: new Date().toISOString() }).eq('id', other.id)
    fetchProjects()
  }

  function requestDelete(project) { setPendingDelete(project); setConfirmOpen(true) }

  async function confirmDelete() {
    const project = pendingDelete
    setConfirmOpen(false)
    setPendingDelete(null)
    if (!project) return
    if (project.cover_image_url) {
      const path = project.cover_image_url.split('/').pop()
      await supabase.storage.from('projects').remove([path])
    }
    await supabase.from('projects').delete().eq('id', project.id)
    fetchProjects()
  }

  if (loading) return <p>{t('admin.loading')}</p>

  const featuredCount = projects.filter(p => p.featured_position).length

  return (
    <div className="admin-editor">
      <h1>{t('admin.projects')}</h1>

      <section className="admin-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <p className="admin-hint">{projects.length} {t('admin.projectCount').toLowerCase()}</p>
          <Link to="/admin/projects/new" className="admin-save" style={{ textDecoration: 'none', margin: 0 }}>
            {t('admin.newProject')}
          </Link>
        </div>

        <div className="admin-project-list">
          {projects.map((p) => (
            <div key={p.id} className="admin-project-row">
              <div className="admin-project-thumb">
                {p.cover_image_url
                  ? <img src={p.cover_image_url} alt={p.title_en} />
                  : <div className="admin-project-thumb-empty" />
                }
              </div>
              <div className="admin-project-info">
                <div className="admin-project-title">{p.title_en}</div>
                {p.subtitle_en && <div className="admin-project-subtitle">{p.subtitle_en}</div>}
                <div className="admin-project-meta">
                  <span className={`admin-badge ${p.published ? 'published' : 'draft'}`}>
                    {p.published ? t('admin.published') : t('admin.draft')}
                  </span>
                  {p.featured_position && (
                    <span className="admin-badge featured">#{p.featured_position}</span>
                  )}
                </div>
              </div>
              <div className="admin-project-actions">
                <Link to={`/admin/projects/${p.id}`} className="admin-action-link">{t('admin.editProject')}</Link>
                <button onClick={() => togglePublish(p)} className="admin-action-link">
                  {p.published ? t('admin.unpublish') : t('admin.publish')}
                </button>
                <button onClick={() => toggleFeatured(p)} className="admin-action-link"
                  disabled={!p.featured_position && featuredCount >= 3}>
                  {p.featured_position ? 'Unfeature' : t('admin.featured')}
                </button>
                {p.featured_position && (
                  <span className="admin-featured-arrows">
                    <button onClick={() => moveFeatured(p, -1)} disabled={p.featured_position <= 1}>↑</button>
                    <button onClick={() => moveFeatured(p, 1)} disabled={p.featured_position >= featuredCount}>↓</button>
                  </span>
                )}
                <button onClick={() => requestDelete(p)} className="admin-action-link danger">{t('admin.delete')}</button>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p className="admin-empty">{t('admin.noProjects')}</p>}
        </div>
      </section>

      <ConfirmModal
        open={confirmOpen}
        title={t('admin.deleteProject')}
        message={`${t('admin.confirm')} "${pendingDelete?.title_en}"?`}
        onConfirm={confirmDelete}
        onCancel={() => { setConfirmOpen(false); setPendingDelete(null) }}
        danger
      />
    </div>
  )
}
