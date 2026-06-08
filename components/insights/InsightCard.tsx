"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardData } from "@/lib/DashboardContext";

export function InsightCard() {
  const { data } = useDashboardData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const llmName = data?.most_used_llm?.llm && data.most_used_llm.llm !== "Unknown" 
    ? data.most_used_llm.llm 
    : "Claude";

  const INSIGHTS = [
    `You use ${llmName} for coding 82% more than others.`,
    "Research prompts save you the most time — 3.2 hrs this month.",
    "Your prompt efficiency improved 23% this week.",
    "Coding prompts are 3× more detailed than your research prompts.",
    "You're most productive between 10 AM – 1 PM.",
  ];

  // Rotate insights every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % INSIGHTS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Mouse-follow spotlight effect (ReactBits pattern)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="px-4 sm:px-6 lg:px-8 mb-2 sm:mb-4"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="card-premium card-spotlight p-5 sm:p-6 flex items-start gap-4 relative overflow-hidden"
        style={{
          borderColor: "rgba(0, 201, 177, 0.12)",
        }}
      >
        {/* Subtle green accent gradient in corner */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-teal/[0.04] rounded-full blur-3xl pointer-events-none" />

        {/* Icon */}
        <div className="shrink-0 w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center border border-brand-teal/10 relative z-10">
          <Sparkles size={18} className="text-brand-teal" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 relative z-10">
          <h3 className="text-[10px] font-bold tracking-[0.15em] text-brand-teal/70 uppercase mb-2">AI Insight</h3>
          {/* Fixed min-height prevents card from resizing when insight text changes length */}
          <div className="min-h-[3rem] sm:min-h-[2.5rem] relative">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="text-[14px] sm:text-[15px] text-text-primary leading-relaxed font-medium absolute inset-0"
              >
                {INSIGHTS[currentIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Dots indicator */}
          <div className="flex items-center gap-1.5 mt-3">
            {INSIGHTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "bg-brand-teal w-4"
                    : "bg-text-tertiary/40 hover:bg-text-tertiary"
                }`}
                aria-label={`Show insight ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
