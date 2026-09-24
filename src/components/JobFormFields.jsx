const JOB_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "REMOTE"];

export default function JobFormFields({ values, onChange }) {
  function set(field, value) {
    onChange({ ...values, [field]: value });
  }

  return (
    <div className="form-grid">
      <label className="field field--span2">
        <span>Job title</span>
        <input
          required
          type="text"
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. Senior Backend Engineer"
        />
      </label>

      <label className="field">
        <span>Company name</span>
        <input
          required
          type="text"
          value={values.companyName}
          onChange={(e) => set("companyName", e.target.value)}
        />
      </label>

      <label className="field">
        <span>Location</span>
        <input
          required
          type="text"
          value={values.location}
          onChange={(e) => set("location", e.target.value)}
          placeholder="e.g. Bengaluru or Remote"
        />
      </label>

      <label className="field">
        <span>Job type</span>
        <select value={values.jobType} onChange={(e) => set("jobType", e.target.value)}>
          <option value="">Select type</option>
          {JOB_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Annual salary (₹, optional)</span>
        <input
          type="number"
          min="0"
          step="1000"
          value={values.salaryRange}
          onChange={(e) => set("salaryRange", e.target.value)}
        />
      </label>

      <label className="field">
        <span>Application deadline (optional)</span>
        <input type="date" value={values.deadline} onChange={(e) => set("deadline", e.target.value)} />
      </label>

      <label className="field field--span2">
        <span>Description</span>
        <textarea
          required
          rows={6}
          maxLength={2000}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Responsibilities, requirements, and what makes this role worth applying to."
        />
      </label>
    </div>
  );
}
