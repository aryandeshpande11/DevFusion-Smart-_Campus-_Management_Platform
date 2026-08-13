import React, { useState } from "react";
import { Bell, Inbox, Moon, Sun } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { useUiStore } from "../../store/uiStore.js";

const currentAcademicTerm = "2025 – 2026, Odd semester";

// greeting header used across every dashboard — mirrors "Hi, Nirmala"
// plus the period dropdown and bell/inbox icons from the reference layout
export default function Topbar({ pageTitle }) {
  const { currentUser } = useAuth();
  const { isDarkMode, toggleDarkMode } = useUiStore();
  const [isTermMenuOpen, setIsTermMenuOpen] = useState(false);

  const firstName = currentUser?.name?.split(" ")[0] || "there";

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface px-8 py-5 dark:border-white/10 dark:bg-ink/60">
      <div>
        <h1 className="font-display text-xl font-semibold">
          {pageTitle || `Hi, ${firstName} \u{1F44B}`}
        </h1>
        <p className="text-sm text-muted">Welcome back to CampusConnect</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setIsTermMenuOpen((open) => !open)}
            className="rounded-lg border border-border px-3.5 py-2 text-sm dark:border-white/10"
          >
            {currentAcademicTerm}
          </button>
          {isTermMenuOpen && (
            <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-border bg-surface p-2 text-sm shadow-card dark:border-white/10 dark:bg-ink">
              <p className="rounded-md px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5">
                2025 – 2026, Odd semester
              </p>
              <p className="rounded-md px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5">
                2024 – 2025, Even semester
              </p>
            </div>
          )}
        </div>

        <button
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted hover:text-ink dark:border-white/10 dark:hover:text-canvas"
        >
          {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button
          aria-label="Notifications"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted hover:text-ink dark:border-white/10 dark:hover:text-canvas"
        >
          <Bell size={17} />
        </button>
        <button
          aria-label="Inbox"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted hover:text-ink dark:border-white/10 dark:hover:text-canvas"
        >
          <Inbox size={17} />
        </button>
      </div>
    </header>
  );
}
