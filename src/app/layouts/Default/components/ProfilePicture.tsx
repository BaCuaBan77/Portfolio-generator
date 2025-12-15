'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './ProfilePicture.module.css';

interface ProfilePictureProps {
  profilePictureUrl: string | null;
  name: string;
  inView?: boolean;
}

export default function ProfilePicture({ 
  profilePictureUrl, 
  name,
  inView: externalInView 
}: ProfilePictureProps) {
  const ref = useRef(null);
  const internalInView = useInView(ref, { once: true, margin: '-100px', amount: 0.3 });
  const inView = externalInView !== undefined ? externalInView : internalInView;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={styles.profileContainer}
    >
      {profilePictureUrl ? (
        <div className={styles.profileWrapper}>
          <div 
            className={styles.profileImageWrapper}
            style={{ 
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--card-shadow)'
            }}
          >
            <img
              src={profilePictureUrl}
              alt={name}
              className={styles.profileImage}
            />
          </div>
        </div>
      ) : (
        <div className={styles.profilePlaceholder}
             style={{ 
               background: 'var(--color-surface)',
               border: '1px solid var(--color-border)'
             }}>
          <div className={styles.placeholderText} style={{ color: 'var(--color-text)' }}>
            {name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      )}
    </motion.div>
  );
}

