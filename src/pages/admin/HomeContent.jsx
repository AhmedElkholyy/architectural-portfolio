import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import imageCompression from 'browser-image-compression'

export default function HomeContent() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState(null)
  const [projects, setProjects] = useState([])
  const [featuredIds, setFeaturedIds] = useState([])
  const [profileFile, setProfileFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const [{ data: s }, { data: p }] = await Promise.all([
        supabase.from('site_settings').select('*').eq('id', 1).single(),
        supabase.from('projects').select('id, title_en, title_ar, published').eq('published', true).order('title_en'),
      ])
      setSettings(s)
      setProjects(p || [])
      // Find currently featured
      const featured = (p || []).filter(proj => proj.featured_position).sort((a, b) => a.featured_position - b.featured_position)
      setFeaturedIds(featured.map(f => f.id))
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      let profileUrl = settings.profile_image_url
      if (profileFile) {
        const compressed = await imageCompression(profileFile, { maxSizeMB: 5, maxWidthOrHeight: 1920, useWebWorker: true })
        const ext = compressed.name.split('.').pop()
        const path = `profile-${Date.now()}.${ext}`
        await supabase.storage.from('profile').upload(path, compressed)
        const { data: { publicUrl } } = supabase.storage.from('profile').getPublicUrl(path)
        profileUrl = publicUrl
      }

      // Update featured positions
      for (const proj of projects) {
        const newPos = featuredIds.indexOf(proj.id)
        await supabase.from('projects').update({
          featured_position: newPos >= 0 ? newPos + 1 : null,
          updated_at: new Date().toISOString(),
        }).eq('id', proj.id)
      }

      await supabase.from('site_settings').update({
        about_en: settings.about_en,
        about_ar: settings.about_ar,
        profile_image_url: profileUrl,
        updated_at: new Date().toISOString(),
      }).eq('id', 1)

      alert('Saved!')
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  function toggleFeatured(projectId) {
    if (featuredIds.includes(projectId)) {
      setFeaturedIds(featuredIds.filter(id => id !== projectId))
    } else if (featuredIds.length < 3) {
      setFeaturedIds([...featuredIds, projectId])
    }
  }

  function moveFeatured(projectId, direction) {
    const idx = featuredIds.indexOf(projectId)
    if (idx < 0) return
    const newIds = [...featuredIds]
    const swapIdx = idx + direction
    if (swapIdx < 0 || swapIdx >= newIds.length) return
    ;[newIds[idx], newIds[swapIdx]] = [newIds[swapIdx], newIds[idx]]
    setFeaturedIds(newIds)
  }

  if (loading) return <p>{t('admin.loading')}</p>

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1>{t('admin.homeContent')}</h1>

      <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
        <label>
          {t('admin.profileImage')}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(e) => setProfileFile(e.target.files[0])} style={{ marginTop: '4px' }} />
          {settings?.profile_image_url && !profileFile && (
            <img src={settings.profile_image_url} alt="Profile" style={{ maxWidth: '150px', marginTop: '8px', borderRadius: '50%' }} />
          )}
        </label>

        <label>
          {t('admin.aboutEn')}
          <textarea value={settings?.about_en || ''} onChange={(e) => setSettings({ ...settings, about_en: e.target.value })}
            style={{ width: '100%', padding: '8px', marginTop: '4px', minHeight: '100px' }} />
        </label>

        <label>
          {t('admin.aboutAr')}
          <textarea value={settings?.about_ar || ''} onChange={(e) => setSettings({ ...settings, about_ar: e.target.value })}
            style={{ width: '100%', padding: '8px', marginTop: '4px', minHeight: '100px' }} dir="rtl" />
        </label>

        <div>
          <h3>{t('admin.featuredProjects')}</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Selected: {featuredIds.length}/3
          </p>
          <div style={{ display: 'grid', gap: '8px', marginTop: '8px' }}>
            {projects.map((proj) => (
              <div key={proj.id} style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px',
                background: featuredIds.includes(proj.id) ? 'var(--surface)' : 'transparent',
                borderRadius: '4px', border: '1px solid var(--border)',
              }}>
                <input
                  type="checkbox"
                  checked={featuredIds.includes(proj.id)}
                  onChange={() => toggleFeatured(proj.id)}
                  disabled={!featuredIds.includes(proj.id) && featuredIds.length >= 3}
                />
                <span style={{ flex: 1 }}>{proj.title_en}</span>
                {featuredIds.includes(proj.id) && (
                  <>
                    <button onClick={() => moveFeatured(proj.id, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>↑</button>
                    <button onClick={() => moveFeatured(proj.id, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>↓</button>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      #{featuredIds.indexOf(proj.id) + 1}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          style={{ padding: '10px 20px', background: 'var(--accent)', color: 'var(--background)', border: 'none', cursor: 'pointer', alignSelf: 'start' }}>
          {saving ? t('admin.loading') : t('admin.save')}
        </button>
      </div>
    </div>
  )
}
