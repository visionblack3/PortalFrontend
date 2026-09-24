const STYLES = {
  APPLIED: "status--applied",
  SHORTLISTED: "status--shortlisted",
  ACCEPTED: "status--accepted",
  REJECTED: "status--rejected",
  HIRED: "status--hired",
};

export default function StatusBadge({ status }) {
  const cls = STYLES[status] || "status--applied";
  return <span className={`status ${cls}`}>{status}</span>;
}
