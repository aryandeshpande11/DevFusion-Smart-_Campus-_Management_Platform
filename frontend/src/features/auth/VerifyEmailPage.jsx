import React, { useState } from "react";
import { MailCheck } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import Button from "../../components/common/Button.jsx";
import { resendVerificationEmail } from "../../api/authApi.js";
import { useAuth } from "../../hooks/useAuth.js";

// shown right after signup — dashboard stays locked until the emailed
// link is clicked, so this page just offers a resend action
export default function VerifyEmailPage() {
  const { currentUser } = useAuth();
  const [hasResent, setHasResent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleResend = async () => {
    setIsSending(true);
    try {
      await resendVerificationEmail(currentUser?.email);
      setHasResent(true);
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
        <p className="text-sm text-muted">
          We sent a verification link to <strong className="text-ink dark:text-canvas">{currentUser?.email}</strong>.
          Open it to activate your account.
        </p>
        <Button variant="outline" onClick={handleResend} isLoading={isSending}>
          {hasResent ? "Sent again" : "Resend email"}
        </Button>
      </div>
    </AuthLayout>
  );
}
