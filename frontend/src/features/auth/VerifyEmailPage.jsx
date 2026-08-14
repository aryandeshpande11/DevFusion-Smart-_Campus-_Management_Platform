import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { MailCheck } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import Button from "../../components/common/Button.jsx";
import { resendVerificationEmail } from "../../api/authApi.js";

// shown right after signup — dashboard stays locked until the emailed
// link is clicked, so this page just offers a resend action.
// the email comes from router state (set right after signup), NOT from
// the auth store — signup never logs the person in, so the auth store
// may still hold a stale, previously-logged-in account's email here.
export default function VerifyEmailPage() {
  const location = useLocation();
  const emailFromSignup = location.state?.email;

  const [manualEmail, setManualEmail] = useState("");
  const [hasResent, setHasResent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const targetEmail = emailFromSignup || manualEmail;

  const handleResend = async () => {
    if (!targetEmail) return;
    setErrorMessage("");
    setIsSending(true);
    try {
      await resendVerificationEmail(targetEmail);
      setHasResent(true);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Couldn't resend the email.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AuthLayout title="Check your inbox" subtitle="One more step before your dashboard unlocks.">
      <div className="flex flex-col items-center gap-4 rounded-card border border-border p-6 text-center dark:border-white/10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-white/5">
          <MailCheck size={22} />
        </span>

        {emailFromSignup ? (
          <p className="text-sm text-muted">
            We sent a verification link to <strong className="text-ink dark:text-canvas">{emailFromSignup}</strong>.
            Open it to activate your account.
          </p>
        ) : (
          <>
            <p className="text-sm text-muted">
              Enter the email you signed up with to resend the verification link.
            </p>
            <input
              type="email"
              required
              placeholder="name@college.edu"
              className="fieldInput w-full"
              value={manualEmail}
              onChange={(event) => setManualEmail(event.target.value)}
            />
          </>
        )}

        {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}

        <Button variant="outline" onClick={handleResend} isLoading={isSending} disabled={!targetEmail}>
          {hasResent ? "Sent again" : "Resend email"}
        </Button>
      </div>
    </AuthLayout>
  );
}
