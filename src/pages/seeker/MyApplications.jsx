import { useEffect, useState } from "react";
import * as seekerApi from "../../api/seekerApi";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { formatDateTime, formatJobType } from "../../lib/format";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    seekerApi
      .getMyApplications()
      .then(setApps)
      .catch((err) => setError(err.message || "Could not load your applications."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1>My applications</h1>
        <p>Every role you've applied to, and where it stands.</p>
      </div>

      {loading && <Loader label="Loading applications…" />}
      {!loading && error && <EmptyState title="Couldn't load applications" body={error} />}
      {!loading && !error && apps.length === 0 && (
        <EmptyState title="No applications yet" body="Once you apply to a role, it'll show up here." />
      )}

      {!loading && !error && apps.length > 0 && (
        <ul className="record-list">
          {apps.map((app) => (
            <li key={app.id} className="record-row">
              <div className="record-row__main">
                <h3>{app.job?.title || "Job posting removed"}</h3>
                <p className="record-row__meta">
                  {app.job?.companyName}
                  {app.job?.jobType ? <> &nbsp;·&nbsp; {formatJobType(app.job.jobType)}</> : null}
                </p>
                {app.coverLetter && <p className="record-row__note">{app.coverLetter}</p>}
                <p className="record-row__timestamp">Applied {formatDateTime(app.appliedAt)}</p>
              </div>
              <div className="record-row__side">
                <StatusBadge status={app.status} />
                {app.resumeUrl && (
                  <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="auth-link">
                    View resume
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
