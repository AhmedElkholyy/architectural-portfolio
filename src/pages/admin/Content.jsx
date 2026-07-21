import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import imageCompression from 'browser-image-compression'

export default function Content() {
  const { t } = useTranslation()
  const [s, setS] = useState(null)
  const [profileFile, setProfileFile] = useState(null)
  const [logoFile, setLogoFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).single()
      .then(({ data }) => { setS(data); setLoading(false) })
  }, [])

  function update(field, value) {
    setS({ ...s, [field]: value })
  }

  async function handleSave() {
    setSaving(true)
    try {
      let profileUrl = s.profile_image_url
      if (profileFile) {
        const c = await imageCompression(profileFile, { maxSizeMB: 5, maxWidthOrHeight: 1920, useWebWorker: true })
        const path = `profile-${Date.now()}.${c.name.split('.').pop()}`
        await supabase.storage.from('profile').upload(path, c)
        profileUrl = supabase.storage.from('profile').getPublicUrl(path).data.publicUrl
      }

      let logoUrl = s.logo_image_url
      if (logoFile) {
        const c = await imageCompression(logoFile, { maxSizeMB: 2, maxWidthOrHeight: 400, useWebWorker: true })
        const path = `logo-${Date.now()}.${c.name.split('.').pop()}`
        await supabase.storage.from('profile').upload(path, c)
        logoUrl = supabase.storage.from('profile').getPublicUrl(path).data.publicUrl
      }

      await supabase.from('site_settings').update({
        logo_type: s.logo_type || 'text',
        logo_text: s.logo_text || 'AK',
        logo_image_url: logoUrl,
        hero_title_en: s.hero_title_en,
        hero_title_ar: s.hero_title_ar,
        hero_subtitle_en: s.hero_subtitle_en,
        hero_subtitle_ar: s.hero_subtitle_ar,
        hero_text_en: s.hero_text_en,
        hero_text_ar: s.hero_text_ar,
        profile_image_url: profileUrl,
        footer_title_en: s.footer_title_en,
        footer_title_ar: s.footer_title_ar,
        footer_social_facebook: s.footer_social_facebook,
        footer_social_instagram: s.footer_social_instagram,
        footer_social_whatsapp: s.footer_social_whatsapp,
        footer_social_behance: s.footer_social_behance,
        footer_social_linkedin: s.footer_social_linkedin,
        updated_at: new Date().toISOString(),
      }).eq('id', 1)

      showToast(t('admin.saved'))
    } catch (err) {
      showToast(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>{t('admin.loading')}</p>

  return (
    <div className="admin-editor">
      {toast && <div className="admin-toast">{toast}</div>}
      <h1>{t('admin.homePage')}</h1>

      {/* Logo */}
      <section className="admin-section">
        <h2>{t('admin.logoSection')}</h2>
        <div className="admin-row">
          <label className="admin-radio">
            <input type="radio" name="logoType" checked={s?.logo_type !== 'image'}
              onChange={() => update('logo_type', 'text')} />
            {t('admin.logoTypeText')}
          </label>
          <label className="admin-radio">
            <input type="radio" name="logoType" checked={s?.logo_type === 'image'}
              onChange={() => update('logo_type', 'image')} />
            {t('admin.logoTypeImage')}
          </label>
        </div>
        {s?.logo_type === 'image' ? (
          <label className="admin-field">
            <span>{t('admin.logoImage')}</span>
            <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
            {s?.logo_image_url && !logoFile && <img src={s.logo_image_url} alt="Logo" className="admin-preview" />}
          </label>
        ) : (
          <label className="admin-field">
            <span>{t('admin.logoText')}</span>
            <input value={s?.logo_text || ''} onChange={(e) => update('logo_text', e.target.value)} />
          </label>
        )}
      </section>

      {/* Hero */}
      <section className="admin-section">
        <h2>{t('admin.heroSection')}</h2>
        <label className="admin-field">
          <span>{t('admin.profileImage')}</span>
          <input type="file" accept="image/*" onChange={(e) => setProfileFile(e.target.files[0])} />
          {s?.profile_image_url && !profileFile && <img src={s.profile_image_url} alt="Profile" className="admin-preview admin-preview-circle" />}
        </label>
        <div className="admin-grid-2">
          <label className="admin-field">
            <span>{t('admin.heroTitleEn')}</span>
            <input value={s?.hero_title_en || ''} onChange={(e) => update('hero_title_en', e.target.value)} />
          </label>
          <label className="admin-field">
            <span>{t('admin.heroTitleAr')}</span>
            <input value={s?.hero_title_ar || ''} onChange={(e) => update('hero_title_ar', e.target.value)} dir="rtl" />
          </label>
        </div>
        <div className="admin-grid-2">
          <label className="admin-field">
            <span>{t('admin.heroSubtitleEn')}</span>
            <input value={s?.hero_subtitle_en || ''} onChange={(e) => update('hero_subtitle_en', e.target.value)} />
          </label>
          <label className="admin-field">
            <span>{t('admin.heroSubtitleAr')}</span>
            <input value={s?.hero_subtitle_ar || ''} onChange={(e) => update('hero_subtitle_ar', e.target.value)} dir="rtl" />
          </label>
        </div>
        <div className="admin-grid-2">
          <label className="admin-field">
            <span>{t('admin.heroTextEn')}</span>
            <textarea value={s?.hero_text_en || ''} onChange={(e) => update('hero_text_en', e.target.value)} />
          </label>
          <label className="admin-field">
            <span>{t('admin.heroTextAr')}</span>
            <textarea value={s?.hero_text_ar || ''} onChange={(e) => update('hero_text_ar', e.target.value)} dir="rtl" />
          </label>
        </div>
      </section>

      {/* Footer */}
      <section className="admin-section">
        <h2>{t('admin.footerSection')}</h2>
        <div className="admin-grid-2">
          <label className="admin-field">
            <span>{t('admin.footerTitleEn')}</span>
            <input value={s?.footer_title_en || ''} onChange={(e) => update('footer_title_en', e.target.value)} />
          </label>
          <label className="admin-field">
            <span>{t('admin.footerTitleAr')}</span>
            <input value={s?.footer_title_ar || ''} onChange={(e) => update('footer_title_ar', e.target.value)} dir="rtl" />
          </label>
        </div>
        <h3>{t('admin.socialLinks')}</h3>
        <p className="admin-hint">{t('admin.socialHint')}</p>
        <div className="admin-grid-2">
          <label className="admin-field">
            <span>{t('admin.socialFacebook')}</span>
            <input value={s?.footer_social_facebook || ''} onChange={(e) => update('footer_social_facebook', e.target.value)} placeholder="https://facebook.com/..." />
          </label>
          <label className="admin-field">
            <span>{t('admin.socialInstagram')}</span>
            <input value={s?.footer_social_instagram || ''} onChange={(e) => update('footer_social_instagram', e.target.value)} placeholder="https://instagram.com/..." />
          </label>
          <label className="admin-field">
            <span>{t('admin.socialWhatsapp')}</span>
            <input value={s?.footer_social_whatsapp || ''} onChange={(e) => update('footer_social_whatsapp', e.target.value)} placeholder="201234567890" />
          </label>
          <label className="admin-field">
            <span>{t('admin.socialLinkedin')}</span>
            <input value={s?.footer_social_linkedin || ''} onChange={(e) => update('footer_social_linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
          </label>
          <label className="admin-field">
            <span>{t('admin.socialBehance')}</span>
            <input value={s?.footer_social_behance || ''} onChange={(e) => update('footer_social_behance', e.target.value)} placeholder="https://behance.net/..." />
          </label>
        </div>
      </section>

      <button className="admin-save" onClick={handleSave} disabled={saving}>
        {saving ? t('admin.loading') : t('admin.save')}
      </button>
    </div>
  )
}
