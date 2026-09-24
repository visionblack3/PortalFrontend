import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as adminApi from "../../api/adminApi";
import { useToast } from "../../context/ToastContext";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import { formatDate, formatJobType, isPastDeadline } from "../../lib/format";

export default function AdminJobs() {
  const { notify } = useToast();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  function load() {
    setLoading(true);
    adminApi
      .getAllJobs()
      .then(setJobs)
      .catch((err) => setError(err.message || "Could not load jobs."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(job) {
    if (!window.confirm(`Remove "${job.title}" from the board?`)) return;
    setDeletingId(job.id);
    try {
      await adminApi.deleteJob(job.id);
      notify("Job removed.", "success");
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
    } catch (err) {
      notify(err.message || "Could not remove this job.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1>All jobs</h1>
        <p>Every posting on the board, across every employer.</p>
      </div>

      {loading && <Loader label="Loading jobs…" />}
      {!loading && error && <EmptyState title="Couldn't load jobs" body={error} />}
      {!loading && !error && jobs.length === 0 && <EmptyState title="No jobs posted yet" />}

      {!loading && !error && jobs.length > 0 && (
        <ul className="record-list">
          {jobs.map((job) => {
            const closed = isPastDeadline(job.deadline);
            return (
              <li key={job.id} className="record-row">
                <div className="record-row__main">
                  <h3>{job.title}</h3>
                  <p className="record-row__meta">
                    {job.companyName} &nbsp;·&nbsp; {job.location}
                    {job.jobType ? <> &nbsp;·&nbsp; {formatJobType(job.jobType)}</> : null}
                  </p>
                  <p className="record-row__timestamp">
                    Posted by {job.employer?.name || "unknown employer"} ({job.employer?.email})
                    {job.deadline ? (closed ? ` · Closed ${formatDate(job.deadline)}` : ` · Open until ${formatDate(job.deadline)}`) : ""}
                  </p>
                </div>
                <div className="record-row__side record-row__side--actions">
                  <button
                    type="button"
                    className="btn btn--ghost btn--small"
                    onClick={() => navigate(`/admin/jobs/${job.id}/edit`, { state: { job } })}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn--danger btn--small"
                    onClick={() => handleDelete(job)}
                    disabled={deletingId === job.id}
                  >
                    {deletingId === job.id ? "Removing…" : "Remove"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
