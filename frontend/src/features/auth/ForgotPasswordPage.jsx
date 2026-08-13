import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import Button from "../../components/common/Button.jsx";
import { requestPasswordReset, verifyResetOtp, resetPassword } from "../../api/authApi.js";

// three-step flow in one page: enter email -> enter OTP -> set new password
export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      await requestPasswordReset(email);
      setStep("otp");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Couldn't send the code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      await verifyResetOtp(email, otp);
      setStep("newPassword");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "That code didn't match.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      await resetPassword({ email, otp, newPassword });
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Couldn't reset your password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Reset your password" subtitle="We'll send a 6-digit code to your college email.">
      {step === "email" && (
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="name@college.edu"
            className="fieldInput"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Send code
          </Button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
          <input
            required
            maxLength={6}
            placeholder="6-digit code"
            className="fieldInput tracking-[0.3em]"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
          />
          {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Verify code
          </Button>
        </form>
      )}

      {step === "newPassword" && (
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            required
            minLength={8}
            placeholder="New password"
            className="fieldInput"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
          {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Set new password
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        Remembered it after all?{" "}
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Back to log in
        </Link>
      </p>
    </AuthLayout>
  );
}
