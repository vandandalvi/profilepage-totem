"use client";

import { useState, useEffect } from "react";
import { Zap, Check, Copy } from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";

// TODO: Replace with your actual types
interface ReferralData {
  title: string;
  description: string;
  rewardPerReferral: number;
  referralUrl: string;
  earnedPrompts: number;
  progressPercentage: number;
}

const DUMMY_REFERRAL: ReferralData = {
  title: "Invite friends, earn free prompts",
  description: "Share your link. Every friend who signs up adds 5 free prompts to your account.",
  rewardPerReferral: 5,
  referralUrl: "https://thinkvelocity./ref/vandan-.....",
  earnedPrompts: 10,
  progressPercentage: 30
};

export function ReferralSection() {
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState<ReferralData | null>(DUMMY_REFERRAL);

  useEffect(() => {
    // TODO: Replace with your actual API endpoint
    const fetchReferralData = async () => {
      try {
        // const response = await fetch('/api/v1/referrals/summary');
        // const apiData = await response.json();
        // setData(apiData);
      } catch (error) {
        console.error("Failed to fetch referral data:", error);
      }
    };

    // fetchReferralData(); // Uncomment to fetch from API
  }, []);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 mb-4"
    >
      {/* Referral Card */}
      <motion.div
        variants={itemVariants}
        className="card-premium p-5 sm:p-6 flex flex-col justify-between"
      >
        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5 sm:mb-6">
          <div className="min-w-0">
            <h2 className="text-[15px] sm:text-[17px] font-semibold text-text-primary mb-1.5">
              {data?.title || "Invite friends, earn free prompts"}
            </h2>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              {data?.description || "Share your link. Every friend who signs up adds 5 free prompts to your account."}
            </p>
          </div>
          <span className="self-start shrink-0 px-3 py-1.5 bg-brand-teal-dark/40 text-brand-teal text-[11px] font-medium rounded-full border border-brand-teal/10 whitespace-nowrap">
            +{data?.rewardPerReferral || 5} prompts per referral
          </span>
        </div>

        <div>
          {/* Referral URL input + animated copy button */}
          <div className="relative flex items-center mb-4">
            <input
              type="text"
              readOnly
              value={data?.referralUrl || ""}
              className="w-full bg-surface-input border border-border-input rounded-full py-2.5 pl-4 pr-28 text-[13px] text-brand-teal focus:outline-none focus:border-brand-teal/40 transition-colors truncate"
            />
            <button
              onClick={handleCopy}
              className="absolute right-1 top-1 bottom-1 px-4 bg-surface-card hover:bg-surface-card-hover rounded-full text-[13px] font-medium text-text-primary transition-all duration-200 flex items-center justify-center gap-2 border border-border-subtle whitespace-nowrap active:scale-[0.97]"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="copied"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1.5 text-brand-teal"
                  >
                    <Check size={14} />
                    Copied!
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1.5"
                  >
                    <Copy size={13} />
                    Copy link
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Gradient progress bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-1.5 bg-surface-elevated rounded-full overflow-hidden">
              <motion.div
                className="h-full progress-gradient"
                initial={{ width: 0 }}
                animate={{ width: `${data?.progressPercentage || 0}%` }}
                transition={{ duration: 1.2, delay: 0.5 }}
              />
            </div>
            <span className="text-[11px] text-text-secondary font-medium whitespace-nowrap shrink-0 tabular-nums">
              +{data?.earnedPrompts || 0} prompts earned
            </span>
          </div>
        </div>
      </motion.div>

      {/* Upgrade Card */}
      <motion.div
        variants={itemVariants}
        className="card-premium p-5 sm:p-6 flex flex-col justify-center relative overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-yellow/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="flex gap-4">
          <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 bg-brand-yellow/10 rounded-xl flex items-center justify-center border border-brand-yellow/15 relative z-10 shadow-glow-yellow">
            <Zap className="text-brand-yellow fill-brand-yellow/20" size={22} />
          </div>
          <div className="flex flex-col z-10 min-w-0">
            <h2 className="text-[15px] sm:text-[16px] font-semibold text-text-primary mb-2">Running low on prompts</h2>
            <p className="text-[13px] text-text-secondary leading-relaxed mb-4">
              Power users go Pro to avoid waiting and access priority AI compute.
            </p>
            <a
              href="#"
              className="shimmer-text text-[14px] font-semibold text-brand-yellow transition-colors inline-flex items-center gap-1.5 w-fit group"
            >
              Upgrade to Pro
              <span className="transform transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
