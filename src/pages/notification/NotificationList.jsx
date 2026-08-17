import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import PageHeader from '../../components/PageHeader'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorAlert from '../../components/ErrorAlert'
import EmptyState from '../../components/EmptyState'
import { customerApi } from '../../api/customerApi'
import { notificationApi } from '../../api/notificationApi'
import { formatDate } from '../../utils/formatDate'
import CustomerSelector from '../order/CustomerSelector'

export default function NotificationList() {
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const [error, setError] = useState(null)
  const [selectedNotification, setSelectedNotification] = useState(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    if (selectedCustomer) {
      fetchNotifications()
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

  const fetchNotifications = async () => {
    if (!selectedCustomer) return
    setLoadingNotifications(true)
    setError(null)
    try {
      const response = await notificationApi.listByCustomer(selectedCustomer.id)
      const sorted = (response.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setNotifications(sorted)
    } catch (err) {
      setError(err)
    } finally {
      setLoadingNotifications(false)
    }
  }

  const handleMarkAsRead = async (notifId) => {
    try {
      await notificationApi.markAsRead(notifId)
      await fetchNotifications()
      toast.success('Notification marked as read')
    } catch (err) {
      toast.error('Failed to mark as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead(selectedCustomer.id)
      await fetchNotifications()
      toast.success('All notifications marked as read')
    } catch (err) {
      toast.error('Failed to mark all as read')
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const actionButton = unreadCount > 0 && (
    <button className="btn btn-sm btn-outline-primary" onClick={handleMarkAllAsRead}>
      Mark All as Read
    </button>
  )

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Customer order notifications"
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
          {error && <ErrorAlert error={error} onRetry={fetchNotifications} className="mb-3" />}

          {loadingNotifications ? (
            <LoadingSpinner message="Loading notifications..." />
          ) : notifications.length === 0 ? (
            <EmptyState
              title="No notifications"
              message={`No notifications for ${selectedCustomer.name}`}
              icon="📭"
            />
          ) : (
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header bg-light d-flex justify-content-between">
                    <h6 className="mb-0">
                      Notifications ({notifications.length})
                      {unreadCount > 0 && (
                        <span className="badge bg-danger ms-2">{unreadCount}</span>
                      )}
                    </h6>
                  </div>
                  <div className="list-group list-group-flush">
                    {notifications.map((notif) => (
                      <button
                        key={notif.id}
                        className={`list-group-item list-group-item-action text-start ${
                          !notif.read ? 'bg-light fw-semibold' : ''
                        } ${selectedNotification?.id === notif.id ? 'active' : ''}`}
                        onClick={() => setSelectedNotification(notif)}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="small">{notif.type || 'Notification'}</div>
                            <div className="small text-muted">{formatDate(notif.createdAt)}</div>
                          </div>
                          {!notif.read && (
                            <span className="badge bg-primary ms-2">New</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                {selectedNotification ? (
                  <div className="card">
                    <div className="card-header bg-light d-flex justify-content-between">
                      <h6 className="mb-0">Details</h6>
                      {!selectedNotification.read && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleMarkAsRead(selectedNotification.id)}
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <small className="text-muted d-block">Type</small>
                        <strong>{selectedNotification.type || 'N/A'}</strong>
                      </div>

                      {selectedNotification.orderId && (
                        <div className="mb-3">
                          <small className="text-muted d-block">Order ID</small>
                          <strong>#{selectedNotification.orderId}</strong>
                        </div>
                      )}

                      <div className="mb-3">
                        <small className="text-muted d-block">Message</small>
                        <p className="mb-0">{selectedNotification.message || 'No message'}</p>
                      </div>

                      <div className="mb-0">
                        <small className="text-muted d-block">Created</small>
                        <strong>{formatDate(selectedNotification.createdAt)}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card text-center py-5">
                    <p className="text-muted">Select a notification to view details</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="Select a customer"
          message="Choose a customer to view their notifications"
          icon="👤"
        />
      )}
    </div>
  )
}
