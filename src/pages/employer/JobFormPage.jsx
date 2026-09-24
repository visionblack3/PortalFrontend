import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as employerApi from "../../api/employerApi";
import { useToast } from "../../context/ToastContext";
import JobFormFields from "../../components/JobFormFields";
import Loader from "../../components/Loader";

const EMPTY = {
  title: "",
  description: "",
  companyName: "",
  location: "",
  jobType: "",
  salaryRange: "",
  deadline: "",
};

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

export default function JobFormPage() {
  const { jobId } = useParams();
  const isEdit = Boolean(jobId);
  const location = useLocation();
  const navigate = useNavigate();
  const { notify } = useToast();

  const [values, setValues] = useState(location.state?.job ? toFormValues(location.state.job) : EMPTY);
  const [loading, setLoading] = useState(isEdit && !location.state?.job);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit || location.state?.job) return;
    // Direct navigation to the edit URL without list context: refetch and locate the job.
    employerApi
      .getMyPostedJobs()
      .then((jobs) => {
        const job = jobs.find((j) => String(j.id) === String(jobId));
        if (!job) throw new Error("Job not found among your postings.");
        setValues(toFormValues(job));
      })
      .catch((err) => setError(err.message || "Could not load this job."))
      .finally(() => setLoading(false));
  }, [isEdit, jobId, location.state]);

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
      if (isEdit) {
        await employerApi.updateJob(jobId, payload);
        notify("Job posting updated.", "success");
      } else {
        await employerApi.postJob(payload);
        notify("Job posted.", "success");
      }
      navigate("/employer/jobs");
    } catch (err) {
      setError(err.message || "Could not save this job.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="page-shell">
        <Loader label="Loading job…" />
      </div>
    );
  }

  return (
    <div className="page-shell page-shell--narrow">
      <div className="page-header">
        <h1>{isEdit ? "Edit job posting" : "Post a job"}</h1>
        <p>{isEdit ? "Update the details candidates see." : "Fill in the role. It goes live immediately."}</p>
      </div>

      <form className="panel-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <JobFormFields values={values} onChange={setValues} />
        <div className="panel-form__actions">
          <button type="button" className="btn btn--ghost" onClick={() => navigate("/employer/jobs")}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? "Saving…" : isEdit ? "Save changes" : "Post job"}
          </button>
        </div>
      </form>
    </div>
  );
}
