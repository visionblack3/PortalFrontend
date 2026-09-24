import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roleLabel } from "../lib/roles";

const LINKS_BY_ROLE = {
  JOB_SEEKER: [
    { to: "/jobs", label: "Browse jobs" },
    { to: "/applications", label: "My applications" },
  ],
  EMPLOYER: [
    { to: "/employer/jobs", label: "My postings" },
    { to: "/employer/jobs/new", label: "Post a job" },
  ],
  ADMIN: [
    { to: "/admin/jobs", label: "All jobs" },
    { to: "/admin/applications", label: "All applications" },
  ],
};

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const links = isAuthenticated ? LINKS_BY_ROLE[user.role] || [] : [];

  return (
    <header className="nav">
      <div className="nav__inner">
        <NavLink to="/" className="nav__brand">
          CareerNest
        </NavLink>

        {links.length > 0 && (
          <nav className="nav__links" aria-label="Primary">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => "nav__link" + (isActive ? " nav__link--active" : "")}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="nav__account">
          {isAuthenticated ? (
            <>
              <span className="nav__user">
                <span className="nav__user-name">{user.name}</span>
                <span className={`nav__role-chip nav__role-chip--${user.role.toLowerCase()}`}>
                  {roleLabel(user.role)}
                </span>
              </span>
              <button type="button" className="btn btn--ghost btn--small" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn--ghost btn--small">
                Log in
              </NavLink>
              <NavLink to="/register" className="btn btn--primary btn--small">
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
