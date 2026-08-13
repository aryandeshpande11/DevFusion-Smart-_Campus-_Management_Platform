import React from "react";

// invitation-style placeholder for a page/section with no data yet
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border py-14 text-center dark:border-white/10">
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-white/5 dark:text-brand-300">
          <Icon size={22} />
        </span>
      )}
      <h3 className="font-display text-lg font-medium">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </div>
  );
}
