export function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatJobType(jobType) {
  if (!jobType) return null;
  return jobType.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatSalary(value) {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function isPastDeadline(deadline) {
  if (!deadline) return false;
  const d = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}
