import './App.css'

const projects = [
  { number: '01', title: 'Harbor House', type: 'Residential · 2024', className: 'project-one' },
  { number: '02', title: 'The Atrium', type: 'Workplace · 2023', className: 'project-two' },
  { number: '03', title: 'Desert Courtyard', type: 'Hospitality · 2022', className: 'project-three' },
]

function App() {
  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#top" aria-label="Amina Khalil home">AK<span>.</span></a>
        <div className="nav-links"><a href="#work">Selected work</a><a href="#about">Profile</a><a href="#contact">Contact</a></div>
        <a className="availability" href="mailto:hello@aminakhalil.com"><i /> Available for select projects</a>
      </nav>

      <section className="hero" id="top">
        <p className="eyebrow">Architectural engineer · Cairo, EG</p>
        <h1>Spaces that<br /><em>hold a feeling.</em></h1>
        <div className="hero-bottom"><p>Thoughtful architecture shaped by light, material, and the rituals of everyday life.</p><a href="#work" className="arrow-link">Explore selected work <span>↓</span></a></div>
        <div className="hero-art" aria-label="Abstract architectural model"><div className="sun" /><div className="arc arc-one" /><div className="arc arc-two" /><div className="column" /><div className="ground" /></div>
      </section>

      <section className="work section" id="work">
        <div className="section-head"><p className="eyebrow">Selected work</p><p>(2022—2024)</p></div>
        <div className="project-grid">{projects.map((project) => <article className="project" key={project.number}><div className={`project-image ${project.className}`}><span>{project.number}</span><div className="shape" /></div><div className="project-meta"><h2>{project.title}</h2><p>{project.type}</p><span>↗</span></div></article>)}</div>
      </section>

      <section className="about section" id="about"><p className="eyebrow">Practice</p><div><h2>Architecture is a conversation between a place and the people who inhabit it.</h2><p>My work moves between the technical precision of engineering and the human warmth of interior experience. I collaborate with clients from the first sketch through the final detail.</p><a href="#contact" className="text-link">More about the practice <span>→</span></a></div></section>

      <footer id="contact"><p className="eyebrow">Start a conversation</p><h2>Have a place in mind?</h2><a className="email" href="mailto:hello@aminakhalil.com">hello@aminakhalil.com <span>↗</span></a><div className="footer-bottom"><span>© 2026 Amina Khalil</span><span>Architectural Engineer</span><a href="#top">Back to top ↑</a></div></footer>
    </main>
  )
}

export default App
