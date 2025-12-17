'use client';

import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Experience } from '@/types/portfolio';
import { Box, Button } from '@mui/material';
import { renderMarkdown } from '@/lib/utils/markdown-renderer';
import GenericTimeline from './Timeline';

interface ExperienceTimelineProps {
  experiences: Experience[];
}

const MAX_DESCRIPTION_LENGTH = 200;
const MAX_ACHIEVEMENTS_SHOWN = 2;

export default function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const renderContent = (exp: Experience, index: number) => {
    const isExpanded = expandedItems.has(index);
    const itemNeedsTruncation = exp.description.length > MAX_DESCRIPTION_LENGTH || (exp.achievements && exp.achievements.length > MAX_ACHIEVEMENTS_SHOWN);
    const truncatedDescription = isExpanded
      ? exp.description
      : itemNeedsTruncation
        ? exp.description.substring(0, MAX_DESCRIPTION_LENGTH) + '...'
        : exp.description;

    return (
      <>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1, color: 'var(--color-text)' }}>
          {exp.position}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-text)' }}>
          {exp.company}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{ color: 'var(--color-text)', opacity: 0.95, display: 'inline' }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(truncatedDescription) }}
          />
        </Box>

        {exp.achievements && exp.achievements.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-text-light)', display: 'block', mb: 1 }}>
              Key Achievements:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {(isExpanded || exp.achievements.length <= MAX_ACHIEVEMENTS_SHOWN
                ? exp.achievements
                : exp.achievements.slice(0, MAX_ACHIEVEMENTS_SHOWN)).map((achievement, i) => (
                  <Typography
                    key={i}
                    component="li"
                    variant="body2"
                    sx={{ mb: 0.5, color: 'var(--color-text)', opacity: 0.95 }}
                  >
                    {achievement}
                  </Typography>
                ))}
            </Box>
          </Box>
        )}
        {itemNeedsTruncation && (
          <Button
            onClick={() => toggleExpanded(index)}
            size="small"
            sx={{
              ml: 1,
              color: 'var(--color-accent)',
              fontWeight: 600,
              textTransform: 'none',
              minWidth: 'auto',
              padding: '2px 8px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            {isExpanded ? 'See less' : 'See more'}
          </Button>
        )}
      </>
    );
  };

  return <GenericTimeline items={experiences} renderContent={renderContent} />;
}
