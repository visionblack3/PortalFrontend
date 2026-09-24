import { useEffect, useState, useCallback } from "react";
import * as seekerApi from "../../api/seekerApi";
import { useToast } from "../../context/ToastContext";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import JobCard from "../../components/JobCard";

export default function BrowseJobs() {
  const { notify } = useToast();
  const [jobs, setJobs] = useState([]);
  const [appliedByJobId, setAppliedByJobId] = useState({});
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyingId, setApplyingId] = useState(null);

  const loadApplications = useCallback(async () => {
    try {
      const apps = await seekerApi.getMyApplications();
      const map = {};
      apps.forEach((a) => {
        if (a.job?.id) map[a.job.id] = a.status;
      });
      setAppliedByJobId(map);
    } catch {
      // Non-fatal: browsing still works without the applied-status overlay.
    }
  }, []);

  const loadJobs = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const hasFilters = params.keyword || params.location;
      const data = hasFilters ? await seekerApi.searchJobs(params) : await seekerApi.getAllActiveJobs();
      setJobs(data);
    } catch (err) {
      setError(err.message || "Could not load jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs({ keyword: "", location: "" });
    loadApplications();
  }, [loadJobs, loadApplications]);

  function handleSearch(e) {
    e.preventDefault();
    loadJobs({ keyword, location });
  }

  async function handleApply(jobId, payload) {
    setApplyingId(jobId);
    try {
      await seekerApi.applyForJob(jobId, payload);
      notify("Application submitted.", "success");
      setAppliedByJobId((prev) => ({ ...prev, [jobId]: "APPLIED" }));
    } catch (err) {
      notify(err.message || "Could not submit the application.", "error");
    } finally {
      setApplyingId(null);
    }
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1>Find your next role</h1>
        <p>Search open postings by title, company, or location.</p>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Title or company"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit" className="btn btn--primary">
          Search
        </button>
      </form>

      {loading && <Loader label="Loading jobs…" />}
      {!loading && error && <EmptyState title="Couldn't load jobs" body={error} />}
      {!loading && !error && jobs.length === 0 && (
        <EmptyState title="No matching jobs" body="Try a broader keyword or clear the location filter." />
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="job-list">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              appliedStatus={appliedByJobId[job.id]}
              onApply={handleApply}
              applying={applyingId === job.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
