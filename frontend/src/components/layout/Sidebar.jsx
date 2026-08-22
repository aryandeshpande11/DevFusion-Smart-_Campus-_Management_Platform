import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { roleNavConfig } from "../../config/roleNavConfig.js";
import Avatar from "../common/Avatar.jsx";
import Logo from "../common/Logo.jsx";
import { useAuth } from "../../hooks/useAuth.js";

// left rail: brand mark, signed-in user card, then the role's nav list —
// same shape as the reference (logo / profile / MENU UTAMA / items), with
// the active item's icon sitting in a filled chip instead of a plain glyph.
//
// Mobile behavior: below the lg breakpoint this becomes a fixed off-canvas
// drawer that slides in from the left (translate-x based) instead of always
// taking up screen width. `isOpen` / `onClose` control that drawer state;
// on lg+ screens it's simply always visible as a static column.
export default function Sidebar({ role, isOpen = false, onClose = () => {} }) {
  const { currentUser, logOut } = useAuth();
  const location = useLocation();
  const navItems = roleNavConfig[role] || [];
  const basePath = `/app/${role}`;

  const isItemActive = (itemPath) => {
    const fullPath = itemPath ? `${basePath}/${itemPath}` : basePath;
    return location.pathname === fullPath;
  };

  return (
      <aside
          className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-surface transition-transform duration-300 ease-in-out dark:bg-ink/60 dark:border-white/10 lg:static lg:z-auto lg:translate-x-0 ${
              isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between gap-2.5 px-6 py-6">
          <div className="flex items-center gap-2.5">
            <Logo size={34} />
            <span className="font-display text-lg font-semibold">AleBaple</span>
          </div>
          <button
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-black/5 dark:hover:bg-white/5 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mx-4 flex items-center gap-3 rounded-xl border border-border p-3 dark:border-white/10">
        <span className="shrink-0 rounded-full ring-2 ring-brand-100 dark:ring-brand-500/30">
          <Avatar name={currentUser?.name || "Guest"} imageUrl={currentUser?.avatarUrl} />
        </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{currentUser?.name || "Guest"}</p>
            <p className="truncate text-xs capitalize text-muted">{role}</p>
          </div>
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto px-4">
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Main menu
          </p>
          <ul className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const fullPath = item.path ? `${basePath}/${item.path}` : basePath;
              const Icon = item.icon;
              const active = isItemActive(item.path);
              return (
                  <li key={item.label}>
                    <NavLink
                        to={fullPath}
                        end={item.path === ""}
                        onClick={onClose}
                        className={`flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm transition ${
                            active
                                ? "bg-brand-50 font-medium text-brand-700 dark:bg-white/10 dark:text-brand-300"
                                : "text-ink/70 hover:bg-black/5 dark:text-canvas/70 dark:hover:bg-white/5"
                        }`}
                    >
                  <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition ${
                          active ? "bg-brand-500 text-white" : "text-ink/45 dark:text-canvas/45"
                      }`}
                  >
                    <Icon size={15} />
                  </span>
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
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm text-danger hover:bg-danger/5"
          >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-danger/70">
            <LogOut size={15} />
          </span>
            Log out
          </button>
        </div>
      </aside>
  );
}
