import { Sidebar } from "@/components/layout/Sidebar";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatCards } from "@/components/stats/StatCards";
import { InsightCard } from "@/components/insights/InsightCard";
import { ReferralSection } from "@/components/referral/ReferralSection";
import { TopCategoriesCard } from "@/components/analytics/TopCategoriesCard";
import { ActivityCalendar } from "@/components/activity/ActivityCalendar";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-surface-base text-text-primary overflow-hidden">
      <Sidebar />

      {/* Main content: no left margin on mobile, md=collapsed(64px), lg=expanded(180px) */}
      <main className="flex-1 md:ml-[64px] lg:ml-[180px] h-full overflow-y-auto overflow-x-hidden">
        <div className="max-w-screen-2xl mx-auto pb-12">
          <ProfileHeader />

          <div className="px-4 sm:px-6 lg:px-8 py-2">
            <h1 className="text-[17px] sm:text-[20px] font-bold text-text-primary mb-4 sm:mb-6 tracking-tight">
              Your Velocity this month
            </h1>
          </div>

          <StatCards />
          <InsightCard />
          <ReferralSection />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 px-4 sm:px-6 lg:px-8 mt-2">
            <TopCategoriesCard />
            <ActivityCalendar />
          </div>
        </div>
      </main>
    </div>
  );
}
