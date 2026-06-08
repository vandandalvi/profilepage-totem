"use client";

import { useState, useEffect } from "react";
import { Sparkles, TrendingUp, TrendingDown, Code, Search, PenLine, BookOpen, MoreHorizontal, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useAnimatedCounter } from "@/lib/useAnimatedCounter";
import { ChatGPTIcon, ClaudeIcon, GeminiIcon, GrokIcon, LlamaIcon } from "@/components/icons/AIIcons";

// Map model names to their corresponding icons
const getModelIcon = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes("gpt") || normalized.includes("chatgpt")) return ChatGPTIcon;
  if (normalized.includes("claude")) return ClaudeIcon;
  if (normalized.includes("gemini")) return GeminiIcon;
  if (normalized.includes("grok")) return GrokIcon;
  if (normalized.includes("llama")) return LlamaIcon;
  return Sparkles; // Fallback
};

const getModelColor = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes("gpt") || normalized.includes("chatgpt")) return "#FFFFFF";
  if (normalized.includes("claude")) return "#D97757";
  if (normalized.includes("gemini")) return "#8B5CF6";
  if (normalized.includes("grok")) return "#E5E5E5";
  if (normalized.includes("llama")) return "#0668E1";
  return "var(--color-brand-teal)"; // Fallback
};

const getCategoryIcon = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes("coding")) return Code;
  if (normalized.includes("research")) return Search;
  if (normalized.includes("writing")) return PenLine;
  if (normalized.includes("learning")) return BookOpen;
  return MoreHorizontal;
};

// ── Types ──
interface DashboardStats {
  dailyLimit: { used: number; total: number; percentage: number };
  promptEfficiency: {
    percentLessTyping: number;
    charsAvoided: number;
    wordsAvoided: number;
    timeSavedMinutes: number;
  };
  topCategory: {
    name: string;
    percentage: number;
    trend: number;
    tags: string[];
  };
  topModel: {
    name: string;
    promptCount: number;
    sharePercentage: number;
    trend: number;
  };
}

// ── Mobile Accordion Wrapper ──
function MobileAccordionCard({
  label,
  summary,
  children,
}: {
  label: string;
  summary: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="sm:contents">
      {/* Mobile collapsed header — only visible on mobile */}
      <div
        className="sm:hidden card-premium px-4 py-3 flex items-center justify-between cursor-pointer active:opacity-80"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex flex-col">
          <span className="text-[9px] font-bold tracking-[0.15em] text-text-tertiary uppercase">{label}</span>
          <span className="text-[14px] font-semibold text-text-primary mt-0.5">{summary}</span>
        </div>
        <ChevronDown
          size={16}
          className={`text-text-secondary transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="sm:hidden overflow-hidden"
          >
            {/* Re-broadcast 'show' variant so child cards animate correctly on open */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
              className="px-2 pb-2 pt-1"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Desktop — always fully visible */}
      <div className="hidden sm:block sm:h-full">{children}</div>
    </div>
  );
}

// ── Sub-components ──

function DailyLimitCard({ stats }: { stats: DashboardStats }) {
  const { value: animatedUsed, ref: usedRef } = useAnimatedCounter(stats.dailyLimit.used, 800);
  const percentage = stats.dailyLimit.percentage;
  const isNearLimit = percentage > 80;

  return (
    <motion.div
      variants={cardVariants}
      className="card-premium p-5 sm:p-6 flex flex-col items-center justify-center relative h-full"
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mb-4 overflow-visible">
        <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
          {/* Track */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="5" className="text-surface-elevated" />
          {/* Fill with gradient */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-gradient-teal-start)" />
              <stop offset="100%" stopColor="var(--color-gradient-teal-end)" />
            </linearGradient>
          </defs>
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="5"
            strokeDasharray="283"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 * (1 - percentage / 100) }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ strokeLinecap: "round" }}
            filter={isNearLimit ? "drop-shadow(0 0 6px rgba(0, 201, 177, 0.4))" : undefined}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span ref={usedRef} className="text-2xl sm:text-3xl font-bold text-text-primary leading-none tabular-nums">
            {animatedUsed}/{stats.dailyLimit.total}
          </span>
          <span className="text-[9px] font-bold text-text-tertiary tracking-[0.15em] mt-1.5">PROMPTS</span>
        </div>
      </div>
      <h3 className="text-[10px] font-bold tracking-[0.15em] text-text-tertiary uppercase mb-1">Daily Limit</h3>
      <p className="text-[13px] text-text-secondary tabular-nums">{percentage}% used today</p>
    </motion.div>
  );
}

function PromptEfficiencyCard({ stats }: { stats: DashboardStats }) {
  const { value: animatedPercent, ref: percentRef } = useAnimatedCounter(stats.promptEfficiency.percentLessTyping, 1200);
  const { value: animatedChars, ref: charsRef } = useAnimatedCounter(stats.promptEfficiency.charsAvoided, 1400);
  const { value: animatedWords, ref: wordsRef } = useAnimatedCounter(stats.promptEfficiency.wordsAvoided, 1400);
  const { value: animatedTime, ref: timeRef } = useAnimatedCounter(stats.promptEfficiency.timeSavedMinutes, 1400);

  return (
    <motion.div
      variants={cardVariants}
      className="card-premium p-5 sm:p-6 flex flex-col h-full"
    >
      <h3 className="text-[10px] font-bold tracking-[0.15em] text-text-tertiary uppercase mb-3">Prompt Efficiency</h3>
      <p className="text-3xl sm:text-4xl font-bold text-text-primary mb-1">
        <span ref={percentRef} className="tabular-nums">{animatedPercent}</span>
        <span className="text-brand-teal">%</span>
        <span className="text-lg sm:text-xl text-text-secondary font-normal ml-2">Less Typing</span>
      </p>

      {/* Before / After bars */}
      <div className="mt-4 space-y-2.5">
        <div>
          <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider">Before</span>
          <div className="h-2.5 w-full bg-surface-elevated rounded-full mt-1 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "var(--color-text-secondary)" }}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>
        <div>
          <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider">After</span>
          <div className="h-2.5 w-full bg-surface-elevated rounded-full mt-1 overflow-hidden">
            <motion.div
              className="h-full progress-gradient"
              initial={{ width: 0 }}
              animate={{ width: `${100 - stats.promptEfficiency.percentLessTyping}%` }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Sub metrics */}
      <div className="grid grid-cols-3 gap-2 mt-auto pt-4">
        <div>
          <p ref={charsRef} className="text-sm font-semibold text-text-primary tabular-nums">{animatedChars.toLocaleString()}</p>
          <p className="text-[10px] text-text-tertiary mt-0.5">Chars saved</p>
        </div>
        <div>
          <p ref={wordsRef} className="text-sm font-semibold text-text-primary tabular-nums">{animatedWords.toLocaleString()}</p>
          <p className="text-[10px] text-text-tertiary mt-0.5">Words saved</p>
        </div>
        <div>
          <p ref={timeRef} className="text-sm font-semibold text-text-primary tabular-nums">{animatedTime}m</p>
          <p className="text-[10px] text-text-tertiary mt-0.5">Time saved</p>
        </div>
      </div>
    </motion.div>
  );
}

function TopCategoryCard({ stats }: { stats: DashboardStats }) {
  const { value: animatedPercent, ref: percentRef } = useAnimatedCounter(stats.topCategory.percentage, 1000);
  const trendUp = stats.topCategory.trend >= 0;
  const CategoryIcon = getCategoryIcon(stats.topCategory.name);

  return (
    <motion.div
      variants={cardVariants}
      className="card-premium p-5 sm:p-6 flex flex-col relative h-full"
    >
        <div className="absolute top-5 right-5 sm:top-6 sm:right-6 text-brand-teal opacity-60">
          <CategoryIcon size={32} strokeWidth={1.5} />
        </div>

      <h3 className="text-[10px] font-bold tracking-[0.15em] text-text-tertiary uppercase mb-2">Top Category</h3>
      <div className="flex items-baseline gap-3 mb-1 mt-1">
        <p className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight">
          {stats.topCategory.name}
        </p>
        <span ref={percentRef} className="text-xl font-bold text-brand-teal tabular-nums">{animatedPercent}%</span>
      </div>

      {/* Trend chip */}
      <div>
        <span className={`trend-chip ${trendUp ? "trend-chip-up" : "trend-chip-down"}`}>
          {trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {trendUp ? "+" : ""}{stats.topCategory.trend}% vs last month
        </span>
      </div>

      {/* Mini Progress Bar */}
      <div className="mt-4 mb-2">
        <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden">
          <motion.div
            className="h-full progress-gradient"
            initial={{ width: 0 }}
            animate={{ width: `${stats.topCategory.percentage}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
      </div>

      {/* Sub-items / Tags list to fill the vertical space */}
      <div className="space-y-1.5 mt-auto pt-2">
        <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-wider">Top Sub-topics</p>
        <div className="flex flex-wrap gap-1.5">
          {stats.topCategory.tags.map((tag, i) => (
            <div key={i} className="text-[11px] bg-surface-elevated/40 px-3 py-1.5 rounded-md text-text-secondary font-medium">
              {tag}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function MostUsedAICard({ stats }: { stats: DashboardStats }) {
  const { value: animatedCount, ref: countRef } = useAnimatedCounter(stats.topModel.promptCount, 1000);
  const { value: animatedShare, ref: shareRef } = useAnimatedCounter(stats.topModel.sharePercentage, 1200);
  const trendUp = stats.topModel.trend >= 0;

  const modelColor = getModelColor(stats.topModel.name);
  const ModelIcon = getModelIcon(stats.topModel.name);

  return (
    <motion.div
      variants={cardVariants}
      className="card-premium p-5 sm:p-6 flex flex-col relative h-full"
    >
      <h3 className="text-[10px] font-bold tracking-[0.15em] text-text-tertiary uppercase mb-2">Most Used AI</h3>
      <div className="flex items-center gap-3 mb-1 mt-1">
        <ModelIcon size={32} />
        <p className="text-2xl sm:text-3xl font-bold text-text-primary">{stats.topModel.name}</p>
      </div>

      <div className="flex items-center gap-3 text-[13px] text-text-secondary mb-auto">
        <span ref={countRef} className="tabular-nums">{animatedCount} prompts</span>
        <span className="text-text-tertiary">·</span>
        <span ref={shareRef} className="tabular-nums">{animatedShare}% share</span>
      </div>

      {/* Trend */}
      <div className="mt-4 sm:mt-5">
        <span className={`trend-chip ${trendUp ? "trend-chip-up" : "trend-chip-down"}`}>
          {trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {trendUp ? "+" : ""}{stats.topModel.trend}% this month
        </span>
      </div>
    </motion.div>
  );
}

// ── Animation Variants ──
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

import { useDashboardData } from "@/lib/DashboardContext";

// ── Main Component ──
export function StatCards() {
  const { data } = useDashboardData();
  
  if (!data) return null;

  const { usage, prompt_efficiency: eff, most_used_domain: dom, most_used_llm: llm, llms } = data;

  // Fallback logic for Most Used AI if the API returns "unknown"
  let topModelName = llm.llm;
  let topModelCount = llm.prompt_count;
  let topModelPercentage = llm.percentage;

  if ((!topModelName || topModelName.toLowerCase() === "unknown") && llms && llms.length > 0) {
    const validLlms = llms
      .filter(l => l.llm && l.llm.toLowerCase() !== "unknown")
      .sort((a, b) => b.prompt_count - a.prompt_count);
    
    if (validLlms.length > 0) {
      topModelName = validLlms[0].llm;
      topModelCount = validLlms[0].prompt_count;
      topModelPercentage = validLlms[0].percentage;
    } else {
      topModelName = "ChatGPT";
      topModelCount = usage.total_prompts;
      topModelPercentage = 100;
    }
  } else if (!topModelName || topModelName.toLowerCase() === "unknown") {
    topModelName = "ChatGPT";
    topModelCount = usage.total_prompts;
    topModelPercentage = 100;
  }

  const stats: DashboardStats = {
    dailyLimit: {
      used: usage.used_today,
      total: usage.daily_limit,
      percentage: usage.daily_limit > 0 ? Math.round((usage.used_today / usage.daily_limit) * 100) : 0,
    },
    promptEfficiency: {
      percentLessTyping: eff.less_typing_percentage,
      charsAvoided: eff.chars_saved,
      wordsAvoided: eff.words_saved,
      timeSavedMinutes: eff.time_saved_minutes,
    },
    topCategory: {
      name: dom.domain,
      percentage: dom.percentage,
      trend: 12, // Dummy trend
      tags: ["User Flows", "Research", "Debugging"], // Dummy tags
    },
    topModel: {
      name: topModelName,
      promptCount: topModelCount,
      sharePercentage: topModelPercentage,
      trend: 18, // Dummy trend
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-4 px-4 sm:px-6 lg:px-8 mb-3 sm:mb-4 sm:items-stretch"
    >
      <MobileAccordionCard
        label="Daily Limit"
        summary={`${stats.dailyLimit.used}/${stats.dailyLimit.total} prompts · ${stats.dailyLimit.percentage}% used`}
      >
        <DailyLimitCard stats={stats} />
      </MobileAccordionCard>

      <MobileAccordionCard
        label="Prompt Efficiency"
        summary={`${stats.promptEfficiency.percentLessTyping}% less typing · ${stats.promptEfficiency.timeSavedMinutes}m saved`}
      >
        <PromptEfficiencyCard stats={stats} />
      </MobileAccordionCard>

      <MobileAccordionCard
        label="Top Category"
        summary={`${stats.topCategory.name} · ${stats.topCategory.percentage}%`}
      >
        <TopCategoryCard stats={stats} />
      </MobileAccordionCard>

      <MobileAccordionCard
        label="Most Used AI"
        summary={`${stats.topModel.name} · ${stats.topModel.promptCount} prompts`}
      >
        <MostUsedAICard stats={stats} />
      </MobileAccordionCard>
    </motion.div>
  );
}
