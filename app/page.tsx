"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatCards } from "@/components/stats/StatCards";
import { InsightCard } from "@/components/insights/InsightCard";
import { ReferralSection } from "@/components/referral/ReferralSection";
import { TopCategoriesCard } from "@/components/analytics/TopCategoriesCard";
import { ActivityCalendar } from "@/components/activity/ActivityCalendar";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"categories" | "streak">("categories");

  return (
    <div className="flex h-screen bg-surface-base text-text-primary overflow-hidden">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 md:ml-[64px] lg:ml-[180px] h-full overflow-y-auto overflow-x-hidden">
        <div className="max-w-screen-2xl mx-auto pb-8 sm:pb-12">
          <ProfileHeader />

          {/* AI Insight — shown first on mobile for instant value */}
          <InsightCard />

          <div className="px-4 sm:px-6 lg:px-8 pt-1 pb-2">
            <h1 className="text-[15px] sm:text-[20px] font-bold text-text-primary tracking-tight">
              Your Velocity this month
            </h1>
          </div>

          <StatCards />
          <ReferralSection />

          {/* Bottom grid: tab switcher on mobile, side-by-side on xl */}
          <div className="px-4 sm:px-6 lg:px-8 mt-3">
            {/* Mobile tab bar — hidden on xl */}
            <div className="flex xl:hidden rounded-xl bg-surface-elevated border border-border-subtle p-1 mb-3 gap-1">
              <button
                onClick={() => setActiveTab("categories")}
                className={`flex-1 py-2 text-[12px] font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === "categories"
                    ? "bg-surface-card text-text-primary shadow-sm border border-border-subtle"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Top Categories
              </button>
              <button
                onClick={() => setActiveTab("streak")}
                className={`flex-1 py-2 text-[12px] font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === "streak"
                    ? "bg-surface-card text-text-primary shadow-sm border border-border-subtle"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Streak Calendar
              </button>
            </div>

            {/* Mobile: show only active tab */}
            <div className="xl:hidden">
              {activeTab === "categories" ? <TopCategoriesCard /> : <ActivityCalendar />}
            </div>

            {/* Desktop: side-by-side */}
            <div className="hidden xl:grid xl:grid-cols-2 gap-4">
              <TopCategoriesCard />
              <ActivityCalendar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
