import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authApi from "../api/authApi";
import { useToast } from "../context/ToastContext";
import AuthLayout from "./AuthLayout";

export default function ForgotPassword() {
  const { notify } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState("request"); // "request" | "reset"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleRequestOtp(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await authApi.sendResetOtp(email);
      notify("OTP sent to your registered phone number.", "success");
      setStep("reset");
    } catch (err) {
      setError(err.message || "Could not send an OTP.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await authApi.resetPassword({ email, otp, newPassword });
      notify("Password updated. Log in with your new password.", "success");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Could not reset the password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      headline="Let's get you back in."
      body="We'll text a one-time code to the phone number on your account. It's valid for five minutes."
    >
      {step === "request" ? (
        <form className="auth-form" onSubmit={handleRequestOtp}>
          {error && <p className="form-error">{error}</p>}
          <label className="field">
            <span>Email</span>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <button type="submit" className="btn btn--primary btn--full" disabled={submitting}>
            {submitting ? "Sending…" : "Send OTP"}
          </button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleReset}>
          {error && <p className="form-error">{error}</p>}
          <p className="auth-form__hint">Code sent to the phone on file for {email}.</p>
          <label className="field">
            <span>6-digit OTP</span>
            <input
              required
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          </label>
          <label className="field">
            <span>New password</span>
            <input
              required
              minLength={6}
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
          <button type="submit" className="btn btn--primary btn--full" disabled={submitting}>
            {submitting ? "Updating…" : "Reset password"}
          </button>
          <button type="button" className="btn btn--ghost btn--full" onClick={() => setStep("request")}>
            Use a different email
          </button>
        </form>
      )}

      <p className="auth-switch">
        Remembered it? <Link to="/login">Back to log in</Link>
      </p>
    </AuthLayout>
  );
}
