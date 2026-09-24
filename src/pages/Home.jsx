import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roleHome } from "../lib/roles";

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={roleHome(user.role)} replace />;
  }

  return (
    <div className="landing">
      <div className="landing__intro">
        <p className="landing__mark">CareerNest</p>
        <h1 className="landing__headline">
          A quieter way to move between
          <br />
          the right role and the right hire.
        </h1>
        <p className="landing__body">
          One board for job seekers tracking applications, employers running a hiring
          pipeline, and admins keeping the listings honest.
        </p>
        <div className="landing__actions">
          <Link to="/register" className="btn btn--primary">
            Create an account
          </Link>
          <Link to="/login" className="btn btn--ghost">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
