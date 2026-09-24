export default function AuthLayout({ headline, body, children }) {
  return (
    <div className="auth-shell">
      <div className="auth-shell__intro">
        <p className="auth-shell__mark">CareerNest</p>
        <h1 className="auth-shell__headline">{headline}</h1>
        <p className="auth-shell__body">{body}</p>
        <dl className="auth-shell__stats">
        </dl>
      </div>
      <div className="auth-shell__panel">
        <div className="auth-shell__card">{children}</div>
      </div>
    </div>
  );
}
