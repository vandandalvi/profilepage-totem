"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimatedCounter } from "@/lib/useAnimatedCounter";
import { ChatGPTIcon, ClaudeIcon, GeminiIcon, GrokIcon, LlamaIcon } from "@/components/icons/AIIcons";

// ── Types ──
interface ModelUsage {
  model: string;
  color: string;
  icon: React.ComponentType<{ className?: string; size?: number; style?: React.CSSProperties }>;
  count: number;
}

interface DayData {
  date: Date;
  models: ModelUsage[];
  total: number;
  dominantModel: ModelUsage | null;
}

interface ActivityData {
  currentStreak: number;
  longestStreak: number;
  totalThisMonth: number;
  days: DayData[];
}

// ── Model definitions ──
const MODEL_DEFS = [
  { model: "ChatGPT", color: "#FFFFFF", icon: ChatGPTIcon },
  { model: "Claude", color: "#D97757", icon: ClaudeIcon },
  { model: "Gemini", color: "#8B5CF6", icon: GeminiIcon },
  { model: "Grok", color: "#E5E5E5", icon: GrokIcon },
  { model: "Llama", color: "#0668E1", icon: LlamaIcon },
];

// ── Generate dummy 30-day data ──
function generateDummyData(): ActivityData {
  const today = new Date();
  const days: DayData[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Create varied activity patterns
    const seed = date.getDate() * 7 + date.getMonth() * 13;
    const activityLevel = (seed % 5);

    const models: ModelUsage[] = [];
    if (activityLevel > 0) {
      // Decide how many different models were used today (1 to 3)
      const numModels = 1 + (seed % 3);
      
      // Weighted pool: 1st ChatGPT (0), 2nd Claude (1), 3rd Gemini (2), 4th Grok (3), then Llama (4)
      const modelPool = [0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 4];
      
      for (let j = 0; j < numModels; j++) {
        // Pick a model based on seed and loop index (use 7 to avoid mod 11 collision)
        const poolIdx = (seed + j * 7) % modelPool.length;
        const modelIdx = modelPool[poolIdx];
        
        // Generate a pseudo-random count for this model
        const count = 2 + ((seed * (j + 2)) % 25);
        
        // Only add if not already in the array
        if (!models.find(m => m.model === MODEL_DEFS[modelIdx].model)) {
          models.push({ ...MODEL_DEFS[modelIdx], count });
        }
      }
      
      // Sort models by count descending so the tooltip looks nice
      models.sort((a, b) => b.count - a.count);
    }

    const total = models.reduce((s, m) => s + m.count, 0);
    // Find the model with the highest count (first element since we sorted)
    const dominantModel = models.length > 0 ? models[0] : null;

    days.push({
      date,
      models,
      total,
      dominantModel
    });
  }

  return {
    currentStreak: 5,
    longestStreak: 12,
    totalThisMonth: days.reduce((s, d) => s + d.total, 0),
    days,
  };
}

// ── Day cell sub-component ──
function DayCell({ day, index }: { day: DayData; index: number }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isEmpty = day.models.length === 0;

  const dominant = day.dominantModel;
  const DominantIcon = dominant?.icon;

  // Calculate glow opacity based on total volume. Cap at 1.0 (e.g., max glow at 30+ prompts)
  const glowOpacity = isEmpty ? 0 : Math.min(day.total / 30, 1) * 0.45 + 0.1; // Range: 0.1 to 0.55

  return (
    <div className="relative group">
      <motion.div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
          isEmpty
            ? "border border-dashed bg-transparent"
            : "bg-surface-elevated border hover:-translate-y-0.5"
        }`}
        style={{
          borderColor: dominant && showTooltip ? dominant.color : "var(--color-brand-teal)",
          boxShadow: dominant && showTooltip ? `0 4px 12px ${dominant.color}25` : undefined
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.02 * index, duration: 0.3 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Soft branded glow inside the cell */}
        {dominant && (
          <div 
            className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(120% 120% at 50% 50%, ${dominant.color} 0%, transparent 80%)`,
              opacity: showTooltip ? Math.min(glowOpacity + 0.2, 0.8) : glowOpacity
            }}
          />
        )}

        {/* Dominant Model Icon */}
        {dominant && DominantIcon && (
          <div 
            className="relative z-10 transition-transform duration-300"
            style={{
              color: dominant.color,
              filter: `drop-shadow(0 0 6px ${dominant.color}60)`,
              transform: showTooltip ? "scale(1.1)" : "scale(1)"
            }}
          >
            <DominantIcon size={20} />
          </div>
        )}
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-surface-card border border-border-subtle rounded-xl shadow-card-hover p-4 z-50 pointer-events-none min-w-[200px]"
          >
            <p className="text-[13px] font-medium text-text-secondary mb-3">
              {day.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
            {isEmpty ? (
              <p className="text-[13px] text-text-tertiary">No activity</p>
            ) : (
              <>
                <div className="space-y-3">
                  {day.models.slice(0, 4).map((m, i) => {
                    const Icon = m.icon;
                    return (
                      <div key={i} className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-2.5">
                          <Icon size={14} style={{ color: m.color }} />
                          <span className="text-[13px] font-medium text-text-primary">{m.model}</span>
                        </div>
                        <span className="text-[13px] text-text-secondary tabular-nums whitespace-nowrap">{m.count} prompts</span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-border-subtle mt-4 pt-3 flex items-center justify-between">
                  <span className="text-[13px] font-medium text-text-secondary">Total:</span>
                  <span className="text-[13px] font-semibold text-text-primary tabular-nums">{day.total} prompts</span>
                </div>
              </>
            )}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-surface-card border-r border-b border-border-subtle transform rotate-45 -mt-1.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Component ──
export function ActivityCalendar() {
  const [data, setData] = useState<ActivityData | null>(null);

  useEffect(() => {
    // Generate dummy data on mount (client-side only)
    setData(generateDummyData());
  }, []);

  const { value: streakValue, ref: streakRef } = useAnimatedCounter(data?.currentStreak ?? 0, 800);
  const { value: totalValue, ref: totalRef } = useAnimatedCounter(data?.totalThisMonth ?? 0, 1200);

  // Organize days into a calendar grid (7 cols = Sun-Sat)
  const calendarGrid = useMemo(() => {
    if (!data) return [];
    const grid: (DayData | null)[][] = [];
    let currentRow: (DayData | null)[] = [];

    // Pad the first row
    const firstDayOfWeek = data.days[0]?.date.getDay() ?? 0;
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentRow.push(null);
    }

    for (const day of data.days) {
      currentRow.push(day);
      if (currentRow.length === 7) {
        grid.push(currentRow);
        currentRow = [];
      }
    }

    // Pad the last row
    if (currentRow.length > 0) {
      while (currentRow.length < 7) currentRow.push(null);
      grid.push(currentRow);
    }

    return grid;
  }, [data]);

  const monthLabel = data?.days[data.days.length - 1]?.date.toLocaleDateString("en-US", { month: "long", year: "numeric" }) ?? "";

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="card-premium p-5 sm:p-7 flex flex-col h-full"
    >
      {/* Header stats */}
      <div className="flex flex-wrap justify-between items-end gap-2 mb-5 sm:mb-6">
        <div>
          <h2 className="text-[18px] sm:text-[22px] font-bold text-text-primary leading-none">
            <span ref={streakRef} className="tabular-nums">{streakValue}</span> day streak
          </h2>
          <p className="text-[11px] text-text-tertiary mt-1 uppercase tracking-wider font-medium">
            Longest: {data.longestStreak} days
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-bold tracking-[0.1em] text-text-tertiary uppercase">
            THIS MONTH
          </p>
          <span ref={totalRef} className="text-lg font-bold text-brand-teal tabular-nums block">{totalValue} <span className="text-[12px] font-normal text-text-secondary">prompts</span></span>
        </div>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between text-[12px] font-medium text-text-secondary mb-4 px-1">
        <ChevronLeft size={16} className="cursor-pointer hover:text-text-primary transition-colors shrink-0" />
        <span className="text-text-primary font-semibold">{monthLabel}</span>
        <ChevronRight size={16} className="cursor-pointer hover:text-text-primary transition-colors shrink-0" />
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-1.5 px-0.5">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-[10px] text-text-tertiary font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex flex-col gap-1.5 sm:gap-2 flex-1">
        {calendarGrid.map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {row.map((day, colIdx) => (
              <div key={colIdx} className="flex items-center justify-center">
                {day ? (
                  <DayCell day={day} index={rowIdx * 7 + colIdx} />
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-6 text-[11px] font-medium text-text-secondary flex-wrap justify-center bg-surface-elevated/40 rounded-full py-2.5 px-4 border border-border-subtle">
        {MODEL_DEFS.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.model} className="flex items-center gap-1.5">
              <Icon size={12} style={{ color: m.color }} />
              <span>{m.model}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
