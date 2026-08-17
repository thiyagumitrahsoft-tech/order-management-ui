export default function EmptyState({ title, message, icon = '📭' }) {
  return (
    <div className="text-center py-5">
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h5 className="text-secondary">{title}</h5>
      <p className="text-muted mb-0">{message}</p>
    </div>
  )
}
