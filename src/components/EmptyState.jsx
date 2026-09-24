export default function EmptyState({ title, body, action }) {
  return (
    <div className="empty-state">
      <p className="empty-state__title">{title}</p>
      {body && <p className="empty-state__body">{body}</p>}
      {action}
    </div>
  );
}
