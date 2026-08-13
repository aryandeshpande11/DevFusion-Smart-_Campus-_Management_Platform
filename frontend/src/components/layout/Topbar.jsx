import React, { useState } from "react";
import { Bell, ChevronDown, Inbox, Moon, Sun } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { useUiStore } from "../../store/uiStore.js";

const academicTerms = ["2025 – 2026, Odd semester", "2024 – 2025, Even semester"];

// greeting header used across every dashboard — mirrors "Hi, Nirmala" plus
// the period dropdown and bell/inbox icons from the reference layout
export default function Topbar({ pageTitle }) {
  const { currentUser } = useAuth();
  const { isDarkMode, toggleDarkMode } = useUiStore();
  const [isTermMenuOpen, setIsTermMenuOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(academicTerms[0]);

  const firstName = currentUser?.name?.split(" ")[0] || "there";

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface px-8 py-5 dark:border-white/10 dark:bg-ink/60">
      <div>
        <h1 className="font-display text-xl font-semibold">
          {pageTitle || (
            <>
              Hi, {firstName} <span className="align-middle">👋</span>
            </>
          )}
        </h1>
        <p className="text-sm text-muted">Welcome back to CampusConnect</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setIsTermMenuOpen((open) => !open)}
            className="flex items-center gap-3 rounded-xl border border-border px-4 py-2 text-left dark:border-white/10"
          >
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted">Term</p>
              <p className="text-sm font-medium leading-tight">{selectedTerm}</p>
            </div>
            <ChevronDown size={15} className={`text-muted transition ${isTermMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {isTermMenuOpen && (
            <div className="absolute right-0 z-10 mt-2 w-64 rounded-xl border border-border bg-surface p-1.5 text-sm shadow-card dark:border-white/10 dark:bg-ink">
              {academicTerms.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSelectedTerm(term);
                    setIsTermMenuOpen(false);
                  }}
                  className={`block w-full rounded-lg px-3 py-2 text-left hover:bg-black/5 dark:hover:bg-white/5 ${
                    term === selectedTerm ? "font-medium text-brand-600 dark:text-brand-300" : ""
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-black/5 hover:text-ink dark:hover:bg-white/5 dark:hover:text-canvas"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-black/5 hover:text-ink dark:hover:bg-white/5 dark:hover:text-canvas"
        >
          <Bell size={18} />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-danger" />
        </button>
        <button
          aria-label="Inbox"
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-black/5 hover:text-ink dark:hover:bg-white/5 dark:hover:text-canvas"
        >
          <Inbox size={18} />
        </button>
      </div>
    </header>
  );
}
