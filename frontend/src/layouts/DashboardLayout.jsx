import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar.jsx";
import Topbar from "../components/layout/Topbar.jsx";
import WelcomeOverlay from "../components/common/WelcomeOverlay.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useUiStore } from "../store/uiStore.js";

// shell every role dashboard renders inside — sidebar on the left,
// topbar + the active page's content (via Outlet) on the right.
// Two faint blurred shapes echo the landing hero (same blue/gold pairing)
// so the dashboard reads as the same product — kept low-opacity and fixed
// in the corners so they never sit behind text or compete with real content.
//
// On mobile, the sidebar is an off-canvas drawer (see Sidebar.jsx) rather
// than a static column, so it doesn't eat the whole screen. `isMobileSidebarOpen`
// tracks that drawer state; a click on the backdrop or a nav link closes it.
export default function DashboardLayout({ role }) {
    const location = useLocation();
    const { currentUser } = useAuth();
    const isDarkMode = useUiStore((state) => state.isDarkMode);
    // login flows set this router-state flag (not persisted anywhere), so it
    // only fires once right after signing in — never on refresh or revisit
    const [showWelcome, setShowWelcome] = useState(Boolean(location.state?.justLoggedIn));
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        // the `dark` class is applied only to this dashboard subtree, never to
        // <html> — login/signup/landing are light-only by design and must never
        // inherit it, even when the user turns dark mode on and then logs out
        <div className={isDarkMode ? "dark" : ""}>
            <div className="flex h-screen overflow-hidden bg-canvas text-ink dark:bg-ink dark:text-canvas">
                {showWelcome && (
                    <WelcomeOverlay
                        name={currentUser?.name?.split(" ")[0]}
                        onDone={() => setShowWelcome(false)}
                    />
                )}

                {/* backdrop: only rendered on mobile while the drawer is open,
                    tapping it closes the sidebar same as tapping outside a modal */}
                {isMobileSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                        onClick={() => setIsMobileSidebarOpen(false)}
                        aria-hidden="true"
                    />
                )}

                <Sidebar
                    role={role}
                    isOpen={isMobileSidebarOpen}
                    onClose={() => setIsMobileSidebarOpen(false)}
                />
                <div className="relative flex flex-1 flex-col overflow-y-auto">
                    <div className="pointer-events-none fixed -right-24 -top-24 h-72 w-72 rounded-full bg-brand-100 opacity-40 blur-3xl dark:opacity-10" />
                    <div className="pointer-events-none fixed -bottom-28 right-1/3 h-64 w-64 rounded-full bg-gold-100 opacity-30 blur-3xl dark:opacity-10" />
                    <Topbar onMenuClick={() => setIsMobileSidebarOpen(true)} />
                    <main className="relative flex-1 px-4 py-6 sm:px-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
