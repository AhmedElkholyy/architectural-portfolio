import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

export default function ProjectCard({ project }) {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const title = lang === 'ar' ? project.title_ar : project.title_en
  const subtitle = lang === 'ar' ? project.subtitle_ar : project.subtitle_en

  return (
    <Link to={`/project/${project.id}`} className="project-card">
      <article className="project">
        <div className="project-image">
          <div
            className="project-bg"
            style={project.cover_image_url ? { backgroundImage: `url(${project.cover_image_url})` } : undefined}
          />
          <div className="shape" />
          <span className="project-corner project-corner-tl" aria-hidden="true" />
          <span className="project-corner project-corner-br" aria-hidden="true" />
        </div>
        <div className="project-meta">
          <h2>{title}</h2>
          <span className="project-arrow" aria-hidden="true">↗</span>
          {subtitle && <p className="project-card-subtitle">{subtitle}</p>}
        </div>
      </article>
    </Link>
  )
}