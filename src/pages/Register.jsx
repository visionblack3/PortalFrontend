import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import AuthLayout from "./AuthLayout";

const ROLE_OPTIONS = [
  { value: "JOB_SEEKER", label: "Job seeker", hint: "Looking for a role" },
  { value: "EMPLOYER", label: "Employer", hint: "Hiring for a team" },
];

export default function Register() {
  const { register } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "JOB_SEEKER",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(form);
      notify("Account created. Log in to continue.", "success");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Could not create the account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      headline="Set up your seat at the table."
      body="Whether you're hunting for the next role or hiring for one, your account keeps everything in one place."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        <div className="role-picker" role="radiogroup" aria-label="Account type">
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={form.role === opt.value}
              className={"role-picker__option" + (form.role === opt.value ? " role-picker__option--active" : "")}
              onClick={() => set("role", opt.value)}
            >
              <span className="role-picker__label">{opt.label}</span>
              <span className="role-picker__hint">{opt.hint}</span>
            </button>
          ))}
        </div>

        <label className="field">
          <span>Full name</span>
          <input required type="text" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </label>

        <label className="field">
          <span>Phone</span>
          <input
            required
            type="tel"
            placeholder="+91XXXXXXXXXX"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            required
            minLength={6}
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
          />
        </label>

        <button type="submit" className="btn btn--primary btn--full" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
}
