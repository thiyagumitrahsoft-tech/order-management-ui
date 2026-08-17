import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { productApi } from '../../api/productApi'

export default function ProductModal({ show, onClose, onSave }) {
  const [formData, setFormData] = useState({ name: '', sku: '', price: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFormData({ name: '', sku: '', price: '' })
    setErrors({})
  }, [show])

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0'
    }
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: formData.name,
        sku: formData.sku || null,
        price: parseFloat(formData.price),
      }
      await productApi.create(payload)
      toast.success('Product created successfully')
      await onSave()
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create product'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">New Product</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">SKU (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.price && <div className="invalid-feedback d-block">{errors.price}</div>}
              </div>
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
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Creating...
                  </>
                ) : (
                  'Create Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
