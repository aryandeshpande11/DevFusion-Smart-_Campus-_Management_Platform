import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar.jsx";
import Topbar from "../components/layout/Topbar.jsx";

// shell every role dashboard renders inside — sidebar on the left,
// topbar + the active page's content (via Outlet) on the right.
// Two faint blurred shapes echo the landing hero (same blue/gold pairing)
// so the dashboard reads as the same product — kept low-opacity and fixed
// in the corners so they never sit behind text or compete with real content.
export default function DashboardLayout({ role }) {
    return (
        <div className="flex h-screen overflow-hidden bg-canvas dark:bg-ink">
            <Sidebar role={role} />
            <div className="relative flex flex-1 flex-col overflow-y-auto">
                <div className="pointer-events-none fixed -right-24 -top-24 h-72 w-72 rounded-full bg-brand-100 opacity-40 blur-3xl dark:opacity-10" />
                <div className="pointer-events-none fixed -bottom-28 right-1/3 h-64 w-64 rounded-full bg-gold-100 opacity-30 blur-3xl dark:opacity-10" />
                <Topbar />
                <main className="relative flex-1 px-8 py-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}