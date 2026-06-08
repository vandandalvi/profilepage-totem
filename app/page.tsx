"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatCards } from "@/components/stats/StatCards";
import { InsightCard } from "@/components/insights/InsightCard";
import dynamic from "next/dynamic";
import { DashboardProvider, useDashboardData } from "@/lib/DashboardContext";
import { Loader2 } from "lucide-react";
import { AuthSetup } from "@/components/auth/AuthSetup";

const ReferralSection = dynamic(() => import("@/components/referral/ReferralSection").then(m => m.ReferralSection), { ssr: true });
const TopCategoriesCard = dynamic(() => import("@/components/analytics/TopCategoriesCard").then(m => m.TopCategoriesCard), { ssr: true });
const ActivityCalendar = dynamic(() => import("@/components/activity/ActivityCalendar").then(m => m.ActivityCalendar), { ssr: true });

function DashboardContent() {
  const { isLoading, error, isAuthenticated, login, logout } = useDashboardData();
  const [activeTab, setActiveTab] = useState<"categories" | "streak">("categories");

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-surface-base text-brand-teal">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthSetup onLogin={login} />;
  }

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col gap-4 items-center justify-center bg-surface-base text-text-primary px-4 text-center">
        <div className="bg-surface-card border border-red-500/20 rounded-2xl p-6 max-w-md shadow-card">
          <p className="text-red-400 font-semibold mb-2">Error Loading Dashboard</p>
          <p className="text-text-secondary text-sm mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal font-medium rounded-xl text-sm transition-all border border-brand-teal/20"
            >
              Retry Connection
            </button>
            <button
              onClick={logout}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-text-primary font-medium rounded-xl text-sm transition-all border border-border-input"
            >
              Reset Credentials
            </button>
          </div>
        </div>
      </div>
    );
  }

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

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
