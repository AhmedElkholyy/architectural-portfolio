import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import LoadingState from '../components/LoadingState'

export default function ProjectDetail() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [project, setProject] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState({ open: false, index: 0 })

  useEffect(() => {
    if (!supabase) { setLoading(false); return }

    async function fetchProject() {
      const { data, error } = await supabase
        .from('projects').select('*').eq('id', id).eq('published', true).single()

      if (error) { setError(error.message); setLoading(false); return }

      setProject(data)

      const { data: imgs } = await supabase
        .from('project_images').select('*').eq('project_id', id).order('display_order')

      setImages(imgs || [])
      setLoading(false)
    }

    fetchProject()
  }, [id])

  const closeModal = useCallback(() => setModal({ open: false, index: 0 }), [])
  const prevImage = useCallback(() => setModal(s => ({ ...s, index: Math.max(0, s.index - 1) })), [])
  const nextImage = useCallback(() => setModal(s => ({ ...s, index: Math.min(images.length - 1, s.index + 1) })), [images.length])

  useEffect(() => {
    if (!modal.open) return
    document.documentElement.classList.add('lenis-stopped')
    document.body.style.overflow = 'hidden'
    window.__lenis?.stop()
    function handleKey(e) {
      if (e.key === 'Escape') closeModal()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
      document.documentElement.classList.remove('lenis-stopped')
      window.__lenis?.start()
    }
  }, [modal.open, closeModal, prevImage, nextImage])

  const tField = (en, ar) => (lang === 'ar' && ar) ? ar : en
  const currentImage = images[modal.index]
  const hasModalContent = currentImage && (
    currentImage.title_en || currentImage.title_ar ||
    currentImage.subtitle_en || currentImage.subtitle_ar ||
    currentImage.paragraph_en || currentImage.paragraph_ar
  )

  return (
    <section>
      <LoadingState loading={loading} error={error}>
        {project && (
          <>
            <div className="pd-cover" style={project.cover_image_url ? { backgroundImage: `url(${project.cover_image_url})` } : undefined}>
              <div className="pd-cover-overlay" />
              <div className="pd-cover-content">
                <Link to="/portfolio" className="pd-back">← {t('project.backToPortfolio')}</Link>
                <h1 className="pd-title">{tField(project.title_en, project.title_ar)}</h1>
                {(project.subtitle_en || project.subtitle_ar) && (
                  <p className="pd-subtitle">{tField(project.subtitle_en, project.subtitle_ar)}</p>
                )}
              </div>
            </div>

            {(project.description_en || project.description_ar) && (
              <div className="pd-description section">
                <h2 className="pd-section-title">{t('project.about')}</h2>
                <p>{tField(project.description_en, project.description_ar)}</p>
              </div>
            )}

            {images.length > 0 && (
              <div className="pd-gallery section">
                <h2 className="pd-section-title">{t('project.gallery')}</h2>
                <div className="gallery-grid">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      className="gallery-thumb"
                      onClick={() => setModal({ open: true, index: idx })}
                      aria-label={tField(img.alt_en, img.alt_ar)}
                    >
                      <img
                        src={img.image_url}
                        alt={tField(img.alt_en, img.alt_ar)}
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {modal.open && currentImage && (
              <div className="pd-modal-overlay" onClick={closeModal} role="dialog" aria-modal="true">
                <button className="pd-modal-close" onClick={closeModal} aria-label="Close">×</button>
                <button className="pd-modal-prev" onClick={(e) => { e.stopPropagation(); prevImage() }} disabled={modal.index === 0}>‹</button>
                <div className="pd-modal-body" onClick={(e) => e.stopPropagation()}>
                  <div className="pd-modal-image-wrap">
                    <img src={currentImage.image_url} alt={tField(currentImage.alt_en, currentImage.alt_ar)} className="pd-modal-image" />
                  </div>
                  {hasModalContent && (
                    <div className="pd-modal-info">
                      {(currentImage.title_en || currentImage.title_ar) && (
                        <h3 className="pd-modal-title">{tField(currentImage.title_en, currentImage.title_ar)}</h3>
                      )}
                      {(currentImage.subtitle_en || currentImage.subtitle_ar) && (
                        <p className="pd-modal-subtitle">{tField(currentImage.subtitle_en, currentImage.subtitle_ar)}</p>
                      )}
                      {(currentImage.paragraph_en || currentImage.paragraph_ar) && (
                        <p className="pd-modal-paragraph">{tField(currentImage.paragraph_en, currentImage.paragraph_ar)}</p>
                      )}
                    </div>
                  )}
                </div>
                <button className="pd-modal-next" onClick={(e) => { e.stopPropagation(); nextImage() }} disabled={modal.index === images.length - 1}>›</button>
              </div>
            )}
          </>
        )}
      </LoadingState>
    </section>
  )
}
