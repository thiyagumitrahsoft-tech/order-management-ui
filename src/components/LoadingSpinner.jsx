export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-secondary">{message}</p>
    </div>
  )
}
