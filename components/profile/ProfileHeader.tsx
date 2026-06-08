"use client";

import { LogOut, MessageSquare } from "lucide-react";

import { useDashboardData } from "@/lib/DashboardContext";

export function ProfileHeader() {
  const { data } = useDashboardData();
  const user = data?.user;
  const usage = data?.usage;

  return (
    <header className="flex items-center justify-between w-full py-4 px-4 sm:px-6 lg:px-8 mt-2">
      {/* Left: avatar + name */}
      <div className="flex items-center gap-3 sm:gap-4 pl-12 md:pl-0">
        {/* Avatar */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#E0F2FE] flex items-center justify-center text-xl font-bold text-[#0369A1] overflow-hidden shrink-0">
          <div className="w-full h-full bg-[#85DFD8] flex items-center justify-center relative">
            <div className="w-5 h-5 bg-[#0A2626] rounded-full absolute top-2" />
            <div className="w-8 h-8 bg-[#0A2626] rounded-full absolute -bottom-3" />
          </div>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h1 className="text-base sm:text-xl font-semibold text-text-primary tracking-tight whitespace-nowrap">
              {user?.username || "Vandan"}
            </h1>
            <span className="hidden xs:inline-flex px-2.5 py-0.5 rounded-full bg-surface-card border border-border-subtle text-[11px] font-medium text-text-primary/80 whitespace-nowrap capitalize">
              {usage?.status || "Free"} plan
            </span>
          </div>
          <p className="text-[12px] sm:text-[13px] text-text-secondary mt-0.5 truncate">
            {user?.email || "vandan@toteminteractive.com"}
          </p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <button
          onClick={() => window.open("https://thinkvelocity.in/contact-us/", "_blank")}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors min-h-[44px] px-1 cursor-pointer"
          aria-label="Give feedback"
        >
          <MessageSquare size={14} />
          <span className="hidden sm:inline">Give Feedback</span>
        </button>

        <button
          onClick={() => window.open("https://thinkvelocity.in", "_blank")}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors min-h-[44px] px-1 cursor-pointer"
          aria-label="Log out"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      </div>
    </header>
  );
}
