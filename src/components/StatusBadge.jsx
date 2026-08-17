import { STATUS_COLORS, STATUS_LABELS } from '../utils/constants'

export default function StatusBadge({ status, className = '' }) {
  const color = STATUS_COLORS[status] || 'secondary'
  const label = STATUS_LABELS[status] || status

  return (
    <span className={`badge bg-${color} ${className}`}>
      {label}
    </span>
  )
}
