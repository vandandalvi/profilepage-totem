"use client";

import { useState, useEffect } from "react";
import {
  SquarePen,
  Book,
  Heart,
  Box,
  Sparkles,
  Archive,
  ChevronDown,
  User,
  Download,
  PanelLeftClose,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Chat History");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Load and apply theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "light") {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }
    } else {
      // Default to dark mode if no saved preference
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  // Close mobile drawer on resize to tablet+
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  interface NavItem {
    icon: any;
    label: string;
    route?: string;
  }

  const navItems: NavItem[] = [
    { icon: Book, label: "Prompt Book" },
    { icon: Heart, label: "Collections" },
    { icon: Box, label: "Memory" },
    { icon: Sparkles, label: "Personalize" },
  ];

  const historyItems = [
    "Landing page design",
    "Diet planner",
    "Prompt improvement ideas",
    "Expert prompt engineers"
  ];

  const sidebarContent = (isMobile = false) => (
    <>
      {/* Header */}
      <div className={cn("p-4 flex items-center", (collapsed && !isMobile) ? "flex-col gap-4 justify-center" : "justify-between")}>
        <img
          src="/logo.jpg"
          alt="Velocity Logo"
          className="w-7 h-7 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => (collapsed && !isMobile) && setCollapsed(false)}
        />
        {isMobile ? (
          <button
            onClick={() => setMobileOpen(false)}
            className="text-text-secondary hover:text-text-primary transition-all duration-150 ml-auto"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn("text-text-secondary hover:text-text-primary transition-all duration-150", collapsed ? "mx-auto" : "ml-auto")}
            aria-label="Toggle sidebar"
          >
            <PanelLeftClose size={18} className={cn("transition-transform duration-200", collapsed ? "rotate-180" : "")} />
          </button>
        )}
      </div>

      {/* New Chat Button */}
      <div className="px-3 pb-4">
        <a
          href="https://thinkvelocity.in/chat/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center justify-center bg-brand-teal text-white hover:opacity-90 rounded-xl transition-all duration-150",
            (collapsed && !isMobile) ? "w-10 h-10" : "w-full py-2.5 px-3 gap-2 text-[13px] font-medium"
          )}
        >
          <SquarePen size={(collapsed && !isMobile) ? 18 : 16} className="shrink-0" />
          {(!collapsed || isMobile) && <span>New Chat</span>}
        </a>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-hide">
        {navItems.map((item, i) => {
          const className = cn(
            "nav-item w-full text-left bg-transparent border-0 cursor-pointer",
            activeItem === item.label ? "nav-item-active" : ""
          );

          const content = (
            <div className="flex items-center gap-3">
              <item.icon size={16} className="shrink-0" />
              {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
            </div>
          );

          return (
            <button
              key={i}
              onClick={() => setActiveItem(item.label)}
              className={className}
            >
              {content}
            </button>
          );
        })}

        {/* Chat History */}
        <div className="pt-4">
          <div
            className={cn(
              "nav-item justify-between cursor-pointer",
              activeItem === "Chat History" ? "nav-item-active" : ""
            )}
            onClick={() => {
              setActiveItem("Chat History");
              setHistoryOpen(!historyOpen);
            }}
          >
            <div className="flex items-center gap-3">
              <Archive size={16} className="text-brand-teal shrink-0" />
              {(!collapsed || isMobile) && <span className="font-medium">Chat History</span>}
            </div>
            {(!collapsed || isMobile) && (
              <ChevronDown
                size={14}
                className={cn("transition-transform duration-200", historyOpen ? "rotate-180" : "")}
              />
            )}
          </div>

          <AnimatePresence>
            {(!collapsed || isMobile) && historyOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pl-9 pr-3 py-2 flex flex-col gap-2.5">
                  {historyItems.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => window.open("https://thinkvelocity.in/chat/", "_blank")}
                      className="text-[12px] text-text-secondary hover:text-text-primary cursor-pointer truncate transition-colors py-1"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border-subtle flex flex-col gap-1">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="nav-item w-full text-left bg-transparent border-0 cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun size={16} className="shrink-0 text-brand-teal" />
          ) : (
            <Moon size={16} className="shrink-0 text-brand-teal" />
          )}
          {(!collapsed || isMobile) && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </button>

        <button
          onClick={() => {
            setActiveItem("Account");
            window.open("https://thinkvelocity.in/chat/", "_blank");
          }}
          className={cn(
            "nav-item w-full text-left bg-transparent border-0 cursor-pointer",
            activeItem === "Account" ? "nav-item-active" : ""
          )}
        >
          <User size={16} className="shrink-0" />
          {(!collapsed || isMobile) && <span>Account</span>}
        </button>
        <button
          onClick={() => window.open("https://chromewebstore.google.com/detail/ggiecgdncaiedmdnbmgjhpfniflebfpa/error?hl=en-GB", "_blank")}
          className="nav-item w-full text-left bg-transparent border-0 cursor-pointer"
        >
          <Download size={16} className="shrink-0" />
          {(!collapsed || isMobile) && <span>Install</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger trigger — visible only on mobile */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 w-10 h-10 flex items-center justify-center bg-surface-sidebar border border-border-subtle rounded-xl text-text-secondary hover:text-text-primary transition-colors"
        aria-label="Open sidebar"
      >
        <Menu size={18} />
      </button>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sidebar-overlay"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed left-0 top-0 h-screen w-[240px] bg-surface-sidebar border-r border-border-subtle flex flex-col z-20 md:hidden"
          >
            {sidebarContent(true)}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop/Tablet sidebar — hidden on mobile */}
      <motion.aside
        initial={{ width: 180 }}
        animate={{ width: collapsed ? 64 : 180 }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
        className="hidden md:flex fixed left-0 top-0 h-screen bg-surface-sidebar border-r border-border-subtle flex-col z-20"
      >
        {sidebarContent(false)}
      </motion.aside>
    </>
  );
}
