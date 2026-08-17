export default function ErrorAlert({ error, onRetry = null, className = '' }) {
  if (!error) return null

  const errorMessage = error.response?.data?.message || error.message || 'An error occurred'

  return (
    <div className={`alert alert-danger d-flex justify-content-between align-items-center ${className}`} role="alert">
      <div>
        <strong>Error:</strong> {errorMessage}
      </div>
      {onRetry && (
        <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}
