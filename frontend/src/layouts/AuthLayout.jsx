import React from "react";
import { CalendarCheck, CheckSquare, Clock } from "lucide-react";

// Landing-page mark, reused here so auth carries the same brand identity.
function Logo({ size = 34 }) {
  return (
      <span
          className="relative shrink-0 rounded-xl bg-white shadow-[0_1px_3px_rgba(23,25,35,0.15)]"
          style={{ width: size, height: size }}
      >
      <span
          className="absolute rounded-lg bg-[#2563EB]"
          style={{ width: size * 0.46, height: size * 0.46, left: size * 0.14, top: size * 0.14 }}
      />
      <span
          className="absolute rounded-full bg-[#171923]"
          style={{ width: size * 0.3, height: size * 0.3, right: size * 0.12, bottom: size * 0.12 }}
      />
      <span
          className="absolute rounded-full bg-[#FDBA4C]"
          style={{ width: size * 0.16, height: size * 0.16, right: size * 0.1, top: size * 0.1 }}
      />
    </span>
  );
}

// split-panel shell for every auth screen — left panel now shares the
// landing page's dotted-grid, blob, and floating-card treatment instead
// of a photographic overlay, so auth feels like the same product.
export default function AuthLayout({ title, subtitle, children }) {
  return (
      <div className="grid min-h-screen grid-cols-1 bg-white text-[#171923] lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex">
          <div
              className="absolute inset-0"
              style={{
                backgroundColor: "#FAFAFC",
                backgroundImage:
                    "linear-gradient(#ECEDF1 1px, transparent 1px), linear-gradient(90deg, #ECEDF1 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
          />
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#DCE6FF] opacity-50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-[#FDE9C8] opacity-50 blur-3xl" />

          <div className="relative flex items-center gap-2.5">
            <Logo size={34} />
            <span className="font-display text-lg font-semibold">AleBaple</span>
          </div>

          <div className="relative">
            <h2 className="max-w-md font-display text-3xl font-semibold leading-snug">
              One campus, every department, a single login.
            </h2>
            <p className="mt-4 max-w-sm text-sm text-[#4A5568]">
              Attendance, assignments, events and placements — all in the
              place your students already check every day.
            </p>
          </div>

          {/* floating mockup cards, echoing the landing hero */}
          <div className="pointer-events-none absolute right-10 top-24 hidden -rotate-3 xl:block">
            <div className="w-56 rounded-xl border border-[#ECEDF1] bg-white p-4 text-left shadow-[0_8px_20px_-6px_rgba(23,25,35,0.2)]">
              <p className="text-xs font-medium text-[#8A93A6]">Reminder</p>
              <p className="mt-1 text-sm font-medium">DBMS Lecture</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-[#4A5568]">
                <Clock size={12} /> Room 204 · 10:00–10:50
              </p>
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-8 left-10 hidden w-56 rotate-1 rounded-xl border border-[#ECEDF1] bg-white p-4 text-left shadow-[0_10px_24px_-8px_rgba(23,25,35,0.22)] xl:block">
            <p className="text-xs font-medium text-[#8A93A6]">Today</p>
            <div className="mt-2 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckSquare size={14} className="text-[#2563EB]" />
                <span>Submit DBMS assignment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckSquare size={14} className="text-[#D9DBE3]" />
                <span className="text-[#8A93A6]">Club meeting sign-up</span>
              </div>
            </div>
          </div>

          <p className="relative text-xs text-[#8A93A6]">DevFusion 4.0 · Smart Campus Platform</p>
        </div>

        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-6 flex items-center gap-2.5 lg:hidden">
              <Logo size={30} />
              <span className="font-display text-base font-semibold">AleBaple</span>
            </div>
            <h1 className="font-display text-2xl font-semibold">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-[#4A5568]">{subtitle}</p>}
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
  );
}