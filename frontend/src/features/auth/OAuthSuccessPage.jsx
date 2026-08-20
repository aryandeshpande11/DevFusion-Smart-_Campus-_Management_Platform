import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { fetchLoggedInUser } from "../../api/authApi.js";

// Landed on after the backend finishes the Google OAuth redirect flow:
// GET /api/auth/google -> Google consent -> GET /api/auth/google/callback
// -> backend redirects here as `${CLIENT_URL}/oauth-success?accessToken=<jwt>`
//
// This page just needs to: grab the token from the URL, store it, fetch
// the user it belongs to, start the session, then send them into the app
// the same way a normal email/password login does.
export default function OAuthSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const startSession = useAuthStore((state) => state.startSession);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const accessToken = searchParams.get("accessToken");

        if (!accessToken) {
            setErrorMessage("Missing sign-in token. Please try again.");
            setTimeout(() => navigate("/login", { replace: true }), 1500);
            return;
        }

        // strip the token out of the visible URL right away so it's not left
        // sitting in the address bar / browser history
        window.history.replaceState({}, document.title, "/oauth-success");

        (async () => {
            try {
                // interceptor in axiosClient reads the token from the store, so it
                // has to be set before we call any authenticated endpoint
                setAccessToken(accessToken);
                const user = await fetchLoggedInUser();
                startSession(user, accessToken);
                navigate(`/app/${user.role}`, { replace: true });
            } catch (error) {
                setErrorMessage("Couldn't complete Google sign-in. Please try again.");
                setTimeout(() => navigate("/login", { replace: true }), 1500);
            }
        })();
    }, [searchParams, navigate, setAccessToken, startSession]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <p className="text-sm text-muted">
                {errorMessage || "Finishing sign-in…"}
            </p>
        </div>
    );
}