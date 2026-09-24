const STATUSES = ["APPLIED", "SHORTLISTED", "ACCEPTED", "REJECTED", "HIRED"];

export default function StatusSelect({ value, onChange, disabled }) {
  return (
    <select
      className={`status-select status-select--${value?.toLowerCase()}`}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
