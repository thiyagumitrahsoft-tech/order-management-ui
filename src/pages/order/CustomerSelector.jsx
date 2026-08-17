export default function CustomerSelector({ customers, selectedCustomer, onSelect, loading }) {
  return (
    <div className="card">
      <div className="card-body">
        <label className="form-label fw-semibold">Select Customer</label>
        <select
          className="form-select"
          value={selectedCustomer?.id || ''}
          onChange={(e) => {
            const customer = customers.find((c) => c.id === parseInt(e.target.value))
            onSelect(customer || null)
          }}
          disabled={loading}
        >
          <option value="">-- Choose a customer --</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} ({customer.email})
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
