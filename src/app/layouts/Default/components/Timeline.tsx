"use client";

import { ReactNode } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { Box, Chip, useMediaQuery, useTheme } from "@mui/material";

export interface TimelineItemData {
  startDate: string;
  endDate: string | "Present";
}

export interface TimelineProps<T extends TimelineItemData> {
  items: T[];
  renderContent: (item: T, index: number) => ReactNode;
  renderIcon?: (item: T, index: number) => ReactNode;
  getDateLabel?: (item: T) => string;
}

const colors = ["primary", "secondary", "success", "warning", "info"] as const;

export default function GenericTimeline<T extends TimelineItemData>({
  items,
  renderContent,
  renderIcon,
  getDateLabel,
}: TimelineProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const defaultDateLabel = (item: T) => `${item.startDate} - ${item.endDate}`;
  const dateLabel = getDateLabel || defaultDateLabel;

  const defaultIcon = (
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
  );

  return (
    <Timeline
      position={isMobile ? "left" : "alternate"}
      sx={
        isMobile
          ? {
              paddingLeft: 0,
              paddingRight: 0,
              "& .MuiTimelineItem-root": {
                paddingLeft: 0,
                minHeight: "auto",
              },
              "& .MuiTimelineSeparator-root": {
                paddingLeft: "0.5rem",
                paddingRight: "1.5rem",
              },
              "& .MuiTimelineContent-root": {
                paddingLeft: "1.5rem",
                paddingRight: 0,
                flex: "1 1 auto",
              },
            }
          : undefined
      }
    >
      {items.map((item, index) => {
        const color = colors[index % colors.length];
        const isLast = index === items.length - 1;
        const icon = renderIcon ? renderIcon(item, index) : defaultIcon;

        return (
          <TimelineItem key={index}>
            {!isMobile && (
              <TimelineOppositeContent
                sx={{ m: "auto 0" }}
                align={index % 2 === 0 ? "right" : "left"}
                variant="body2"
                color="text.secondary"
              >
                <Chip
                  label={dateLabel(item)}
                  size="medium"
                  sx={{
                    backgroundColor: "var(--color-accent)",
                    color: "var(--color-text)",
                    fontWeight: 600,
                  }}
                />
              </TimelineOppositeContent>
            )}
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot
                color={color}
                sx={
                  isMobile
                    ? {
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        "& svg": {
                          width: 16,
                          height: 16,
                          margin: 0,
                        },
                      }
                    : {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        "& svg": {
                          margin: 0,
                        },
                      }
                }
              >
                {icon}
              </TimelineDot>
              {!isLast && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent
              sx={{
                py: isMobile ? "8px" : "12px",
                px: isMobile ? 1 : 2,
              }}
            >
              <Box
                sx={{
                  p: isMobile ? 1.25 : 2,
                  borderRadius: isMobile ? 1.5 : 2,
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--card-shadow)",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                {isMobile && (
                  <Box sx={{ mb: 1.5 }}>
                    <Chip
                      label={dateLabel(item)}
                      size="small"
                      sx={{
                        backgroundColor: "var(--color-accent)",
                        color: "var(--color-text)",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        height: "22px",
                      }}
                    />
                  </Box>
                )}
                {renderContent(item, index)}
              </Box>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
