import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as employerApi from "../../api/employerApi";
import { useToast } from "../../context/ToastContext";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import { formatDate, formatJobType, isPastDeadline } from "../../lib/format";

export default function MyJobs() {
  const { notify } = useToast();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  function load() {
    setLoading(true);
    employerApi
      .getMyPostedJobs()
      .then(setJobs)
      .catch((err) => setError(err.message || "Could not load your postings."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(job) {
    if (!window.confirm(`Delete "${job.title}"? This can't be undone.`)) return;
    setDeletingId(job.id);
    try {
      await employerApi.deleteJob(job.id);
      notify("Job posting deleted.", "success");
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
    } catch (err) {
      notify(err.message || "Could not delete this job.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="page-shell">
      <div className="page-header page-header--with-action">
        <div>
          <h1>My postings</h1>
          <p>Everything you've listed, open or closed.</p>
        </div>
        <Link to="/employer/jobs/new" className="btn btn--primary">
          Post a job
        </Link>
      </div>

      {loading && <Loader label="Loading your postings…" />}
      {!loading && error && <EmptyState title="Couldn't load postings" body={error} />}
      {!loading && !error && jobs.length === 0 && (
        <EmptyState
          title="No postings yet"
          body="Post your first role to start receiving applications."
          action={
            <Link to="/employer/jobs/new" className="btn btn--primary btn--small">
              Post a job
            </Link>
          }
        />
      )}

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
                    {job.deadline
                      ? closed
                        ? `Closed ${formatDate(job.deadline)}`
                        : `Open until ${formatDate(job.deadline)}`
                      : "No deadline set"}
                  </p>
                </div>
                <div className="record-row__side record-row__side--actions">
                  <button
                    type="button"
                    className="btn btn--ghost btn--small"
                    onClick={() => navigate(`/employer/jobs/${job.id}/applications`)}
                  >
                    View applications
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost btn--small"
                    onClick={() => navigate(`/employer/jobs/${job.id}/edit`, { state: { job } })}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn--danger btn--small"
                    onClick={() => handleDelete(job)}
                    disabled={deletingId === job.id}
                  >
                    {deletingId === job.id ? "Deleting…" : "Delete"}
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
