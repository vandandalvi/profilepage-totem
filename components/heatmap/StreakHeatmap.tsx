"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// TODO: Replace with your actual types
interface StreakData {
  currentStreak: number;
  longestStreak: number;
  months: string[];
}

const DUMMY_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 7,
  months: ["Feb", "Mar", "Apr", "May"]
};

export function StreakHeatmap() {
  const [data, setData] = useState<StreakData | null>(DUMMY_STREAK);

  useEffect(() => {
    // TODO: Replace with your actual API endpoint
    const fetchStreakData = async () => {
      try {
        // const response = await fetch('/api/v1/heatmap/streaks');
        // const apiData = await response.json();
        // setData(apiData);
      } catch (error) {
        console.error("Failed to fetch streak data:", error);
      }
    };

    // fetchStreakData(); // Uncomment to fetch from API
  }, []);

  // Generate mock data for the heatmap (18 columns, 7 rows)
  const columns = 18;
  const rows = 7;

  const intensityColors = [
    "var(--color-heat-0)", // 0
    "var(--color-heat-1)", // 1
    "var(--color-heat-2)", // 2
    "var(--color-heat-3)", // 3
    "var(--color-heat-4)", // 4
  ];

  // Dummy prompts count corresponding to color intensity
  const getPromptsText = (intensity: number) => {
    switch (intensity) {
      case 0:
        return "0 prompts";
      case 1:
        return "2 prompts";
      case 2:
        return "4 prompts";
      case 3:
        return "7 prompts";
      case 4:
        return "12 prompts";
      default:
        return "0 prompts";
    }
  };

  // Specific heatmap pattern mimicking the screenshot
  const getCellIntensity = (col: number, row: number) => {
    // Keep other months (Feb, Mar, Apr) blank (intensity 0)
    // May represents the rightmost section of the grid (columns 13 to 17)
    if (col < 13) return 0;

    if (col >= 13 && col < 17) {
      const val = (col * 13 + row * 7) % 5;
      if (col === 13 && row === 3) return 4;
      return val;
    }
    return 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-surface-card border border-border-subtle rounded-2xl p-5 sm:p-7 shadow-card flex flex-col h-full relative"
    >
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-2 mb-5 sm:mb-6">
        <h2 className="text-[18px] sm:text-[22px] font-bold text-text-primary leading-none">
          {data?.currentStreak || 0} day streak <span className="text-sm font-normal text-text-secondary ml-1">in May</span>
        </h2>
        <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-text-secondary uppercase">
          LONGEST STREAK | {data?.longestStreak || 0} DAYS
        </span>
      </div>

      {/* Month nav */}
      <div className="flex items-center gap-4 text-[11px] font-medium text-text-secondary mb-2 px-1">
        <ChevronLeft size={16} className="cursor-pointer hover:text-text-primary shrink-0" />
        <div className="flex-1 flex justify-between items-center">
          {(data?.months || ["Feb", "Mar", "Apr", "May"]).map((month) => {
            const isMay = month === "May";
            return (
              <span
                key={month}
                className={cn(
                  "transition-all duration-150 px-2 py-0.5 rounded-md cursor-pointer",
                  isMay
                    ? "text-brand-teal font-bold bg-brand-teal-dark/30 border border-brand-teal/20"
                    : "hover:text-text-primary text-text-secondary"
                )}
              >
                {month}
              </span>
            );
          })}
        </div>
        <ChevronRight size={16} className="cursor-pointer hover:text-text-primary shrink-0" />
      </div>

      {/* Heatmap grid — scrollable on small screens */}
      {/* pt-6 -mt-6 allows the hover tooltips to render outside the normal grid bounds without container clipping */}
      <div className="flex gap-2 overflow-x-auto pt-6 -mt-6 pb-1 scrollbar-hide">
        {/* Days Column */}
        <div className="flex flex-col gap-[5px] text-[10px] text-text-secondary pr-1 justify-between py-0.5 mt-6 shrink-0">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Grid */}
        <div className="flex gap-[5px] mt-6">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-[5px]">
              {Array.from({ length: rows }).map((_, rowIndex) => {
                const intensity = getCellIntensity(colIndex, rowIndex);
                return (
                  <div key={rowIndex} className="relative group">
                    <motion.div
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm transition-transform cursor-pointer hover:scale-110"
                      style={{ backgroundColor: intensityColors[intensity] }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + (colIndex + rowIndex) * 0.008 }}
                    />
                    {/* Tooltip bubble */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-surface-sidebar text-text-primary text-[10px] font-semibold px-2 py-0.5 rounded border border-border-subtle opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 shadow-card">
                      {getPromptsText(intensity)}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-4 sm:mt-6 text-[11px] text-text-secondary">
        <span className="mr-1">More</span>
        <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm" style={{ backgroundColor: "var(--color-heat-4)" }} />
        <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm" style={{ backgroundColor: "var(--color-heat-3)" }} />
        <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm" style={{ backgroundColor: "var(--color-heat-2)" }} />
        <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm" style={{ backgroundColor: "var(--color-heat-1)" }} />
        <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm" style={{ backgroundColor: "var(--color-heat-0)" }} />
        <span className="ml-1">Less</span>
      </div>
    </motion.div>
  );
}

