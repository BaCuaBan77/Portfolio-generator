import { readPortfolioConfig, readProjectsConfig } from "@/lib/config";
import { renderMarkdown } from "@/lib/utils/markdown-renderer";
import styles from "./AestheticPage.module.css";

export default function AestheticPage({
  portfolio,
  projects,
}: {
  portfolio: Awaited<ReturnType<typeof readPortfolioConfig>>;
  projects: Awaited<ReturnType<typeof readProjectsConfig>>;
}) {
  const professionalProjects = projects.filter(
    (p) => p.category === "professional"
  );
  const personalProjects = projects.filter((p) => p.category === "personal");
  const linkedin = portfolio.socialLinks.linkedin;

  return (
    <main className={styles.aestheticPage}>
      <div className={styles.backgroundGradient} />
      <div className={styles.contentWrapper}>
        {/* Hero */}
        <header className={styles.hero}>
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.heroLabel}>Hello</p>
              <h1 className={styles.heroTitle}>
                I'm <span className={styles.heroAccent}>{portfolio.name}</span>
                ,<br />
                {portfolio.title}
              </h1>
              <p
                className={styles.heroBio}
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(portfolio.bio),
                }}
              />
              <div className={styles.heroButtons}>
                {linkedin ? (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                  >
                    Let's connect with me
                  </a>
                ) : (
                  <a
                    href={`mailto:${portfolio.email}`}
                    className="btn btn-primary"
                  >
                    Let's connect with me
                  </a>
                )}
                <a href="#projects" className="btn btn-outline">
                  View Portfolio
                </a>
              </div>
              <div className={styles.socialLinks}>
                {portfolio.socialLinks.linkedin && (
                  <a
                    href={portfolio.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    in
                  </a>
                )}
                {portfolio.socialLinks.twitter && (
                  <a
                    href={portfolio.socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                  >
                    𝕏
                  </a>
                )}
                {portfolio.socialLinks.website && (
                  <a
                    href={portfolio.socialLinks.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    🌐
                  </a>
                )}
              </div>
            </div>
            <div className={styles.profileWrapper}>
              <div className={styles.profileGlow1} />
              <div className={styles.profileGlow2} />
              <div className={styles.profileCard}>
                <div className={styles.profileAvatar}>
                  {portfolio.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Capabilities  */}
        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} ${styles.sectionTitleOrange}`}>
            My Capabilities
          </h2>
          <div className={styles.grid3}>
            {portfolio.domains.slice(0, 3).map((domain, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <h3 className={styles.cardTitle}>{domain}</h3>
                <p className={styles.cardText}>
                  Designing end-to-end solutions with a focus on usability and
                  business impact.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <p className={styles.sectionSubtitle}>Grouped by domains</p>
          <div className={styles.grid2}>
            {portfolio.skills.map((group) => (
              <div
                key={group.category}
                className="card"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <h3 className={styles.cardSmallTitle}>{group.category}</h3>
                <div className={styles.skillTags}>
                  {group.items.map((item, idx) => (
                    <span key={idx} className={styles.skillTag}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        {portfolio.experience && portfolio.experience.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>My Work Experience</h2>
            <div className={styles.grid2}>
              {portfolio.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="card"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className={styles.expHeader}>
                    <h3 className={styles.cardSmallTitle}>{exp.company}</h3>
                    <span className={styles.expBadge}>
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <p className={styles.expPosition}>{exp.position}</p>
                  <p
                    className={styles.expDescription}
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(exp.description),
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        <section id="projects" className={styles.section}>
          <h2 className={styles.sectionTitle}>My Projects</h2>
          <p className={styles.sectionSubtitle}>A look at selected work</p>
          <div className={styles.projectsGrid}>
            {[...professionalProjects, ...personalProjects]
              .slice(0, 6)
              .map((project) => (
                <div
                  key={project.id}
                  className="card"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className={styles.projectBadge}>
                    {project.category === "professional"
                      ? "Professional"
                      : "Personal"}
                  </div>
                  <h3 className={styles.projectTitle}>{project.name}</h3>
                  {(() => {
                    const descriptions = [
                      project.abstract,
                      project.overview,
                      project.readmeDescription,
                      project.projectDescription,
                    ];
                    const firstNonEmpty = descriptions.find(
                      (d) => typeof d === "string" && d.trim().length > 0
                    );
                    return firstNonEmpty ? (
                      <div
                        className={styles.projectAbstract}
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(firstNonEmpty),
                        }}
                      />
                    ) : null;
                  })()}
                  <div className={styles.projectLinks}>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub →
                    </a>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Live →
                      </a>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerGrid}>
              <div>
                <div className={styles.footerName}>{portfolio.name}</div>
                <div className={styles.footerEmail}>{portfolio.email}</div>
              </div>
              <div className={styles.footerCopyright}>
                © {new Date().getFullYear()} {portfolio.name}. All rights
                reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
