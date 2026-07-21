import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'

export default function ContactFooter() {
  const { t } = useTranslation()
  const [contactSettings, setContactSettings] = useState(null)
  const [siteSettings, setSiteSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const [{ data: c }, { data: s }] = await Promise.all([
        supabase.from('contact_page_settings').select('*').eq('id', 1).single(),
        supabase.from('site_settings').select('*').eq('id', 1).single(),
      ])
      setContactSettings(c)
      setSiteSettings(s)
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await supabase.from('contact_page_settings').update({
        heading_en: contactSettings.heading_en,
        heading_ar: contactSettings.heading_ar,
        intro_en: contactSettings.intro_en,
        intro_ar: contactSettings.intro_ar,
        email: contactSettings.email,
        phone: contactSettings.phone,
        location_en: contactSettings.location_en,
        location_ar: contactSettings.location_ar,
        updated_at: new Date().toISOString(),
      }).eq('id', 1)

      await supabase.from('site_settings').update({
        footer_copy_en: siteSettings.footer_copy_en,
        footer_copy_ar: siteSettings.footer_copy_ar,
        footer_email: siteSettings.footer_email,
        footer_social_github: siteSettings.footer_social_github,
        footer_social_linkedin: siteSettings.footer_social_linkedin,
        footer_social_instagram: siteSettings.footer_social_instagram,
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
      <h1>{t('admin.contactFooter')}</h1>

      <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
        <h3>Contact Page</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label>
            {t('admin.headingEn')}
            <input value={contactSettings?.heading_en || ''} onChange={(e) => setContactSettings({ ...contactSettings, heading_en: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
          </label>
          <label>
            {t('admin.headingAr')}
            <input value={contactSettings?.heading_ar || ''} onChange={(e) => setContactSettings({ ...contactSettings, heading_ar: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }} dir="rtl" />
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label>
            {t('admin.introEn')}
            <textarea value={contactSettings?.intro_en || ''} onChange={(e) => setContactSettings({ ...contactSettings, intro_en: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px', minHeight: '80px' }} />
          </label>
          <label>
            {t('admin.introAr')}
            <textarea value={contactSettings?.intro_ar || ''} onChange={(e) => setContactSettings({ ...contactSettings, intro_ar: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px', minHeight: '80px' }} dir="rtl" />
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <label>
            Email
            <input value={contactSettings?.email || ''} onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
          </label>
          <label>
            Phone
            <input value={contactSettings?.phone || ''} onChange={(e) => setContactSettings({ ...contactSettings, phone: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <label>
              Location EN
              <input value={contactSettings?.location_en || ''} onChange={(e) => setContactSettings({ ...contactSettings, location_en: e.target.value })}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
            </label>
            <label>
              Location AR
              <input value={contactSettings?.location_ar || ''} onChange={(e) => setContactSettings({ ...contactSettings, location_ar: e.target.value })}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }} dir="rtl" />
            </label>
          </div>
        </div>

        <h3>Footer</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label>
            {t('admin.footerCopyEn')}
            <input value={siteSettings?.footer_copy_en || ''} onChange={(e) => setSiteSettings({ ...siteSettings, footer_copy_en: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
          </label>
          <label>
            {t('admin.footerCopyAr')}
            <input value={siteSettings?.footer_copy_ar || ''} onChange={(e) => setSiteSettings({ ...siteSettings, footer_copy_ar: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }} dir="rtl" />
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <label>
            Email
            <input value={siteSettings?.footer_email || ''} onChange={(e) => setSiteSettings({ ...siteSettings, footer_email: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
          </label>
          <label>
            GitHub
            <input value={siteSettings?.footer_social_github || ''} onChange={(e) => setSiteSettings({ ...siteSettings, footer_social_github: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
          </label>
          <label>
            LinkedIn
            <input value={siteSettings?.footer_social_linkedin || ''} onChange={(e) => setSiteSettings({ ...siteSettings, footer_social_linkedin: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
          </label>
        </div>
        <label>
          Instagram
          <input value={siteSettings?.footer_social_instagram || ''} onChange={(e) => setSiteSettings({ ...siteSettings, footer_social_instagram: e.target.value })}
            style={{ width: '100%', padding: '8px', marginTop: '4px', maxWidth: '300px' }} />
        </label>

        <button onClick={handleSave} disabled={saving}
          style={{ padding: '10px 20px', background: 'var(--accent)', color: 'var(--background)', border: 'none', cursor: 'pointer', alignSelf: 'start' }}>
          {saving ? t('admin.loading') : t('admin.save')}
        </button>
      </div>
    </div>
  )
}
