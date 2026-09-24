import { useEffect, useState } from "react";
import * as adminApi from "../../api/adminApi";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { formatDateTime } from "../../lib/format";

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi
      .getAllApplications()
      .then(setApps)
      .catch((err) => setError(err.message || "Could not load applications."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1>All applications</h1>
        <p>Every application submitted across every posting, for visibility only.</p>
      </div>

      {loading && <Loader label="Loading applications…" />}
      {!loading && error && <EmptyState title="Couldn't load applications" body={error} />}
      {!loading && !error && apps.length === 0 && <EmptyState title="No applications yet" />}

      {!loading && !error && apps.length > 0 && (
        <ul className="record-list">
          {apps.map((app) => (
            <li key={app.id} className="record-row">
              <div className="record-row__main">
                <h3>{app.job?.title || "Job posting removed"}</h3>
                <p className="record-row__meta">
                  {app.seeker?.name} ({app.seeker?.email}) applied to {app.job?.companyName}
                </p>
                <p className="record-row__timestamp">Applied {formatDateTime(app.appliedAt)}</p>
              </div>
              <div className="record-row__side">
                <StatusBadge status={app.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
