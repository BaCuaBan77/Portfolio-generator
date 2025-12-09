import { readPortfolioConfig, readProjectsConfig } from '@/lib/config';

export default function AestheticPage({
  portfolio,
  projects,
}: {
  portfolio: Awaited<ReturnType<typeof readPortfolioConfig>>;
  projects: Awaited<ReturnType<typeof readProjectsConfig>>;
}) {
  const professionalProjects = projects.filter((p) => p.category === 'professional');
  const sideProjects = projects.filter((p) => p.category === 'side-project');
  const linkedin = portfolio.socialLinks.linkedin;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b1021] via-[#0f172a] to-[#0b1021] text-slate-100">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_20%,rgba(249,115,22,0.12),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.18),transparent_30%)]" />
      <div className="relative z-10">
        {/* Hero */}
        <header className="max-w-6xl mx-auto px-6 pt-16 pb-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="uppercase tracking-[0.3em] text-xs text-orange-400 mb-4">Hello</p>
              <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
                I'm{' '}
                <span className="text-orange-400">
                  {portfolio.name}
                </span>
                ,<br />
                {portfolio.title}
              </h1>
              <p className="text-slate-300 mb-6 max-w-xl">
                {portfolio.bio}
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {linkedin ? (
                  <a href={linkedin} target="_blank" rel="noreferrer" className="btn btn-primary">
                    Let’s connect with me
                  </a>
                ) : (
                  <a href={`mailto:${portfolio.email}`} className="btn btn-primary">
                    Let’s connect with me
                  </a>
                )}
                <a href="#projects" className="btn btn-outline text-slate-200 border-slate-500">
                  View Portfolio
                </a>
              </div>
              <div className="flex space-x-3 text-sm text-slate-300">
                {portfolio.socialLinks.linkedin && <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noreferrer">in</a>}
                {portfolio.socialLinks.twitter && <a href={portfolio.socialLinks.twitter} target="_blank" rel="noreferrer">𝕏</a>}
                {portfolio.socialLinks.website && <a href={portfolio.socialLinks.website} target="_blank" rel="noreferrer">🌐</a>}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-6 -top-6 w-72 h-72 rounded-full bg-orange-400/70 blur-3xl" />
              <div className="absolute right-0 top-8 w-64 h-64 rounded-full bg-indigo-500/60 blur-3xl" />
              <div className="relative rounded-[28px] bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl border border-white/5">
                <div className="aspect-[3/4] rounded-2xl bg-slate-700/60 border border-white/10 flex items-center justify-center text-5xl font-black text-white">
                  {portfolio.name.split(' ').map((n) => n[0]).join('')}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Capabilities / Services */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-6 text-orange-300">My Capabilities</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {portfolio.capabilities.slice(0, 3).map((cap, idx) => (
              <div
                key={idx}
                className="card bg-white/5 border border-white/10 hover:border-orange-400/40"
              >
                <h3 className="text-xl font-semibold mb-3 text-white">{cap}</h3>
                <p className="text-slate-300 text-sm">
                  Designing end-to-end solutions with a focus on usability and business impact.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Skills</h2>
          <p className="text-slate-300 mb-6">Grouped by domains</p>
          <div className="grid md:grid-cols-2 gap-6">
            {portfolio.skills.map((group) => (
              <div key={group.category} className="card bg-white/5 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">{group.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-200 border border-orange-400/30"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-6 text-white">My Work Experience</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {portfolio.experience.map((exp, idx) => (
              <div key={idx} className="card bg-white/5 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-white">{exp.company}</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-slate-300 mb-2">{exp.position}</p>
                <p className="text-sm text-slate-400">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-3 text-white">My Projects</h2>
          <p className="text-slate-300 mb-6">A look at selected work</p>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...professionalProjects, ...sideProjects].slice(0, 6).map((project) => (
              <div key={project.id} className="card bg-white/5 border border-white/10 hover:border-orange-400/40">
                <div className="text-xs inline-block mb-3 px-3 py-1 rounded-full bg-orange-500/15 text-orange-300 border border-orange-400/30">
                  {project.category === 'professional' ? 'Professional' : 'Side Project'}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{project.name}</h3>
                <p className="text-sm text-slate-300 mb-3 line-clamp-3">{project.abstract}</p>
                <div className="flex items-center gap-4 text-sm text-slate-200">
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="hover:text-orange-300">GitHub →</a>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="hover:text-orange-300">Live →</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900/90 border-t border-white/10 text-slate-300">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="flex flex-wrap justify-between gap-6">
              <div>
                <div className="text-white font-bold text-xl mb-2">{portfolio.name}</div>
                <div className="text-sm text-slate-400">{portfolio.email}</div>
              </div>
              <div className="text-sm text-slate-400">
                © {new Date().getFullYear()} {portfolio.name}. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

