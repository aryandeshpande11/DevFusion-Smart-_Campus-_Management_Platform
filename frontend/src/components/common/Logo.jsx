import React from "react";

// AleBaple brand mark — a loose cluster of three shapes (square, circle,
// dot) rather than an even grid, so it reads as its own thing instead of a
// generic stock "app icon". Shared between the landing page and the
// dashboard sidebar so the two surfaces feel like one product.
export default function Logo({ size = 36 }) {
    return (
        <span
            className="relative shrink-0 rounded-xl bg-white shadow-[0_1px_3px_rgba(23,25,35,0.15)]"
            style={{ width: size, height: size }}
        >
      <span
          className="absolute rounded-lg bg-brand-500"
          style={{ width: size * 0.46, height: size * 0.46, left: size * 0.14, top: size * 0.14 }}
      />
      <span
          className="absolute rounded-full bg-ink"
          style={{ width: size * 0.3, height: size * 0.3, right: size * 0.12, bottom: size * 0.12 }}
      />
      <span
          className="absolute rounded-full bg-gold-400"
          style={{ width: size * 0.16, height: size * 0.16, right: size * 0.1, top: size * 0.1 }}
      />
    </span>
    );
}