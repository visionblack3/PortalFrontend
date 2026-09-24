export default function Loader({ label = "Loading" }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader__mark" aria-hidden="true" />
      {label}
    </div>
  );
}
