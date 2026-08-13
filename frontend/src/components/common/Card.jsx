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

const toneClasses = {
  brand: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300",
  gold: "bg-gold-100 text-gold-600 dark:bg-gold-400/15 dark:text-gold-100",
  sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-100",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-100",
};

// small metric tile: label + optional menu up top, big number + colored icon
// chip on the bottom row — mirrors the "Pertemuan / Forum / Tugas" tiles from
// the reference layout. `tone` just picks which accent the icon chip uses so
// a row of four cards doesn't read as one flat block of color.
export function StatCard({ label, value, icon: Icon, tone = "brand", trend, onOptionsClick }) {
  return (
    <Card className="flex flex-col justify-between gap-7">
      <div className="flex items-start justify-between">
        <span className="text-sm text-muted">{label}</span>
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

      <div className="flex items-end justify-between">
        <div>
          <span className="block font-display text-3xl font-semibold leading-none">{value}</span>
          {trend && (
            <span
              className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${
                trend.direction === "down" ? "text-danger" : "text-success"
              }`}
            >
              {trend.direction === "down" ? "\u2193" : "\u2191"} {trend.label}
            </span>
          )}
        </div>
        {Icon && (
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
              toneClasses[tone] || toneClasses.brand
            }`}
          >
            <Icon size={18} />
          </span>
        )}
      </div>
    </Card>
  );
}

// compact stacked stat used beside a chart — big number, optional trend,
// helper caption underneath (the "Total Nominal Bulan Ini" style panel).
// Stack a few inside one <div className="divide-y ..."> for the sidebar list.
export function MetricPanel({ label, value, caption, trend }) {
  return (
    <div>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1.5 font-display text-2xl font-semibold">{value}</p>
      {(trend || caption) && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-medium ${
                trend.direction === "down" ? "text-danger" : "text-success"
              }`}
            >
              {trend.direction === "down" ? "\u2193" : "\u2191"} {trend.value}
            </span>
          )}
          {caption && <span className="text-muted">{caption}</span>}
        </div>
      )}
    </div>
  );
}
