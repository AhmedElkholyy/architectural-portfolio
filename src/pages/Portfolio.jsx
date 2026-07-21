import { useTranslation } from 'react-i18next'
import { useProjects } from '../hooks/useProjects'
import LoadingState from '../components/LoadingState'
import ProjectCard from '../components/ProjectCard'

export default function Portfolio() {
  const { t } = useTranslation()
  const { projects, loading, error } = useProjects({ published: true })

  return (
    <section className="section">
      <div className="portfolio-header">
        <h1 className="portfolio-title">{t('portfolio.title')}</h1>
      </div>
      <LoadingState loading={loading} error={error} empty={projects.length === 0}>
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </LoadingState>
    </section>
  )
}
