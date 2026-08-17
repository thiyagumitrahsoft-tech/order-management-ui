import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { productApi } from '../../api/productApi'
import { orderApi } from '../../api/orderApi'
import { inventoryApi } from '../../api/inventoryApi'
import { formatCurrency, calculateTotal } from '../../utils/formatCurrency'

export default function CreateOrderModal({ show, customer, onClose, onSuccess }) {
  const [items, setItems] = useState([])
  const [products, setProducts] = useState([])
  const [inventory, setInventory] = useState({})
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (show && products.length === 0) {
      handleLoadProducts()
    }
  }, [show])

  const handleLoadProducts = async () => {
    setLoadingProducts(true)
    try {
      const response = await productApi.list()
      setProducts(response.data || [])
    } catch (err) {
      toast.error('Failed to load products')
    } finally {
      setLoadingProducts(false)
    }
  }

  if (!show) return null

  const addItem = () => {
    if (products.length === 0) return
    const newItem = {
      id: Date.now(),
      productId: products[0].id,
      name: products[0].name,
      price: products[0].price,
      quantity: 1,
    }
    setItems([...items, newItem])
  }

  const removeItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId))
  }

  const updateItem = (itemId, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          if (field === 'productId') {
            const product = products.find((p) => p.id === parseInt(value))
            return {
              ...item,
              productId: parseInt(value),
              name: product.name,
              price: product.price,
            }
          }
          return { ...item, [field]: field === 'quantity' ? parseInt(value) || 0 : value }
        }
        return item
      })
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) {
      toast.error('Add at least one item to the order')
      return
    }

    const orderItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }))

    setSubmitting(true)
    try {
      const response = await orderApi.create({
        customerId: customer.id,
        items: orderItems,
      })
      toast.success(`Order #${response.data.id} created successfully!`)
      setItems([])
      onSuccess()
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create order'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Order for {customer?.name}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={submitting}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {loadingProducts ? (
                <div className="text-center py-3">
                  <div className="spinner-border" />
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={addItem}
                      disabled={products.length === 0 || submitting}
                    >
                      + Add Item
                    </button>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-muted text-center py-4">No items added yet</p>
                  ) : (
                    <>
                      <div className="table-responsive mb-3">
                        <table className="table table-sm">
                          <thead className="table-light">
                            <tr>
                              <th>Product</th>
                              <th>Price</th>
                              <th>Qty</th>
                              <th>Total</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item) => (
                              <tr key={item.id}>
                                <td>
                                  <select
                                    className="form-select form-select-sm"
                                    value={item.productId}
                                    onChange={(e) =>
                                      updateItem(item.id, 'productId', e.target.value)
                                    }
                                    disabled={submitting}
                                  >
                                    {products.map((p) => (
                                      <option key={p.id} value={p.id}>
                                        {p.name}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td>{formatCurrency(item.price)}</td>
                                <td>
                                  <input
                                    type="number"
                                    min="1"
                                    className="form-control form-control-sm"
                                    style={{ width: '80px' }}
                                    value={item.quantity}
                                    onChange={(e) =>
                                      updateItem(item.id, 'quantity', e.target.value)
                                    }
                                    disabled={submitting}
                                  />
                                </td>
                                <td>{formatCurrency(item.price * item.quantity)}</td>
                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => removeItem(item.id)}
                                    disabled={submitting}
                                  >
                                    ✕
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="alert alert-info mb-0">
                        <strong>Order Total: {formatCurrency(calculateTotal(items))}</strong>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting || items.length === 0}>
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Creating...
                  </>
                ) : (
                  'Create Order'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
