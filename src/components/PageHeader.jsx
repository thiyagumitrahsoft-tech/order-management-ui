export default function PageHeader({ title, description, action }) {
  return (
    <div className="d-flex justify-content-between align-items-start mb-4">
      <div>
        <h2 className="h4 mb-1">{title}</h2>
        {description && <p className="text-secondary mb-0">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
