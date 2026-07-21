import { useTranslation } from 'react-i18next'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { useProjects } from '../hooks/useProjects'
import LoadingState from '../components/LoadingState'
import ProjectCard from '../components/ProjectCard'

export default function Home() {
  const { t, i18n } = useTranslation()
  const { settings, loading, error } = useSiteSettings()
  const { projects: featured } = useProjects({ featured: true, limit: 3 })

  const lang = i18n.language
  const title1 = lang === 'ar' ? (settings?.hero_title_ar || t('home.heroTitle1')) : (settings?.hero_title_en || t('home.heroTitle1'))
  const title2 = lang === 'ar' ? (settings?.hero_subtitle_ar || t('home.heroTitle2')) : (settings?.hero_subtitle_en || t('home.heroTitle2'))
  const heroText = lang === 'ar' ? (settings?.hero_text_ar || t('home.heroFallback')) : (settings?.hero_text_en || t('home.heroFallback'))

  return (
    <>
      {loading ? (
        <section className="hero" id="top" />
      ) : (
      <section className="hero" id="top">
        <h1>{title1}<br /><em>{title2}</em></h1>
        <p className="hero-subtitle">{heroText}</p>
        {settings?.profile_image_url && (
          <div className="hero-photo-wrap">
            <img
              src={settings.profile_image_url}
              alt={t('home.profileAlt')}
              className="hero-profile"
              loading="lazy"
            />
          </div>
        )}
      </section>
      )}

      <section className="work section" id="work">
        <div className="section-head">
          <p className="eyebrow">{t('home.featured')}</p>
        </div>
        <LoadingState loading={loading} error={error}>
          <div className="project-grid">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </LoadingState>
      </section>
    </>
  )
}
