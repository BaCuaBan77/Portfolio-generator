'use client';

import { Project } from '@/types/project';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { renderMarkdown } from '@/lib/utils/markdown-renderer';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open modal if clicking on links
    if ((e.target as HTMLElement).closest('a')) {
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Handle ESC key to close modal and prevent scrolling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      
      // Store original values
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      
      // Simply prevent scrolling with overflow: hidden
      // This doesn't change the scroll position, so no restoration needed
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        
        // Restore original styles - scroll position is automatically maintained
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen, handleCloseModal]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
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
        onClick={handleCardClick}
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
      
      <div 
        className="mb-4 line-clamp-3 text-sm leading-relaxed" 
        style={{ color: 'var(--color-text-light)' }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(project.abstract) }}
      />
      
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

    {/* Project Detail Modal */}
    <AnimatePresence>
      {isModalOpen && (
        <>
          {/* Backdrop - click outside to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
            onClick={handleCloseModal}
            aria-label="Close modal"
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 pointer-events-none"
            onClick={handleCloseModal}
          >
            <div
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl pointer-events-auto"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)'
                }}
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 md:p-10">
                {/* Project Image */}
                {project.image && (
                  <div className="relative overflow-hidden rounded-xl mb-6 h-64 sm:h-80"
                       style={{ background: 'var(--color-surface)' }}>
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                      {project.name}
                    </h2>
                    {project.description && (
                      <p className="text-lg mb-4" style={{ color: 'var(--color-text-light)' }}>
                        {project.description}
                      </p>
                    )}
                  </div>
                  <span
                    className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap"
                    style={{
                      background: 'var(--color-accent)',
                      color: 'var(--color-text)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    {project.category === 'professional' ? 'Professional' : 'Side Project'}
                  </span>
                </div>

                {/* Full Abstract */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                    About This Project
                  </h3>
                  <div 
                    className="prose prose-sm max-w-none leading-relaxed"
                    style={{ color: 'var(--color-text-light)' }}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(project.abstract) }}
                  />
                </div>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 rounded-full text-sm"
                          style={{
                            background: 'var(--color-accent)',
                            color: 'var(--color-text)',
                            border: '1px solid var(--color-border)'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-lg"
                     style={{ background: 'var(--color-background)', border: '1px solid var(--color-border)' }}>
                  {project.language && (
                    <div>
                      <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Language: </span>
                      <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>{project.language}</span>
                    </div>
                  )}
                  {project.stars !== undefined && (
                    <div>
                      <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Stars: </span>
                      <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>{project.stars}</span>
                    </div>
                  )}
                  {project.createdAt && (
                    <div>
                      <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Created: </span>
                      <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>{formatDate(project.createdAt)}</span>
                    </div>
                  )}
                  {project.updatedAt && (
                    <div>
                      <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Updated: </span>
                      <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>{formatDate(project.updatedAt)}</span>
                    </div>
                  )}
                </div>

                {/* Action Links */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t"
                     style={{ borderColor: 'var(--color-border)' }}>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                    style={{
                      background: 'var(--color-primary)',
                      color: 'white'
                    }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.425 22 12.017 22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    <span>View on GitHub</span>
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                      style={{
                        background: 'var(--color-accent)',
                        color: 'var(--color-text)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}

