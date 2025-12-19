"use client";

import { useState } from "react";
import Typography from "@mui/material/Typography";
import { Experience } from "@/types/portfolio";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { renderMarkdown } from "@/lib/utils/markdown-renderer";
import GenericTimeline from "./Timeline";

interface ExperienceTimelineProps {
  experiences: Experience[];
}

const MAX_DESCRIPTION_LENGTH = 200;
const MAX_ACHIEVEMENTS_SHOWN = 2;

export default function ExperienceTimeline({
  experiences,
}: ExperienceTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
    const itemNeedsTruncation =
      exp.description.length > MAX_DESCRIPTION_LENGTH ||
      (exp.achievements && exp.achievements.length > MAX_ACHIEVEMENTS_SHOWN);
    const truncatedDescription = isExpanded
      ? exp.description
      : itemNeedsTruncation
      ? exp.description.substring(0, MAX_DESCRIPTION_LENGTH) + "..."
      : exp.description;

    return (
      <>
        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          component="h3"
          sx={{
            fontWeight: "bold",
            mb: isMobile ? 0.5 : 1,
            color: "var(--color-text)",
            fontSize: isMobile ? "1rem" : undefined,
            lineHeight: isMobile ? 1.3 : undefined,
          }}
        >
          {exp.position}
        </Typography>
        <Typography
          variant={isMobile ? "body2" : "subtitle1"}
          sx={{
            fontWeight: 600,
            mb: isMobile ? 1.25 : 2,
            color: "var(--color-text)",
            fontSize: isMobile ? "0.875rem" : undefined,
            opacity: 0.85,
          }}
        >
          {exp.company}
        </Typography>

        <Box sx={{ mb: isMobile ? 1.5 : 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: "var(--color-text)",
              opacity: 0.9,
              display: "inline",
              fontSize: isMobile ? "0.875rem" : undefined,
              lineHeight: isMobile ? 1.6 : undefined,
            }}
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(truncatedDescription),
            }}
          />
        </Box>

        {exp.achievements && exp.achievements.length > 0 && (
          <Box sx={{ mt: isMobile ? 1.5 : 2 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: "var(--color-text-light)",
                display: "block",
                mb: isMobile ? 0.75 : 1,
                fontSize: isMobile ? "0.75rem" : undefined,
              }}
            >
              Key Achievements:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: isMobile ? 1.5 : 2 }}>
              {(isExpanded || exp.achievements.length <= MAX_ACHIEVEMENTS_SHOWN
                ? exp.achievements
                : exp.achievements.slice(0, MAX_ACHIEVEMENTS_SHOWN)
              ).map((achievement, i) => (
                <Typography
                  key={i}
                  component="li"
                  variant="body2"
                  sx={{
                    mb: isMobile ? 0.75 : 0.5,
                    color: "var(--color-text)",
                    opacity: 0.9,
                    fontSize: isMobile ? "0.875rem" : undefined,
                    lineHeight: isMobile ? 1.5 : undefined,
                  }}
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
              mt: isMobile ? 1 : 0,
              ml: isMobile ? 0 : 1,
              color: "var(--color-accent)",
              fontWeight: 600,
              textTransform: "none",
              minWidth: "auto",
              padding: isMobile ? "6px 14px" : "2px 8px",
              fontSize: isMobile ? "0.875rem" : undefined,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
              "&:active": {
                backgroundColor: "rgba(0, 0, 0, 0.08)",
              },
            }}
          >
            {isExpanded ? "See less" : "See more"}
          </Button>
        )}
      </>
    );
  };

  return <GenericTimeline items={experiences} renderContent={renderContent} />;
}
