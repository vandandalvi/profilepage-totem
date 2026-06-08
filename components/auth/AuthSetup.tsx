"use client";

import { useState } from "react";
import { Key, User, ArrowRight, Sparkles, Terminal, Info } from "lucide-react";
import { motion } from "framer-motion";

interface AuthSetupProps {
  onLogin: (token: string, userId: number) => void;
}

export function AuthSetup({ onLogin }: AuthSetupProps) {
  const [tokenInput, setTokenInput] = useState("");
  const [userIdInput, setUserIdInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const userIdNum = Number(userIdInput.trim());
    const token = tokenInput.trim();

    if (!userIdInput.trim()) {
      setError("User ID is required");
      return;
    }

    if (isNaN(userIdNum) || userIdNum <= 0) {
      setError("User ID must be a positive number");
      return;
    }

    if (!token) {
      setError("Bearer Token is required");
      return;
    }

    // Call the login callback from Context
    onLogin(token, userIdNum);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface-base text-text-primary px-4 py-12 relative overflow-hidden select-none">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-teal/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-accent-purple/5 rounded-full filter blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg z-10"
      >
        {/* Brand Logo & Name */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-brand-teal-dark border border-brand-teal/20 mb-3 shadow-glow-teal">
            <Sparkles className="w-8 h-8 text-brand-teal" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-teal to-brand-teal/60 bg-clip-text text-transparent">
            Velocity Profile Page
          </h1>
          <p className="text-text-secondary text-sm mt-2 max-w-sm mx-auto">
            Connect your existing system's backend profile to load prompt efficiency, active streaks, and category analysis.
          </p>
        </div>

        {/* Credentials Form Card */}
        <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-card backdrop-blur-md">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-border-input pb-3">
            <Terminal className="w-5 h-5 text-brand-teal" /> Auth Configuration
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* User ID Field */}
            <div className="space-y-1.5">
              <label htmlFor="userId" className="text-xs font-semibold text-text-secondary tracking-wider uppercase">
                User ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="userId"
                  type="text"
                  placeholder="e.g., 5208"
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  className="w-full bg-surface-input border border-border-input rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-none transition-all"
                />
              </div>
            </div>

            {/* Bearer Token Field */}
            <div className="space-y-1.5">
              <label htmlFor="token" className="text-xs font-semibold text-text-secondary tracking-wider uppercase">
                Bearer Token
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  id="token"
                  type="password"
                  placeholder="Paste your Authorization Bearer Token"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full bg-surface-input border border-border-input rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-none transition-all"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-xs font-medium text-red-400 bg-red-950/20 border border-red-500/20 rounded-lg p-3"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-gradient-teal-start to-gradient-teal-end hover:opacity-95 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-glow-teal hover:translate-y-[-1px] active:translate-y-[0px] transition-all"
            >
              Access Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick guide trigger */}
          <div className="mt-6 border-t border-border-input pt-4 flex flex-col">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="text-xs text-brand-teal hover:underline flex items-center gap-1.5 self-start"
            >
              <Info className="w-3.5 h-3.5" /> How to find these credentials?
            </button>

            {showGuide && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 text-xs text-text-secondary space-y-2 bg-surface-base/50 rounded-xl p-3 border border-border-input"
              >
                <p>
                  Since you are developing/testing with Postman:
                </p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Run your system's <strong>Login API request</strong> in Postman.</li>
                  <li>Copy the numeric <code className="text-brand-teal bg-brand-teal/10 px-1 py-0.5 rounded">user_id</code> from the JSON success response.</li>
                  <li>Copy the <code className="text-brand-teal bg-brand-teal/10 px-1 py-0.5 rounded">token</code> or Bearer access token string from the login response headers/body.</li>
                  <li>Paste them above to authorize local data-fetching.</li>
                </ol>
                <p className="text-[10px] text-text-tertiary">
                  Tip: Credentials are saved securely to your browser's <code className="bg-white/5 px-1 py-0.5 rounded">localStorage</code> and will load automatically on your next visit.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
