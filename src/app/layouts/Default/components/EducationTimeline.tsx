'use client';

import Typography from '@mui/material/Typography';
import { Education } from '@/types/portfolio';
import GenericTimeline from './Timeline';

interface EducationTimelineProps {
  education: Education[];
}

export default function EducationTimeline({ education }: EducationTimelineProps) {
  const renderContent = (edu: Education) => {
    return (
      <>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1, color: 'var(--color-text)' }}>
          {edu.degree}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--color-text)' }}>
          {edu.school}
        </Typography>
      </>
    );
  };

  const renderIcon = () => {
    return (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 14l9-5-9-5-9 5 9 5z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 14v7m0-7l-9-5m9 5l9-5m-9 5v7"
        />
      </svg>
    );
  };

  return <GenericTimeline items={education} renderContent={renderContent} renderIcon={renderIcon} />;
}

