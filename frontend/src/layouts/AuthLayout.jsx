import React from "react";
import { GraduationCap } from "lucide-react";

// split-panel shell for every auth screen — brand blurb on the left,
// the actual form (passed as children) on the right
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-brand-700 p-10 text-white lg:flex">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
            <GraduationCap size={18} />
          </span>
          <span className="font-display text-lg font-semibold">CampusConnect</span>
        </div>
        <div>
          <h2 className="max-w-md font-display text-3xl leading-snug">
            One campus, every department, a single login.
          </h2>
          <p className="mt-4 max-w-sm text-sm text-brand-100">
            Attendance, assignments, events and placements — all in the
            place your students already check every day.
          </p>
        </div>
        <p className="text-xs text-brand-100">DevFusion 4.0 · Smart Campus Platform</p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-semibold">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
