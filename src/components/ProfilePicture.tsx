'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

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
      className="relative flex justify-center"
    >
      {profilePictureUrl ? (
        <div className="relative w-full max-w-md">
          <div 
            className="relative rounded-lg overflow-hidden"
            style={{ 
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--card-shadow)'
            }}
          >
            <img
              src={profilePictureUrl}
              alt={name}
              className="w-full h-auto object-cover"
              style={{ maxHeight: '600px' }}
            />
          </div>
        </div>
      ) : (
        <div className="relative w-full max-w-md aspect-square flex items-center justify-center rounded-lg"
             style={{ 
               background: 'var(--color-surface)',
               border: '1px solid var(--color-border)'
             }}>
          <div className="text-6xl font-black" style={{ color: 'var(--color-text)' }}>
            {name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      )}
    </motion.div>
  );
}

