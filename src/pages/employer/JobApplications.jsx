import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as employerApi from "../../api/employerApi";
import { useToast } from "../../context/ToastContext";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import StatusSelect from "../../components/StatusSelect";
import { formatDateTime } from "../../lib/format";

export default function JobApplications() {
  const { jobId } = useParams();
  const { notify } = useToast();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    employerApi
      .getApplicationsForJob(jobId)
      .then(setApps)
      .catch((err) => setError(err.message || "Could not load applications."))
      .finally(() => setLoading(false));
  }, [jobId]);

  async function handleStatusChange(applicationId, status) {
    const previous = apps;
    setApps((prev) => prev.map((a) => (a.id === applicationId ? { ...a, status } : a)));
    setSavingId(applicationId);
    try {
      await employerApi.updateApplicantStatus(applicationId, status);
      notify("Status updated.", "success");
    } catch (err) {
      setApps(previous);
      notify(err.message || "Could not update status.", "error");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <Link to="/employer/jobs" className="auth-link">
          ← Back to my postings
        </Link>
        <h1>Applicants</h1>
        <p>Move each applicant through your pipeline as you review them.</p>
      </div>

      {loading && <Loader label="Loading applicants…" />}
      {!loading && error && <EmptyState title="Couldn't load applicants" body={error} />}
      {!loading && !error && apps.length === 0 && (
        <EmptyState title="No applicants yet" body="Check back once candidates start applying." />
      )}

      {!loading && !error && apps.length > 0 && (
        <ul className="record-list">
          {apps.map((app) => (
            <li key={app.id} className="record-row">
              <div className="record-row__main">
                <h3>{app.seeker?.name || "Applicant"}</h3>
                <p className="record-row__meta">
                  {app.seeker?.email}
                  {app.seeker?.phone ? <> &nbsp;·&nbsp; {app.seeker.phone}</> : null}
                </p>
                {app.coverLetter && <p className="record-row__note">{app.coverLetter}</p>}
                <p className="record-row__timestamp">Applied {formatDateTime(app.appliedAt)}</p>
              </div>
              <div className="record-row__side record-row__side--actions">
                {app.resumeUrl && (
                  <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="auth-link">
                    View resume
                  </a>
                )}
                <StatusSelect
                  value={app.status}
                  disabled={savingId === app.id}
                  onChange={(status) => handleStatusChange(app.id, status)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
