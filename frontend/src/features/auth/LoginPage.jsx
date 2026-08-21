import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import Button from "../../components/common/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";

// email + password login, with a Google button stubbed for OAuth wiring
export default function LoginPage() {
    const { logIn } = useAuth();
    const location = useLocation();
    const prefillEmail = location.state?.email || "";
    const justSignedUp = Boolean(location.state?.justSignedUp);
    const [formValues, setFormValues] = useState({ email: prefillEmail, password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = (fieldName) => (event) =>
        setFormValues((current) => ({ ...current, [fieldName]: event.target.value }));

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);
        try {
            await logIn(formValues);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Couldn't log you in. Check your details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout title="Log in" subtitle="Welcome back — pick up right where you left off.">
            <div className="mb-5 rounded-lg border border-border bg-canvas px-3.5 py-2.5 text-xs text-muted">
                {justSignedUp ? (
                    <>
                        <span className="font-medium text-ink">Account created.</span> Enter your password
                        to log in.
                    </>
                ) : (
                    <>
                        First time here? <span className="font-medium text-ink">Continue with Google</span> is
                        the quickest way in, or create an account with any college email.
                    </>
                )}
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="mb-1.5 block text-sm font-medium">College email</label>
                    <input
                        type="email"
                        required
                        placeholder="name@college.edu"
                        className="fieldInput"
                        value={formValues.email}
                        onChange={updateField("email")}
                    />
                </div>
                <div>
                    <div className="mb-1.5 flex items-center justify-between">
                        <label className="text-sm font-medium">Password</label>
                        <Link to="/forgot-password" className="text-xs text-brand-600 hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className="fieldInput"
                        value={formValues.password}
                        onChange={updateField("password")}
                    />
                </div>

                {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}

                <Button type="submit" fullWidth isLoading={isSubmitting}>
                    Log in
                </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-muted">
                <span className="h-px flex-1 bg-border" />
                or
                <span className="h-px flex-1 bg-border" />
            </div>

            <Button
                type="button"
                variant="outline"
                fullWidth
                className="border-2 border-emerald-500/60 hover:border-emerald-500"
                onClick={() => {
                    // full-page redirect (not a fetch call) — kicks off the backend's
                    // passport/Google OAuth flow, which redirects back to /oauth-success
                    const apiBaseUrl = import.meta.env.VITE_API_URL || "/api";
                    window.location.href = `${apiBaseUrl}/auth/google`;
                }}
            >
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62Z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18Z"/>
                    <path fill="#FBBC05" d="M3.95 10.7a5.4 5.4 0 0 1 0-3.4V4.97H.96a9 9 0 0 0 0 8.06l2.99-2.33Z"/>
                    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.98 8.98 0 0 0 9 0 9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58Z"/>
                </svg>
                Continue with Google
            </Button>
            <p className="mt-2 text-center text-xs text-muted">Fastest login — no password needed</p>

            <p className="mt-6 text-center text-sm text-muted">
                New here?{" "}
                <Link to="/signup" className="font-medium text-brand-600 hover:underline">
                    Create an account
                </Link>
            </p>
        </AuthLayout>
    );
}