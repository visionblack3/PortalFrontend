import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { roleHome } from "../lib/roles";
import AuthLayout from "./AuthLayout";

export default function Login() {
  const { login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login({ email, password });
      notify(`Welcome back, ${user.name.split(" ")[0]}.`, "success");
      const redirectTo = location.state?.from?.pathname || roleHome(user.role);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Could not log in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      headline="Good to see you again."
      body="Log in to track applications, manage postings, or keep the board tidy — whatever your seat here is for."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
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

        <label className="field">
          <span>Password</span>
          <input
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <div className="auth-form__row">
          <Link to="/forgot-password" className="auth-link">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="btn btn--primary btn--full" disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="auth-switch">
        New to CareerNest? <Link to="/register">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
