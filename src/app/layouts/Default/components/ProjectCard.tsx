'use client';

import { Project } from '@/types/project';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { renderMarkdown } from '@/lib/utils/markdown-renderer';
import styles from './ProjectCard.module.css';

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
        className={`card ${styles.projectCard}`}
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--card-shadow)'
        }}
        onClick={handleCardClick}
      >
      {project.image && (
        <div className={styles.imageContainer}
             style={{ background: 'var(--color-surface)' }}>
          <motion.img
            src={project.image}
            alt={project.name}
            className={styles.projectImage}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.3 }}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className={styles.imageOverlay} />
        </div>
      )}
      
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle} style={{ color: 'var(--color-text)' }}>
          {project.name}
        </h3>
        <span
          className={styles.categoryBadge}
          style={{
            background: 'var(--color-accent)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)'
          }}
        >
          {project.category === 'professional' ? 'Professional' : 'Personal'}
        </span>
      </div>
      
      <div 
        className={styles.abstract}
        style={{ color: 'var(--color-text-light)' }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(project.abstract) }}
      />
      
      {project.technologies && project.technologies.length > 0 && (
        <div className={styles.techTags}>
          {project.technologies.slice(0, 5).map((tech, i) => (
            <span
              key={i}
              className={styles.techTag}
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
      
      <div className={styles.cardFooter}>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cardLink}
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
            className={styles.cardLink}
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
            className={styles.modalBackdrop}
            onClick={handleCloseModal}
            aria-label="Close modal"
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className={styles.modalContainer}
            onClick={handleCloseModal}
          >
            <div
              className={styles.modalContent}
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
                className={styles.closeButton}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)'
                }}
                aria-label="Close modal"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Content */}
              <div className={styles.modalBody}>
                {/* Project Image */}
                {project.image && (
                  <div className={styles.modalImage}
                       style={{ background: 'var(--color-surface)' }}>
                    <img
                      src={project.image}
                      alt={project.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Header */}
                <div className={styles.modalHeader}>
                  <div className={styles.modalHeaderContent}>
                    <h2 className={styles.modalTitle} style={{ color: 'var(--color-text)' }}>
                      {project.name}
                    </h2>
                    {project.description && (
                      <p className={styles.modalDescription} style={{ color: 'var(--color-text-light)' }}>
                        {project.description}
                      </p>
                    )}
                  </div>
                  <span
                    className={styles.modalBadge}
                    style={{
                      background: 'var(--color-accent)',
                      color: 'var(--color-text)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    {project.category === 'professional' ? 'Professional' : 'Personal'}
                  </span>
                </div>

                {/* Full Abstract */}
                <div className={styles.modalSection}>
                  <h3 className={styles.modalSectionTitle} style={{ color: 'var(--color-text)' }}>
                    About This Project
                  </h3>
                  <div 
                    className={styles.modalAbstract}
                    style={{ color: 'var(--color-text-light)' }}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(project.abstract) }}
                  />
                </div>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle} style={{ color: 'var(--color-text)' }}>
                      Technologies
                    </h3>
                    <div className={styles.modalTechTags}>
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className={styles.modalTechTag}
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
                <div className={styles.modalMetadata}
                     style={{ background: 'var(--color-background)', border: '1px solid var(--color-border)' }}>
                  {project.language && (
                    <div>
                      <span className={styles.metadataLabel} style={{ color: 'var(--color-text)' }}>Language: </span>
                      <span className={styles.metadataValue} style={{ color: 'var(--color-text-light)' }}>{project.language}</span>
                    </div>
                  )}
                  {project.stars !== undefined && (
                    <div>
                      <span className={styles.metadataLabel} style={{ color: 'var(--color-text)' }}>Stars: </span>
                      <span className={styles.metadataValue} style={{ color: 'var(--color-text-light)' }}>{project.stars}</span>
                    </div>
                  )}
                  {project.createdAt && (
                    <div>
                      <span className={styles.metadataLabel} style={{ color: 'var(--color-text)' }}>Created: </span>
                      <span className={styles.metadataValue} style={{ color: 'var(--color-text-light)' }}>{formatDate(project.createdAt)}</span>
                    </div>
                  )}
                  {project.updatedAt && (
                    <div>
                      <span className={styles.metadataLabel} style={{ color: 'var(--color-text)' }}>Updated: </span>
                      <span className={styles.metadataValue} style={{ color: 'var(--color-text-light)' }}>{formatDate(project.updatedAt)}</span>
                    </div>
                  )}
                </div>

                {/* Action Links */}
                <div className={styles.modalActions}
                     style={{ borderColor: 'var(--color-border)' }}>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionButton}
                    style={{
                      background: 'var(--color-primary)',
                      color: 'white'
                    }}
                  >
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.425 22 12.017 22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    <span>View on GitHub</span>
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.actionButton}
                      style={{
                        background: 'var(--color-accent)',
                        color: 'var(--color-text)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

