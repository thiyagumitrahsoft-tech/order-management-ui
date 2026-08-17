import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorAlert from '../../components/ErrorAlert'
import EmptyState from '../../components/EmptyState'
import ConfirmDialog from '../../components/ConfirmDialog'
import { customerApi } from '../../api/customerApi'
import { orderApi } from '../../api/orderApi'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import CustomerSelector from './CustomerSelector'
import CreateOrderModal from './CreateOrderModal'
import OrderDetailPanel from './OrderDetailPanel'

export default function OrderList() {
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [orders, setOrders] = useState([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [cancelConfirm, setCancelConfirm] = useState(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    if (selectedCustomer) {
      fetchOrders()
    }
  }, [selectedCustomer])

  const fetchCustomers = async () => {
    setLoadingCustomers(true)
    try {
      const response = await customerApi.listAll()
      setCustomers(response.data || [])
    } catch (err) {
      toast.error('Failed to load customers')
    } finally {
      setLoadingCustomers(false)
    }
  }

  const fetchOrders = async () => {
    if (!selectedCustomer) return
    setLoadingOrders(true)
    setError(null)
    try {
      const response = await orderApi.listByCustomer(selectedCustomer.id)
      setOrders(response.data || [])
    } catch (err) {
      setError(err)
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleCancelOrder = async (orderId) => {
    try {
      await orderApi.cancel(orderId)
      toast.success('Order cancelled successfully')
      await fetchOrders()
      setCancelConfirm(null)
      setSelectedOrder(null)
    } catch (err) {
      toast.error('Failed to cancel order')
    }
  }

  const handleCreateSuccess = async () => {
    await fetchOrders()
    setShowCreateModal(false)
  }

  const actionButton = (
    <button
      className="btn btn-primary"
      onClick={() => setShowCreateModal(true)}
      disabled={!selectedCustomer}
    >
      + New Order
    </button>
  )

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Manage customer orders"
        action={actionButton}
      />

      <div className="row mb-3">
        <div className="col-md-6">
          <CustomerSelector
            customers={customers}
            selectedCustomer={selectedCustomer}
            onSelect={setSelectedCustomer}
            loading={loadingCustomers}
          />
        </div>
      </div>

      {selectedCustomer ? (
        <>
          {error && <ErrorAlert error={error} onRetry={fetchOrders} className="mb-3" />}

          {loadingOrders ? (
            <LoadingSpinner message="Loading orders..." />
          ) : orders.length === 0 ? (
            <EmptyState
              title="No orders found"
              message={`No orders for ${selectedCustomer.name}`}
              icon="📋"
            />
          ) : (
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">Orders ({orders.length})</h6>
                  </div>
                  <div className="list-group list-group-flush">
                    {orders.map((order) => (
                      <button
                        key={order.id}
                        className={`list-group-item list-group-item-action text-start ${
                          selectedOrder?.id === order.id ? 'active' : ''
                        }`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <strong>Order #{order.id}</strong>
                            <div className="small text-muted">{formatDate(order.createdAt)}</div>
                          </div>
                          <StatusBadge status={order.status} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                {selectedOrder ? (
                  <OrderDetailPanel
                    order={selectedOrder}
                    onCancel={() => setCancelConfirm(selectedOrder)}
                  />
                ) : (
                  <div className="card text-center py-5">
                    <p className="text-muted">Select an order to view details</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="Select a customer"
          message="Choose a customer to view or create orders"
          icon="👤"
        />
      )}

      <CreateOrderModal
        show={showCreateModal}
        customer={selectedCustomer}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      <ConfirmDialog
        show={!!cancelConfirm}
        title="Cancel Order"
        message={`Are you sure you want to cancel order #${cancelConfirm?.id}? This action cannot be undone.`}
        isDangerous
        onConfirm={() => handleCancelOrder(cancelConfirm.id)}
        onCancel={() => setCancelConfirm(null)}
      />
    </div>
  )
}
