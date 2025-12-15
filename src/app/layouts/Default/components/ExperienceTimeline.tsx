'use client';

import { useState } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import { Experience } from '@/types/portfolio';
import { Box, Chip, Button } from '@mui/material';

interface ExperienceTimelineProps {
  experiences: Experience[];
}

const MAX_DESCRIPTION_LENGTH = 200;
const MAX_ACHIEVEMENTS_SHOWN = 2;

export default function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const colors = ['primary', 'secondary', 'success', 'warning', 'info'] as const;

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const shouldTruncate = (description: string, achievements?: string[]) => {
    return description.length > MAX_DESCRIPTION_LENGTH || (achievements && achievements.length > MAX_ACHIEVEMENTS_SHOWN);
  };

  return (
    <Timeline position="alternate">
      {experiences.map((exp, index) => {
        const isEven = index % 2 === 0;
        const color = colors[index % colors.length];
        const isLast = index === experiences.length - 1;

        return (
          <TimelineItem key={index}>
            <TimelineOppositeContent
              sx={{ m: 'auto 0' }}
              align={isEven ? 'right' : 'left'}
              variant="body2"
              color="text.secondary"
            >
              <Chip
                label={`${exp.startDate} - ${exp.endDate}`}
                size="medium"
                sx={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-text)',
                  fontWeight: 600,
                }}
              />
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot color={color}>
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </TimelineDot>
              {!isLast && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--card-shadow)',
                }}
              >
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1, color: 'var(--color-text)' }}>
                  {exp.position}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-accent)' }}>
                  {exp.company}
                </Typography>
                
                {(() => {
                  const isExpanded = expandedItems.has(index);
                  const itemNeedsTruncation = exp.description.length > MAX_DESCRIPTION_LENGTH || (exp.achievements && exp.achievements.length > MAX_ACHIEVEMENTS_SHOWN);
                  const truncatedDescription = isExpanded 
                    ? exp.description 
                    : itemNeedsTruncation
                      ? exp.description.substring(0, MAX_DESCRIPTION_LENGTH) + '...'
                      : exp.description;
                  
                  return (
                    <>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: 'var(--color-text-light)', opacity: 0.9, display: 'inline' }}>
                          {truncatedDescription}
                        </Typography>
                        
                      </Box>
                      
                      {exp.achievements && exp.achievements.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-text)', display: 'block', mb: 1 }}>
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
                                sx={{ mb: 0.5, color: 'var(--color-text-light)', opacity: 0.9 }}
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
                })()}
              </Box>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
