import React, { useEffect, useState } from "react";
import Logo from "./Logo.jsx";

// Shown once, right after a fresh login (email/password or Google) — never
// blocks interaction and dismisses itself, so it can't get "stuck" if a
// render is slow. DashboardLayout only mounts this when it gets here via
// a `justLoggedIn` navigation flag, so refreshing the dashboard never
// re-triggers it.
export default function WelcomeOverlay({ name, onDone }) {
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        const startLeave = setTimeout(() => setIsLeaving(true), 1300);
        const finish = setTimeout(() => onDone?.(), 1750);
        return () => {
            clearTimeout(startLeave);
            clearTimeout(finish);
        };
    }, [onDone]);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-canvas/95 backdrop-blur-sm transition-opacity duration-300 dark:bg-ink/95 ${
                isLeaving ? "opacity-0" : "opacity-100"
            }`}
        >
            <div
                className="flex flex-col items-center gap-3 text-center"
                style={{ animation: "welcomePop 480ms cubic-bezier(0.22, 1, 0.36, 1)" }}
            >
                <Logo size={46} />
                <p className="font-display text-2xl font-semibold">
                    Welcome back{name ? `, ${name}` : ""}
                </p>
                <p className="text-sm text-muted">Getting your dashboard ready…</p>
            </div>
        </div>
    );
}