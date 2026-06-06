"use client";

import { useState, useEffect } from "react";
import { Bot, Infinity, MessageSquareText, MessageCircle, FileText, Mail } from "lucide-react";
import { motion } from "framer-motion";

// TODO: Replace with your actual types
interface UsageItem {
  icon: any;
  percentage: number;
  label: string;
  value: number;
}

const DUMMY_USAGE_DATA: UsageItem[] = [
  { icon: Bot, percentage: 58, label: "AI PROMPTS", value: 652 },
  { icon: Infinity, percentage: 23, label: "OTHER TASKS", value: 357 },
  { icon: MessageSquareText, percentage: 11, label: "WORK MESSAGES", value: 186 },
  { icon: MessageCircle, percentage: 6, label: "PERSONAL MESSAGES", value: 109 },
  { icon: FileText, percentage: 1, label: "DOCUMENTS", value: 8 },
  { icon: Mail, percentage: 0, label: "EMAILS", value: 6 },
];

export function DesktopUsageCard() {
  const [usageData, setUsageData] = useState<UsageItem[]>(DUMMY_USAGE_DATA);

  useEffect(() => {
    // TODO: Replace with your actual API endpoint
    const fetchUsageData = async () => {
      try {
        // const response = await fetch('/api/v1/analytics/desktop-usage');
        // const data = await response.json();
        // setUsageData(data);
      } catch (error) {
        console.error("Failed to fetch usage data:", error);
      }
    };

    // fetchUsageData(); // Uncomment to fetch from API
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-surface-card border border-border-subtle rounded-2xl p-5 sm:p-7 shadow-card flex flex-col h-full"
    >
      <div className="flex flex-wrap justify-between items-end gap-2 mb-6 sm:mb-8">
        <h2 className="text-[18px] sm:text-[22px] font-bold text-text-primary leading-none">Desktop usage</h2>
        <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-text-secondary uppercase">
          TOTAL APPS USED | 34
        </span>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5 flex-1">
        {usageData.map((item, i) => (
          <div key={i} className="flex items-center gap-3 sm:gap-4 group">
            {/* Icon */}
            <div className="w-5 flex justify-center text-text-secondary group-hover:text-text-primary transition-colors shrink-0">
              <item.icon size={18} strokeWidth={2} />
            </div>

            {/* Bar — fills available space between icon and label */}
            <div className="flex-1 min-w-0 relative">
              <div className="h-6 w-full bg-surface-base border border-border-subtle rounded-sm overflow-hidden flex relative">
                <motion.div
                  className="h-full flex items-center px-2 shrink-0"
                  initial={{ width: 0 }}
                  animate={{ width: item.percentage === 0 ? "0%" : `${item.percentage}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                  style={{
                    backgroundColor:
                      i === 0 ? "var(--color-heat-3)"
                      : i === 1 ? "var(--color-heat-2)"
                      : i === 2 ? "var(--color-heat-1)"
                      : i === 3 ? "var(--color-heat-0)"
                      : "var(--color-border-subtle)",
                  }}
                >
                  {item.percentage > 0 && (
                    <span className="text-[11px] font-medium text-white ml-1 whitespace-nowrap">{item.percentage}%</span>
                  )}
                </motion.div>
                {item.percentage === 0 && (
                  <span className="text-[11px] font-medium text-text-secondary absolute left-2 top-1/2 -translate-y-1/2">0%</span>
                )}
              </div>
            </div>

            {/* Label */}
            <div className="flex gap-1.5 items-baseline shrink-0">
              <span className="text-[12px] sm:text-[13px] font-bold text-text-primary">{item.value}</span>
              <span className="hidden sm:inline text-[11px] font-bold text-text-secondary uppercase">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
