import StatusBadge from '../../components/StatusBadge'
import { formatDate } from '../../utils/formatDate'
import { formatCurrency } from '../../utils/formatCurrency'
import { ORDER_STATUS } from '../../utils/constants'

export default function OrderDetailPanel({ order, onCancel }) {
  const canCancel = order.status !== ORDER_STATUS.CANCELLED && order.status !== ORDER_STATUS.REJECTED

  const calculateTotal = () => {
    if (!order.items) return 0
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0)
  }

  return (
    <div className="card">
      <div className="card-header bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Order Details</h6>
          <StatusBadge status={order.status} />
        </div>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <small className="text-muted d-block">Order ID</small>
          <strong>#{order.id}</strong>
        </div>

        <div className="mb-3">
          <small className="text-muted d-block">Created</small>
          <strong>{formatDate(order.createdAt)}</strong>
        </div>

        <div className="mb-3">
          <small className="text-muted d-block">Status</small>
          <div>
            <StatusBadge status={order.status} />
          </div>
        </div>

        {order.items && order.items.length > 0 && (
          <div className="mb-3">
            <small className="text-muted d-block mb-2">Items</small>
            <div className="table-responsive">
              <table className="table table-sm mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name || `Product #${item.productId}`}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="alert alert-info mb-3">
          <div className="d-flex justify-content-between">
            <strong>Order Total:</strong>
            <strong>{formatCurrency(calculateTotal())}</strong>
          </div>
        </div>

        {order.reason && (
          <div className="alert alert-warning mb-3">
            <small className="text-muted d-block">Reason</small>
            <p className="mb-0">{order.reason}</p>
          </div>
        )}
      </div>

      {canCancel && (
        <div className="card-footer bg-light">
          <button className="btn btn-sm btn-danger w-100" onClick={onCancel}>
            Cancel Order
          </button>
        </div>
      )}
    </div>
  )
}
