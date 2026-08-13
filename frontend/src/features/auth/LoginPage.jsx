import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import Button from "../../components/common/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";

// email + password login, with a Google button stubbed for OAuth wiring
export default function LoginPage() {
  const { logIn } = useAuth();
  const [formValues, setFormValues] = useState({ email: "", password: "" });
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

      <Button variant="outline" fullWidth>
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted">
        New here?{" "}
        <Link to="/signup" className="font-medium text-brand-600 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
