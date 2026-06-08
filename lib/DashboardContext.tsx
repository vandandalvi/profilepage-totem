"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface DashboardUser {
  user_id: number;
  username: string;
  email: string;
  member_since: string;
}

export interface DashboardUsage {
  status: string;
  daily_limit: number;
  remaining_today: number;
  used_today: number;
  daily_label: string;
  total_prompts: number;
}

export interface DashboardPromptEfficiency {
  less_typing_percentage: number;
  original_chars: number;
  enhanced_chars: number;
  chars_saved: number;
  original_words: number;
  enhanced_words: number;
  words_saved: number;
  time_saved_minutes: number;
  time_saved_label: string;
}

export interface DashboardDomainInfo {
  domain: string;
  prompt_count: number;
  percentage: number;
}

export interface DashboardPlatformInfo {
  platform: string;
  prompt_count: number;
  percentage: number;
}

export interface DashboardLLMInfo {
  llm: string;
  prompt_count: number;
  percentage: number;
}

export interface DashboardTopCategories {
  total_prompts: number;
  categories: DashboardDomainInfo[];
}

export interface DashboardStreakDay {
  date: string;
  enhanced: boolean;
  prompt_count: number;
  top_platform: string | null;
  platforms: { platform: string; prompt_count: number }[];
}

export interface DashboardStreak {
  window_days: number;
  current_streak: number;
  longest_streak: number;
  active_days: number;
  prompts_in_window: number;
  days: DashboardStreakDay[];
}

export interface DashboardAPIResponse {
  success: boolean;
  user: DashboardUser;
  usage: DashboardUsage;
  prompt_efficiency: DashboardPromptEfficiency;
  most_used_domain: DashboardDomainInfo;
  most_used_platform: DashboardPlatformInfo;
  most_used_llm: DashboardLLMInfo;
  top_categories: DashboardTopCategories;
  platforms: DashboardPlatformInfo[];
  llms: DashboardLLMInfo[];
  streak: DashboardStreak;
}

interface DashboardContextType {
  data: DashboardAPIResponse | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  token: string | null;
  userId: number | null;
  login: (token: string, userId: number) => void;
  logout: () => void;
  refetch: () => void;
}

const DashboardContext = createContext<DashboardContextType>({
  data: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  token: null,
  userId: null,
  login: () => {},
  logout: () => {},
  refetch: () => {},
});

export const useDashboardData = () => useContext(DashboardContext);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DashboardAPIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // 1. Initial credentials scan from multiple possible client-side storage locations
  useEffect(() => {
    if (typeof window === "undefined") return;

    function checkCredentials() {
      // a. URL Search Params (ideal for testing / programmatic link-outs)
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get("token") || params.get("accessToken");
      const urlUserId = params.get("userId") || params.get("user_id");

      if (urlToken && urlUserId) {
        localStorage.setItem("totem_token", urlToken);
        localStorage.setItem("totem_user_id", urlUserId);

        // Clean query params so token is not exposed in address bar
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);

        return { token: urlToken, userId: Number(urlUserId) };
      }

      // b. Local Storage
      const localToken = localStorage.getItem("totem_token") || localStorage.getItem("token") || localStorage.getItem("accessToken");
      const localUserId = localStorage.getItem("totem_user_id") || localStorage.getItem("userId") || localStorage.getItem("user_id");

      if (localToken && localUserId) {
        return { token: localToken, userId: Number(localUserId) };
      }

      // c. Session Storage
      try {
        const sessionToken = sessionStorage.getItem("token") || sessionStorage.getItem("accessToken");
        const sessionUserId = sessionStorage.getItem("userId") || sessionStorage.getItem("user_id");
        if (sessionToken && sessionUserId) {
          return { token: sessionToken, userId: Number(sessionUserId) };
        }
      } catch (e) {}

      // d. Cookies
      try {
        const cookies = document.cookie.split("; ");
        const cookieTokenVal = cookies.find(row => row.startsWith("token=") || row.startsWith("accessToken="))?.split("=")[1];
        const cookieUserIdVal = cookies.find(row => row.startsWith("userId=") || row.startsWith("user_id="))?.split("=")[1];
        if (cookieTokenVal && cookieUserIdVal) {
          return { token: decodeURIComponent(cookieTokenVal), userId: Number(decodeURIComponent(cookieUserIdVal)) };
        }
      } catch (e) {}

      return { token: null, userId: null };
    }

    const creds = checkCredentials();
    if (creds.token && creds.userId && !isNaN(creds.userId)) {
      setToken(creds.token);
      setUserId(creds.userId);
      setIsAuthenticated(true);
    } else {
      setIsLoading(false);
    }
  }, []);

  // 2. Fetch data when auth is active or fetchTrigger is bumped
  useEffect(() => {
    if (!isAuthenticated || !token || !userId) {
      setData(null);
      return;
    }

    let isMounted = true;
    
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://thinkvelocity.in/backend-V1-D/api/dashboard/user-profile/${userId}?streakDays=30`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json",
            }
          }
        );
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("Invalid or expired session. Please check your credentials.");
          }
          throw new Error(`Failed to fetch dashboard data (Status ${response.status})`);
        }
        
        const json = await response.json();
        
        if (isMounted) {
          setData(json);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "An error occurred while fetching data");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, token, userId, fetchTrigger]);

  const login = (newToken: string, newUserId: number) => {
    localStorage.setItem("totem_token", newToken);
    localStorage.setItem("totem_user_id", String(newUserId));
    setToken(newToken);
    setUserId(newUserId);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("totem_token");
    localStorage.removeItem("totem_user_id");
    setToken(null);
    setUserId(null);
    setIsAuthenticated(false);
    setData(null);
    setError(null);
  };

  const refetch = () => setFetchTrigger(prev => prev + 1);

  return (
    <DashboardContext.Provider value={{
      data,
      isLoading,
      error,
      isAuthenticated,
      token,
      userId,
      login,
      logout,
      refetch
    }}>
      {children}
    </DashboardContext.Provider>
  );
}
