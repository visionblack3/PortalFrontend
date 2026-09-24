import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page-shell">
      <div className="empty-state">
        <p className="empty-state__title">This page doesn't exist.</p>
        <p className="empty-state__body">Check the link, or head back to the board.</p>
        <Link to="/" className="btn btn--primary btn--small">
          Back home
        </Link>
      </div>
    </div>
  );
}
