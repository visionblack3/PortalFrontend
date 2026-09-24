import { useState } from "react";
import { formatDate, formatJobType, formatSalary, isPastDeadline } from "../lib/format";
import StatusBadge from "./StatusBadge";

export default function JobCard({ job, appliedStatus, onApply, applying }) {
  const [open, setOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const closed = isPastDeadline(job.deadline);
  const jobType = formatJobType(job.jobType);
  const salary = formatSalary(job.salaryRange);

  function handleSubmit(e) {
    e.preventDefault();
    onApply(job.id, { resumeUrl, coverLetter });
  }

  return (
    <article className={`job-row job-row--${(job.jobType || "").toLowerCase()}`}>
      <div className="job-row__main">
        <div className="job-row__headline">
          <h3 className="job-row__title">{job.title}</h3>
          {jobType && <span className="tag">{jobType}</span>}
        </div>
        <p className="job-row__meta">
          {job.companyName}
          {job.location ? <> &nbsp;·&nbsp; {job.location}</> : null}
        </p>
        <p className="job-row__desc">{job.description}</p>
        <div className="job-row__facts">
          {salary && <span>₹{salary} / yr</span>}
          {job.deadline && <span>{closed ? "Closed" : `Apply by ${formatDate(job.deadline)}`}</span>}
        </div>
      </div>

      <div className="job-row__action">
        {appliedStatus ? (
          <div className="job-row__applied">
            <StatusBadge status={appliedStatus} />
            <span className="job-row__applied-label">Applied</span>
          </div>
        ) : closed ? (
          <span className="job-row__closed">Applications closed</span>
        ) : open ? (
          <form className="apply-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Resume URL</span>
              <input
                type="url"
                placeholder="https://..."
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Cover letter</span>
              <textarea
                rows={3}
                maxLength={1000}
                placeholder="A few lines on why you're a fit"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </label>
            <div className="apply-form__actions">
              <button type="button" className="btn btn--ghost btn--small" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn--primary btn--small" disabled={applying}>
                {applying ? "Submitting…" : "Submit application"}
              </button>
            </div>
          </form>
        ) : (
          <button type="button" className="btn btn--primary btn--small" onClick={() => setOpen(true)}>
            View & apply
          </button>
        )}
      </div>
    </article>
  );
}
