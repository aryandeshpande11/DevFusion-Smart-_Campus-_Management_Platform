import React from "react";
import { MoreVertical } from "lucide-react";

// plain content card — the base surface every widget sits on
export function Card({ children, className = "", ...rest }) {
  return (
    <div className={`surfaceCard p-5 ${className}`} {...rest}>
      {children}
    </div>
  );
}

// small metric tile: icon top-right, big number, label underneath —
// mirrors the "Pertemuan / Forum / Tugas" tiles from the reference layout
export function StatCard({ label, value, icon: Icon, onOptionsClick }) {
  return (
    <Card className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <span className="text-sm text-muted">{label}</span>
        <div className="flex items-center gap-1">
          {Icon && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-white/5 dark:text-brand-300">
              <Icon size={16} />
            </span>
          )}
          {onOptionsClick && (
            <button
              onClick={onOptionsClick}
              aria-label="More options"
              className="text-muted hover:text-ink dark:hover:text-canvas"
            >
              <MoreVertical size={16} />
            </button>
          )}
        </div>
      </div>
      <span className="text-3xl font-display font-semibold">{value}</span>
    </Card>
  );
}
