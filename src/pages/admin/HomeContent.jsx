import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import imageCompression from 'browser-image-compression'

export default function HomeContent() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState(null)
  const [profileFile, setProfileFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: s } = await supabase.from('site_settings').select('*').eq('id', 1).single()
      setSettings(s)
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

        <button onClick={handleSave} disabled={saving}
          style={{ padding: '10px 20px', background: 'var(--accent)', color: 'var(--background)', border: 'none', cursor: 'pointer', alignSelf: 'start' }}>
          {saving ? t('admin.loading') : t('admin.save')}
        </button>
      </div>
    </div>
  )
}
