import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { inventoryApi } from '../../api/inventoryApi'

export default function StockUpdateDrawer({ show, product, inventory, onClose, onSave }) {
  const [quantity, setQuantity] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (inventory) {
      setQuantity(inventory.availableQuantity || 0)
    }
    setError('')
  }, [inventory, show])

  const handleChange = (e) => {
    const value = parseInt(e.target.value) || 0
    if (value < 0) {
      setError('Quantity cannot be negative')
    } else {
      setError('')
    }
    setQuantity(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (quantity < 0) {
      setError('Quantity cannot be negative')
      return
    }

    setLoading(true)
    try {
      await inventoryApi.updateStock(product.id, { availableQuantity: quantity })
      toast.success('Stock updated successfully')
      await onSave()
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update stock'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (!show || !product) return null

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-sm">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Stock: {product.name}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {inventory ? (
                <>
                  <p className="text-muted mb-3">
                    Current Stock: <strong>{inventory.availableQuantity} units</strong>
                  </p>
                  <div className="mb-3">
                    <label className="form-label">New Quantity *</label>
                    <input
                      type="number"
                      min="0"
                      className={`form-control ${error ? 'is-invalid' : ''}`}
                      value={quantity}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {error && <div className="invalid-feedback d-block">{error}</div>}
                  </div>
                </>
              ) : (
                <p className="text-muted">Loading inventory data...</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading || !inventory}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Updating...
                  </>
                ) : (
                  'Update'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
