'use client';

import { Portfolio } from '@/types/portfolio';
import { Project } from '@/types/project';
import { motion, useInView } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import ProfilePicture from '@/components/ProfilePicture';
import ExperienceTimeline from '@/components/ExperienceTimeline';

interface DefaultPageProps {
  portfolio: Portfolio;
  projects: Project[];
}

export default function DefaultPage({
  portfolio,
  projects,
}: DefaultPageProps) {
  // Header state
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Determine active section based on scroll position
      const sections = [
        { id: 'about', ref: aboutRef },
        { id: 'capabilities', ref: capabilitiesRef },
        { id: 'experience', ref: experienceRef },
        { id: 'projects', ref: projectsRef },
        { id: 'contact', ref: contactRef },
      ];
      
      const scrollPosition = window.scrollY + window.innerHeight / 3; // Use viewport-based offset
      const scrollBottom = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if we're near the bottom of the page (for Contact section)
      if (scrollBottom >= documentHeight - 100) {
        setActiveSection('contact');
        return;
      }
      
      // For other sections, find which one is currently in view
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = section.ref.current;
        if (element) {
          const htmlElement = element as HTMLElement;
          const offsetTop = htmlElement.offsetTop;
          const offsetBottom = offsetTop + htmlElement.offsetHeight;
          
          // Check if scroll position is within this section
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll(); // Check on mount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Projects state
  const [filter, setFilter] = useState<'all' | 'professional' | 'side-project'>('all');
  const professionalProjects = projects.filter(p => p.category === 'professional');
  const sideProjects = projects.filter(p => p.category === 'side-project');
  const filteredProjects = filter === 'all' 
    ? projects 
    : filter === 'professional' 
    ? professionalProjects 
    : sideProjects;

  // Experience sorting
  const sortedExperience = [...portfolio.experience].sort((a, b) => {
    if (a.endDate === 'Present') return -1;
    if (b.endDate === 'Present') return 1;
    return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
  });

  // Refs for scroll animations
  const aboutRef = useRef(null);
  const capabilitiesRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  const aboutInView = useInView(aboutRef, { once: true, margin: '-150px', amount: 0.3 });
  const capabilitiesInView = useInView(capabilitiesRef, { once: true, margin: '-150px', amount: 0.3 });
  const experienceInView = useInView(experienceRef, { once: true, margin: '-150px', amount: 0.3 });
  const projectsInView = useInView(projectsRef, { once: true, margin: '-150px', amount: 0.3 });
  const contactInView = useInView(contactRef, { once: true, margin: '-150px', amount: 0.3 });

  const navItems = ['About', 'Capabilities', 'Experience', 'Projects', 'Contact'];

  return (
    <main className="relative overflow-x-hidden" style={{ background: 'var(--color-background)', color: 'var(--color-text)' }}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-2 sm:pt-3 md:pt-4 pb-2 sm:pb-3 md:pb-4 overflow-x-hidden">
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className={`rounded-full px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 transition-all duration-300 backdrop-blur-lg max-w-full ${
            scrolled ? 'shadow-xl' : 'shadow-lg'
          }`}
          style={{
            background: 'var(--color-surface)',
            color: 'var(--header-text)',
            boxShadow: scrolled 
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          }}
        >
          <nav className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 relative overflow-x-hidden">
            {navItems.map((item, index) => {
              const sectionId = item.toLowerCase();
              const isActive = activeSection === sectionId;
              return (
                <motion.a
                  key={item}
                  href={`#${sectionId}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    color: isActive ? 'rgba(255, 255, 255, 0.95)' : 'var(--header-link)'
                  }}
                  transition={{ 
                    delay: index * 0.05,
                    color: { duration: 0.2, ease: 'easeInOut' }
                  }}
                  whileHover={!isActive ? { opacity: 0.7 } : {}}
                  className="text-xs sm:text-sm font-semibold px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-full relative z-10 whitespace-nowrap"
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavBackground"
                      className="absolute inset-0 rounded-full -z-10"
                      style={{ background: 'var(--color-primary)' }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 500, 
                        damping: 30 
                      }}
                    />
                  )}
                  {item}
                </motion.a>
              );
            })}
          </nav>
        </motion.header>
      </div>

      {/* About Section */}
      <section
        id="about"
        ref={aboutRef}
        className="relative overflow-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20"
        style={{ background: 'var(--color-background)' }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-6"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight"
                style={{ color: 'var(--color-text)' }}
              >
                Hello, I'm{' '}
                <span style={{ color: 'var(--color-text)' }}>
                  {portfolio.name}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-xl sm:text-2xl font-semibold"
                style={{ color: 'var(--color-text-light)' }}
              >
                {portfolio.title}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-base sm:text-lg leading-relaxed max-w-2xl"
                style={{ color: 'var(--color-text-light)' }}
              >
                {portfolio.bio}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={aboutInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center space-x-4"
                style={{ color: 'var(--color-text-light)' }}
              >
                {portfolio.githubUsername && (
                  <a
                    href={`https://github.com/${portfolio.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text)' }}>
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.425 22 12.017 22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
                {portfolio.socialLinks.linkedin && (
                  <a
                    href={portfolio.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text)' }}>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {portfolio.socialLinks.twitter && (
                  <a
                    href={portfolio.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text)' }}>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
                {portfolio.socialLinks.website && (
                  <a
                    href={portfolio.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                )}
              </motion.div>
            </motion.div>

            <ProfilePicture 
              profilePictureUrl={portfolio.profilePictureUrl}
              name={portfolio.name}
              inView={aboutInView}
            />
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section
        id="capabilities"
        ref={capabilitiesRef}
        className="py-12 sm:py-16 md:py-20 lg:py-24"
        style={{ background: 'var(--color-background)' }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={capabilitiesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4" style={{ color: 'var(--color-text)' }}>My Capabilities</h2>
            <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12" style={{ color: 'var(--color-text-light)' }}>
              A mix of strategy, execution, and technology
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={capabilitiesInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="card"
              style={{ 
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--card-shadow)'
              }}
            >
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                Areas of Expertise
              </h3>
              <p className="mb-6" style={{ color: 'var(--color-text-light)' }}>
                High-level capabilities that drive outcomes
              </p>
              <div className="space-y-4">
                {portfolio.capabilities.map((capability, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={capabilitiesInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    className="flex items-start space-x-3"
                  >
                    <div className="mt-1 w-3 h-3 rounded-full" style={{ background: 'var(--color-accent)' }} />
                    <div className="text-lg" style={{ color: 'var(--color-text)' }}>{capability}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={capabilitiesInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="card"
              style={{ 
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--card-shadow)'
              }}
            >
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                Technical Skills
              </h3>
              <p className="mb-6" style={{ color: 'var(--color-text-light)' }}>
                Hands-on tools and technologies I use daily
              </p>
              <div className="space-y-4">
                {portfolio.skills.map((group, gIdx) => (
                  <div key={group.category}>
                    <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                      {group.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item, idx) => (
                        <motion.span
                          key={`${group.category}-${idx}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={capabilitiesInView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ duration: 0.5, delay: 0.5 + (gIdx * 0.05) + idx * 0.03, ease: [0.25, 0.1, 0.25, 1] }}
                          className="px-4 py-2 rounded-full text-sm font-medium"
                          style={{ 
                            background: 'var(--color-accent)',
                            color: 'var(--color-text)',
                            border: '1px solid var(--color-border)'
                          }}
                        >
                          {item}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section
        id="experience"
        ref={experienceRef}
        className="py-12 sm:py-16 md:py-20 lg:py-24"
        style={{ background: 'var(--color-background)' }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={experienceInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-12 sm:mb-14 md:mb-16"
          >
            <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--color-accent)' }}>
              Career Journey
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4" style={{ color: 'var(--color-text)' }}>Professional Experience</h2>
            <p className="text-base sm:text-lg md:text-xl" style={{ color: 'var(--color-text-light)' }}>
              Roles and impact over the years
            </p>
          </motion.div>

          {/* MUI Timeline Component */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={experienceInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-6xl mx-auto"
          >
            <ExperienceTimeline experiences={sortedExperience} />
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        ref={projectsRef}
        className="py-12 sm:py-16 md:py-20 lg:py-24"
        style={{ background: 'var(--color-background)' }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={projectsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4" style={{ color: 'var(--color-text)' }}>My Projects</h2>
            <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12" style={{ color: 'var(--color-text-light)' }}>
              A collection of my work across professional and personal explorations
            </p>
          </motion.div>

          {/* Filter buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={projectsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex justify-center flex-wrap gap-3 mb-12"
          >
            {(['all', 'professional', 'side-project'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '9999px',
                  fontWeight: '500',
                  transition: 'all 0.3s',
                  ...(filter === filterType
                    ? {
                        background: 'var(--color-accent)',
                        color: 'var(--color-text)',
                        boxShadow: 'var(--card-shadow)'
                      }
                    : {
                        background: 'var(--color-surface)',
                        color: 'var(--color-text)',
                        border: '1px solid var(--color-border)'
                      })
                }}
              >
                {filterType === 'all' 
                  ? 'All Projects' 
                  : filterType === 'professional' 
                  ? 'Professional' 
                  : 'Side Projects'}
              </button>
            ))}
          </motion.div>

          {/* Professional Projects */}
          {filter !== 'side-project' && professionalProjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={projectsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-16"
            >
              <h3 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
                Professional Projects
              </h3>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {professionalProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.7, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                    className="card group cursor-pointer overflow-hidden"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--card-shadow)'
                    }}
                  >
                    {project.image && (
                      <div className="relative overflow-hidden rounded-xl mb-4 h-52"
                           style={{ background: 'var(--color-surface)' }}>
                        <motion.img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.3 }}
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 group-hover:opacity-60 transition-opacity" />
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold transition-colors" style={{ color: 'var(--color-text)' }}>
                        {project.name}
                      </h3>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: 'var(--color-accent)',
                          color: 'var(--color-text)',
                          border: '1px solid var(--color-border)'
                        }}
                      >
                        {project.category === 'professional' ? 'Professional' : 'Side Project'}
                      </span>
                    </div>
                    
                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed" style={{ color: 'var(--color-text-light)' }}>{project.abstract}</p>
                    
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 5).map((tech, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-xs"
                        style={{
                          background: 'var(--color-surface)',
                          color: 'var(--color-text)',
                          border: '1px solid var(--color-border)'
                        }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 pt-4 border-t border-slate-100">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm font-medium transition-colors"
                        style={{ color: 'var(--color-text)' }}
                      >
                        <span>GitHub</span>
                        <span>→</span>
                      </a>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-sm font-medium transition-colors"
                        style={{ color: 'var(--color-text)' }}
                        >
                          <span>Live Demo</span>
                          <span>→</span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Side Projects */}
          {filter !== 'professional' && sideProjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={projectsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
                Side Projects
              </h3>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {sideProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.7, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                    className="card group cursor-pointer overflow-hidden"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--card-shadow)'
                    }}
                  >
                    {project.image && (
                      <div className="relative overflow-hidden rounded-xl mb-4 h-52"
                           style={{ background: 'var(--color-surface)' }}>
                        <motion.img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.3 }}
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 group-hover:opacity-60 transition-opacity" />
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold transition-colors" style={{ color: 'var(--color-text)' }}>
                        {project.name}
                      </h3>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: 'var(--color-accent)',
                          color: 'var(--color-text)',
                          border: '1px solid var(--color-border)'
                        }}
                      >
                        {project.category === 'professional' ? 'Professional' : 'Side Project'}
                      </span>
                    </div>
                    
                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed" style={{ color: 'var(--color-text-light)' }}>{project.abstract}</p>
                    
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 5).map((tech, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-xs"
                        style={{
                          background: 'var(--color-surface)',
                          color: 'var(--color-text)',
                          border: '1px solid var(--color-border)'
                        }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 pt-4 border-t border-slate-100">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm font-medium transition-colors"
                        style={{ color: 'var(--color-text)' }}
                      >
                        <span>GitHub</span>
                        <span>→</span>
                      </a>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-sm font-medium transition-colors"
                        style={{ color: 'var(--color-text)' }}
                        >
                          <span>Live Demo</span>
                          <span>→</span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={projectsInView ? { opacity: 1 } : {}}
              className="text-center py-12"
            >
              <p className="text-lg" style={{ color: 'var(--color-text-light)' }}>No projects found in this category.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        ref={contactRef}
        className="py-12 sm:py-16 md:py-20 lg:py-24"
        style={{ background: 'var(--color-background)' }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={contactInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Let's Work Together</h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--color-text-light)' }}>
              Have a project in mind? I'd love to hear from you. Send me a message and let's create something amazing together.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={contactInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-2xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-6 sm:gap-7 md:gap-8 mb-6 sm:mb-7 md:mb-8">
              <motion.a
                href={`mailto:${portfolio.email}`}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-lg transition-all"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--card-shadow)'
                }}
              >
                <div className="text-3xl mb-4">📧</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Email</h3>
                <p style={{ color: 'var(--color-text-light)' }}>{portfolio.email}</p>
              </motion.a>

              {portfolio.socialLinks.linkedin && (
                <motion.a
                  href={portfolio.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-lg transition-all"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--card-shadow)'
                  }}
                >
                  <div className="text-3xl mb-4">💼</div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>LinkedIn</h3>
                  <p style={{ color: 'var(--color-text-light)' }}>Connect with me</p>
                </motion.a>
              )}
            </div>

          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 mt-10" style={{ background: 'var(--color-background)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container mx-auto px-6 text-center">
          <p style={{ color: 'var(--color-text-light)' }}>
            © {new Date().getFullYear()} {portfolio.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
