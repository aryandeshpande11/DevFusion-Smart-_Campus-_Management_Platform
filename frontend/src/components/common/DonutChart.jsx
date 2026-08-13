import React from "react";

// dependency-free donut chart — an SVG ring built from stroke-dasharray
// segments, a centered value, and a small legend underneath. Used for the
// "875 Kelas" style breakdown tiles from the reference layout.
export default function DonutChart({ segments = [], size = 132, strokeWidth = 16, centerLabel, centerValue }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;

  let cumulativeFraction = 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-black/5 dark:stroke-white/10"
          />
          {segments.map((segment, index) => {
            const fraction = segment.value / total;
            const dash = fraction * circumference;
            const gap = circumference - dash;
            const offset = -cumulativeFraction * circumference;
            cumulativeFraction += fraction;
            return (
              <circle
                key={`${segment.label}-${index}`}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={offset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-xl font-semibold leading-none">{centerValue}</span>
          {centerLabel && <span className="mt-1 text-center text-[11px] leading-tight text-muted">{centerLabel}</span>}
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        {segments.map((segment, index) => (
          <div key={`${segment.label}-legend-${index}`} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-ink/80 dark:text-canvas/80">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} />
              {segment.label}
            </span>
            <span className="font-medium text-muted">
              {segment.value} ({Math.round((segment.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
