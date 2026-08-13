import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { GraduationCap, LogOut } from "lucide-react";
import { roleNavConfig } from "../../config/roleNavConfig.js";
import Avatar from "../common/Avatar.jsx";
import { useAuth } from "../../hooks/useAuth.js";

// left rail: brand mark, signed-in user card, then the role's nav list —
// same shape as the reference (logo / profile / MENU UTAMA / items)
export default function Sidebar({ role }) {
  const { currentUser, logOut } = useAuth();
  const location = useLocation();
  const navItems = roleNavConfig[role] || [];
  const basePath = `/app/${role}`;

  const isItemActive = (itemPath) => {
    const fullPath = itemPath ? `${basePath}/${itemPath}` : basePath;
    return location.pathname === fullPath;
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-surface dark:bg-ink/60 dark:border-white/10">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
          <GraduationCap size={18} />
        </span>
        <span className="font-display text-lg font-semibold">CampusConnect</span>
      </div>

      <div className="mx-4 flex items-center gap-3 rounded-xl border border-border p-3 dark:border-white/10">
        <Avatar name={currentUser?.name || "Guest"} imageUrl={currentUser?.avatarUrl} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{currentUser?.name || "Guest"}</p>
          <p className="truncate text-xs capitalize text-muted">{role}</p>
        </div>
      </div>

      <nav className="mt-6 flex-1 overflow-y-auto px-4">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Main menu
        </p>
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const fullPath = item.path ? `${basePath}/${item.path}` : basePath;
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <NavLink
                  to={fullPath}
                  end={item.path === ""}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                    isItemActive(item.path)
                      ? "bg-brand-50 font-medium text-brand-700 dark:bg-white/10 dark:text-brand-300"
                      : "text-ink/80 hover:bg-black/5 dark:text-canvas/80 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon size={17} />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-4 dark:border-white/10">
        <button
          onClick={logOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-danger hover:bg-danger/5"
        >
          <LogOut size={17} />
          Log out
        </button>
      </div>
    </aside>
  );
}
