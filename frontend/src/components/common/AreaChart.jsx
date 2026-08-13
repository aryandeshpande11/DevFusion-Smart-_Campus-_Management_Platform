import React, { useMemo, useState } from "react";

// dependency-free area/line chart — no charting library required, just SVG.
// Pass `data` as [{ label, value }]. Hover any column to move the tooltip;
// pass `activeIndex` to control it from outside instead (e.g. "peak" point).
export default function AreaChart({
  data = [],
  height = 220,
  accentColor = "#1F6F54",
  accentColorEnd = "#C89B3C",
  formatValue,
  activeIndex: controlledIndex,
}) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const width = 640;
  const padding = { top: 20, right: 8, bottom: 26, left: 8 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const values = data.map((point) => point.value);
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(0, Math.min(...values));
  const valueRange = maxValue - minValue || 1;

  const points = useMemo(
    () =>
      data.map((point, index) => {
        const x =
          data.length > 1
            ? (index / (data.length - 1)) * innerWidth + padding.left
            : innerWidth / 2 + padding.left;
        const y = padding.top + innerHeight - ((point.value - minValue) / valueRange) * innerHeight;
        return { ...point, x, y };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, innerWidth, innerHeight, minValue, valueRange]
  );

  if (!data.length) {
    return (
      <div className="flex items-center justify-center text-sm text-muted" style={{ height }}>
        No data yet.
      </div>
    );
  }

  const activeIndex = controlledIndex ?? hoverIndex ?? points.length - 1;
  const active = points[activeIndex];

  const linePath = points
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      const prev = points[index - 1];
      const midX = (prev.x + point.x) / 2;
      return `C ${midX} ${prev.y}, ${midX} ${point.y}, ${point.x} ${point.y}`;
    })
    .join(" ");

  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const areaPath = `${linePath} L ${lastPoint.x} ${padding.top + innerHeight} L ${firstPoint.x} ${
    padding.top + innerHeight
  } Z`;

  const formatted = (value) => (formatValue ? formatValue(value) : value);
  const columnWidth = innerWidth / points.length;

  return (
    <div className="relative" style={{ "--chart-accent": accentColor }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaChartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.28" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="areaChartLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="100%" stopColor={accentColorEnd} />
          </linearGradient>
        </defs>

        {/* horizontal guide lines */}
        {[0.25, 0.5, 0.75].map((fraction) => (
          <line
            key={fraction}
            x1={padding.left}
            x2={width - padding.right}
            y1={padding.top + innerHeight * fraction}
            y2={padding.top + innerHeight * fraction}
            className="stroke-border dark:stroke-white/10"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        ))}

        <path d={areaPath} fill="url(#areaChartFill)" />
        <path d={linePath} fill="none" stroke="url(#areaChartLine)" strokeWidth="2.5" strokeLinecap="round" />

        {active && (
          <line
            x1={active.x}
            x2={active.x}
            y1={padding.top}
            y2={padding.top + innerHeight}
            className="stroke-ink/15 dark:stroke-white/20"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        )}

        {points.map((point, index) => (
          <g key={`${point.label}-${index}`}>
            <rect
              x={point.x - columnWidth / 2}
              y={padding.top}
              width={columnWidth}
              height={innerHeight}
              fill="transparent"
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            />
            {index === activeIndex && (
              <circle cx={point.x} cy={point.y} r="4.5" fill={accentColor} stroke="white" strokeWidth="2" />
            )}
          </g>
        ))}

        {points.map((point, index) => (
          <text
            key={`label-${point.label}-${index}`}
            x={point.x}
            y={height - 6}
            textAnchor="middle"
            className="fill-muted"
            style={{ fontSize: 10 }}
          >
            {point.label}
          </text>
        ))}
      </svg>

      {active && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-canvas shadow-card dark:bg-white dark:text-ink"
          style={{
            left: `${(active.x / width) * 100}%`,
            top: `${(active.y / height) * 100}%`,
            marginTop: -10,
          }}
        >
          {formatted(active.value)}
        </div>
      )}
    </div>
  );
}
