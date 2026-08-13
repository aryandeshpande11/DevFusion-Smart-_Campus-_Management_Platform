import React from "react";

const toneStyles = {
  neutral: "bg-black/5 text-ink dark:bg-white/10 dark:text-canvas",
  brand: "bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300",
  gold: "bg-gold-100 text-gold-600",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  warning: "bg-warning/10 text-warning",
};

// small pill used for status labels — present/absent, pending/approved, etc.
export default function Badge({ children, tone = "neutral" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneStyles[tone]}`}>
      {children}
    </span>
  );
}
