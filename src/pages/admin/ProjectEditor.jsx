import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import imageCompression from 'browser-image-compression'
import CropModal from '../../components/CropModal'
import { getCroppedImg } from '../../lib/cropImage'

export default function ProjectEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isNew = !id || id === 'new'

  const [form, setForm] = useState({
    title_en: '', title_ar: '', subtitle_en: '', subtitle_ar: '',
    description_en: '', description_ar: '', published: false,
  })
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [cropModal, setCropModal] = useState(null)

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2000) }

  useEffect(() => {
    if (!isNew && id) {
      supabase.from('projects').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          setForm({
            title_en: data.title_en, title_ar: data.title_ar,
            subtitle_en: data.subtitle_en || '', subtitle_ar: data.subtitle_ar || '',
            description_en: data.description_en, description_ar: data.description_ar,
            published: data.published,
          })
          setCoverPreview(data.cover_image_url)
        }
        setLoading(false)
      })
      supabase.from('project_images').select('*').eq('project_id', id).order('display_order').then(({ data }) => {
        setGallery(data || [])
      })
    }
  }, [id, isNew])

  function update(field, value) { setForm({ ...form, [field]: value }) }

  async function compressImage(file, maxSizeMB = 5) {
    return await imageCompression(file, { maxSizeMB, maxWidthOrHeight: 1920, useWebWorker: true })
  }

  async function uploadImage(file, bucket) {
    const compressed = await compressImage(file)
    const ext = compressed.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from(bucket).upload(path, compressed)
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
    return publicUrl
  }

  async function handleSave(publish = false) {
    if (publish && !coverFile && !coverPreview) {
      showToast('Cover image is required to publish')
      return
    }
    setSaving(true)
    try {
      let coverUrl = coverPreview
      if (coverFile) {
        coverUrl = await uploadImage(coverFile, 'projects')
      }

      const payload = {
        ...form,
        category: form.category || '',
        published: publish,
        cover_image_url: coverUrl,
        updated_at: new Date().toISOString(),
      }

      let projectId = id
      if (isNew) {
        const { data, error } = await supabase.from('projects').insert(payload).select().single()
        if (error) throw error
        projectId = data.id
      } else {
        const { error } = await supabase.from('projects').update(payload).eq('id', id)
        if (error) throw error
      }

      for (const img of gallery) {
        if (img._file && !img.image_url) {
          const url = await uploadImage(img._file, 'projects')
          await supabase.from('project_images').insert({
            project_id: projectId, image_url: url,
            title_en: img.title_en || '', title_ar: img.title_ar || '',
            subtitle_en: img.subtitle_en || '', subtitle_ar: img.subtitle_ar || '',
            paragraph_en: img.paragraph_en || '', paragraph_ar: img.paragraph_ar || '',
            alt_en: img.alt_en || '', alt_ar: img.alt_ar || '',
            display_order: img.display_order,
          })
        } else if (img.id && !img._deleted) {
          await supabase.from('project_images').update({
            title_en: img.title_en || '', title_ar: img.title_ar || '',
            subtitle_en: img.subtitle_en || '', subtitle_ar: img.subtitle_ar || '',
            paragraph_en: img.paragraph_en || '', paragraph_ar: img.paragraph_ar || '',
            alt_en: img.alt_en || '', alt_ar: img.alt_ar || '',
            display_order: img.display_order,
          }).eq('id', img.id)
        }
      }

      for (const img of gallery) {
        if (img._deleted && img.id) {
          if (img.image_url) {
            const path = img.image_url.split('/').pop()
            await supabase.storage.from('projects').remove([path])
          }
          await supabase.from('project_images').delete().eq('id', img.id)
        }
      }

      showToast(t('admin.saved'))
      setTimeout(() => navigate('/admin/projects'), 600)
    } catch (err) {
      showToast(err.message)
    } finally {
      setSaving(false)
    }
  }

  function addGalleryImage() {
    setGallery([...gallery, {
      _file: null, alt_en: '', alt_ar: '',
      title_en: '', title_ar: '', subtitle_en: '', subtitle_ar: '',
      paragraph_en: '', paragraph_ar: '',
      display_order: gallery.length,
    }])
  }

  function updateGalleryImage(index, field, value) {
    const updated = [...gallery]
    updated[index] = { ...updated[index], [field]: value }
    setGallery(updated)
  }

  function removeGalleryImage(index) {
    const updated = [...gallery]
    if (updated[index].id) {
      updated[index] = { ...updated[index], _deleted: true }
    } else {
      updated.splice(index, 1)
    }
    setGallery(updated)
  }

  async function handleCropConfirm(cropPixels) {
    if (!cropModal) return
    const blob = await getCroppedImg(cropModal.image, cropPixels)
    const file = new File([blob], 'cover.jpg', { type: 'image/jpeg' })
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(blob))
    setCropModal(null)
  }

  if (loading) return <p>{t('admin.loading')}</p>

  return (
    <div className="admin-editor">
      {toast && <div className="admin-toast">{toast}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => navigate('/admin/projects')} className="admin-back" aria-label={t('admin.back')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 style={{ margin: 0 }}>{isNew ? t('admin.newProject') : t('admin.editProject')}</h1>
      </div>

      {/* Project Info */}
      <section className="admin-section">
        <h2>{t('admin.projects')}</h2>
        <div className="admin-grid-2">
          <label className="admin-field">
            <span>{t('admin.headingEn')}</span>
            <input value={form.title_en} onChange={(e) => update('title_en', e.target.value)} />
          </label>
          <label className="admin-field">
            <span>{t('admin.headingAr')}</span>
            <input value={form.title_ar} onChange={(e) => update('title_ar', e.target.value)} dir="rtl" />
          </label>
        </div>
        <div className="admin-grid-2">
          <label className="admin-field">
            <span>{t('admin.subtitleEn')}</span>
            <input value={form.subtitle_en} onChange={(e) => update('subtitle_en', e.target.value)} />
          </label>
          <label className="admin-field">
            <span>{t('admin.subtitleAr')}</span>
            <input value={form.subtitle_ar} onChange={(e) => update('subtitle_ar', e.target.value)} dir="rtl" />
          </label>
        </div>
        <div className="admin-grid-2">
          <label className="admin-field">
            <span>{t('admin.aboutEn')}</span>
            <textarea value={form.description_en} onChange={(e) => update('description_en', e.target.value)} />
          </label>
          <label className="admin-field">
            <span>{t('admin.aboutAr')}</span>
            <textarea value={form.description_ar} onChange={(e) => update('description_ar', e.target.value)} dir="rtl" />
          </label>
        </div>
      </section>

      {/* Cover Image */}
      <section className="admin-section">
        <h2>Cover Image</h2>
        <label className="admin-field">
          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(e) => {
              const file = e.target.files[0]
              if (file) setCropModal({ image: URL.createObjectURL(file) })
            }} />
          {coverPreview && <img src={coverPreview} alt="Cover preview" className="admin-preview" />}
        </label>
      </section>

      {/* Gallery */}
      <section className="admin-section">
        <h2>{t('project.gallery')}</h2>
        <p className="admin-hint">{t('admin.galleryContentHint')}</p>

        {gallery.filter(img => !img._deleted).map((img) => {
          const i = gallery.indexOf(img)
          return (
          <div key={img.id || `new-${i}`} className="admin-gallery-item">
            <div className="admin-gallery-header">
              <span className="admin-gallery-number">{i + 1}</span>
              <button onClick={() => removeGalleryImage(i)} className="admin-gallery-remove">✕</button>
            </div>

            <label className="admin-field">
              <span>{t('admin.galleryImage')}</span>
              <input type="file" accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(e) => updateGalleryImage(i, '_file', e.target.files[0])} />
              {img.image_url && !img._file && <img src={img.image_url} alt="" className="admin-preview" />}
            </label>

            <div className="admin-grid-2">
              <label className="admin-field">
                <span>{t('admin.galleryTitleEn')}</span>
                <input value={img.title_en || ''} onChange={(e) => updateGalleryImage(i, 'title_en', e.target.value)} />
              </label>
              <label className="admin-field">
                <span>{t('admin.galleryTitleAr')}</span>
                <input value={img.title_ar || ''} onChange={(e) => updateGalleryImage(i, 'title_ar', e.target.value)} dir="rtl" />
              </label>
            </div>
            <div className="admin-grid-2">
              <label className="admin-field">
                <span>{t('admin.gallerySubtitleEn')}</span>
                <input value={img.subtitle_en || ''} onChange={(e) => updateGalleryImage(i, 'subtitle_en', e.target.value)} />
              </label>
              <label className="admin-field">
                <span>{t('admin.gallerySubtitleAr')}</span>
                <input value={img.subtitle_ar || ''} onChange={(e) => updateGalleryImage(i, 'subtitle_ar', e.target.value)} dir="rtl" />
              </label>
            </div>
            <div className="admin-grid-2">
              <label className="admin-field">
                <span>{t('admin.galleryParagraphEn')}</span>
                <textarea value={img.paragraph_en || ''} onChange={(e) => updateGalleryImage(i, 'paragraph_en', e.target.value)} />
              </label>
              <label className="admin-field">
                <span>{t('admin.galleryParagraphAr')}</span>
                <textarea value={img.paragraph_ar || ''} onChange={(e) => updateGalleryImage(i, 'paragraph_ar', e.target.value)} dir="rtl" />
              </label>
            </div>
          </div>
          )
        })}

        <button onClick={addGalleryImage} className="admin-save" style={{ background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
          + {t('admin.addImage')}
        </button>
      </section>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => handleSave(false)} disabled={saving} className="admin-save" style={{ background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
          {saving ? t('admin.loading') : t('admin.save')} ({t('admin.draft')})
        </button>
        <button onClick={() => handleSave(true)} disabled={saving} className="admin-save">
          {saving ? t('admin.loading') : t('admin.publish')}
        </button>
      </div>

      {cropModal && (
        <CropModal
          image={cropModal.image}
          aspect={16 / 9}
          onCrop={handleCropConfirm}
          onCancel={() => setCropModal(null)}
        />
      )}
    </div>
  )
}
