import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as adminApi from "../../api/adminApi";
import { useToast } from "../../context/ToastContext";
import JobFormFields from "../../components/JobFormFields";
import Loader from "../../components/Loader";

function toFormValues(job) {
  return {
    title: job.title || "",
    description: job.description || "",
    companyName: job.companyName || "",
    location: job.location || "",
    jobType: job.jobType || "",
    salaryRange: job.salaryRange ?? "",
    deadline: job.deadline || "",
  };
}

export default function AdminJobEditPage() {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { notify } = useToast();

  const [values, setValues] = useState(location.state?.job ? toFormValues(location.state.job) : null);
  const [loading, setLoading] = useState(!location.state?.job);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.job) return;
    adminApi
      .getAllJobs()
      .then((jobs) => {
        const job = jobs.find((j) => String(j.id) === String(jobId));
        if (!job) throw new Error("Job not found.");
        setValues(toFormValues(job));
      })
      .catch((err) => setError(err.message || "Could not load this job."))
      .finally(() => setLoading(false));
  }, [jobId, location.state]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const payload = {
      ...values,
      salaryRange: values.salaryRange === "" ? null : Number(values.salaryRange),
      deadline: values.deadline || null,
    };
    try {
      await adminApi.updateJob(jobId, payload);
      notify("Job posting updated.", "success");
      navigate("/admin/jobs");
    } catch (err) {
      setError(err.message || "Could not save this job.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !values) {
    return (
      <div className="page-shell">
        {loading ? <Loader label="Loading job…" /> : <p className="form-error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="page-shell page-shell--narrow">
      <div className="page-header">
        <h1>Edit job posting</h1>
        <p>Moderate the listing on behalf of the employer.</p>
      </div>

      <form className="panel-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <JobFormFields values={values} onChange={setValues} />
        <div className="panel-form__actions">
          <button type="button" className="btn btn--ghost" onClick={() => navigate("/admin/jobs")}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
