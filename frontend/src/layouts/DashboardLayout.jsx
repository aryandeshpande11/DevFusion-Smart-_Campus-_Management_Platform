import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar.jsx";
import Topbar from "../components/layout/Topbar.jsx";

// shell every role dashboard renders inside — sidebar on the left,
// topbar + the active page's content (via Outlet) on the right
export default function DashboardLayout({ role }) {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas dark:bg-ink">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Topbar />
        <main className="flex-1 px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
