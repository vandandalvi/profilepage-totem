"use client";

import { useState, useEffect } from "react";
import { Code, Search, PenLine, BookOpen, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useAnimatedCounter } from "@/lib/useAnimatedCounter";

interface CategoryItem {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  percentage: number;
  label: string;
  value: number;
  color: string;
}

const DUMMY_CATEGORIES: CategoryItem[] = [
  { icon: Code, percentage: 58, label: "CODING", value: 652, color: "var(--color-heat-4)" },
  { icon: Search, percentage: 23, label: "RESEARCH", value: 357, color: "var(--color-heat-3)" },
  { icon: PenLine, percentage: 11, label: "WRITING", value: 186, color: "var(--color-heat-2)" },
  { icon: BookOpen, percentage: 6, label: "LEARNING", value: 109, color: "var(--color-heat-1)" },
  { icon: MoreHorizontal, percentage: 2, label: "OTHER", value: 14, color: "var(--color-border-subtle)" },
];

function AnimatedValue({ target, suffix }: { target: number; suffix?: string }) {
  const { value, ref } = useAnimatedCounter(target, 1200);
  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString()}{suffix}
    </span>
  );
}

export function TopCategoriesCard() {
  const [categories, setCategories] = useState<CategoryItem[]>(DUMMY_CATEGORIES);
  const totalPrompts = categories.reduce((sum, c) => sum + c.value, 0);

  useEffect(() => {
    // TODO: Replace with your actual API endpoint
    const fetchCategories = async () => {
      try {
        // const response = await fetch('/api/v1/analytics/categories');
        // const data = await response.json();
        // setCategories(data);
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      }
    };

    // fetchCategories(); // Uncomment to fetch from API
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="card-premium p-5 sm:p-7 flex flex-col h-full"
    >
      <div className="flex flex-wrap justify-between items-end gap-2 mb-6 sm:mb-8">
        <h2 className="text-[18px] sm:text-[22px] font-bold text-text-primary leading-none">Top Categories</h2>
        <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.1em] text-text-tertiary uppercase tabular-nums">
          TOTAL PROMPTS | <AnimatedValue target={totalPrompts} />
        </span>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5 flex-1 justify-center">
        {categories.map((item, i) => (
          <div key={i} className="flex flex-col gap-1.5 group">
            {/* Top row: Label, Icon, and Values */}
            <div className="flex items-center justify-between text-[12px] sm:text-[13px]">
              <div className="flex items-center gap-2 text-text-secondary group-hover:text-text-primary transition-colors">
                <item.icon size={15} strokeWidth={2} className="text-text-tertiary group-hover:text-text-secondary transition-colors" />
                <span className="font-semibold tracking-wider text-[11px] sm:text-[12px] uppercase">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-text-primary tabular-nums">
                  <AnimatedValue target={item.value} /> <span className="text-[10px] text-text-tertiary font-normal lowercase">prompts</span>
                </span>
                <span className="text-[11px] text-text-tertiary font-medium tabular-nums">({item.percentage}%)</span>
              </div>
            </div>

            {/* Bottom row: Slim Progress Bar */}
            <div className="h-2 w-full bg-surface-elevated rounded-full overflow-hidden relative">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 1, delay: 0.1 + i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  background: i === 0
                    ? `linear-gradient(90deg, var(--color-gradient-teal-start), var(--color-gradient-teal-end))`
                    : item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
