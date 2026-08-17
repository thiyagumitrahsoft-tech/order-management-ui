import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorAlert from '../../components/ErrorAlert'
import EmptyState from '../../components/EmptyState'
import ConfirmDialog from '../../components/ConfirmDialog'
import { customerApi } from '../../api/customerApi'
import { CUSTOMER_STATUS } from '../../utils/constants'
import CustomerModal from './CustomerModal'

export default function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    setError(null)
    try {
      let response
      if (search.trim()) {
        response = await customerApi.searchByEmail(search)
      } else {
        response = await customerApi.listAll()
      }
      setCustomers(response.data || [])
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setSearch(value)
  }

  const handleSearchSubmit = () => {
    fetchCustomers()
  }

  const handleCreate = () => {
    setEditingCustomer(null)
    setShowModal(true)
  }

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingCustomer(null)
  }

  const handleModalSave = async () => {
    await fetchCustomers()
    handleModalClose()
  }

  const handleStatusToggle = async (customer) => {
    const newStatus = customer.status === CUSTOMER_STATUS.ACTIVE ? CUSTOMER_STATUS.INACTIVE : CUSTOMER_STATUS.ACTIVE
    try {
      await customerApi.updateStatus(customer.id, newStatus)
      toast.success(`Customer status updated to ${newStatus}`)
      await fetchCustomers()
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    try {
      await customerApi.delete(id)
      toast.success('Customer deleted successfully')
      await fetchCustomers()
      setDeleteConfirm(null)
    } catch (err) {
      toast.error('Failed to delete customer')
    }
  }

  const actionButton = (
    <button className="btn btn-primary" onClick={handleCreate}>
      + New Customer
    </button>
  )

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Manage customer information"
        action={actionButton}
      />

      {error && <ErrorAlert error={error} onRetry={fetchCustomers} className="mb-3" />}

      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-6">
              <input
                type="email"
                className="form-control"
                placeholder="Search by email..."
                value={search}
                onChange={handleSearch}
              />
            </div>
            <div className="col-md-6">
              <button className="btn btn-outline-primary" onClick={handleSearchSubmit}>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading customers..." />
      ) : customers.length === 0 ? (
        <EmptyState
          title="No customers found"
          message="Create a new customer to get started"
          icon="👥"
        />
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <strong>{customer.name}</strong>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>
                      <StatusBadge status={customer.status} />
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => handleEdit(customer)}
                      >
                        Edit
                      </button>
                      <button
                        className={`btn btn-sm me-2 ${
                          customer.status === CUSTOMER_STATUS.ACTIVE
                            ? 'btn-warning'
                            : 'btn-success'
                        }`}
                        onClick={() => handleStatusToggle(customer)}
                      >
                        {customer.status === CUSTOMER_STATUS.ACTIVE ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setDeleteConfirm(customer)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CustomerModal
        show={showModal}
        customer={editingCustomer}
        onClose={handleModalClose}
        onSave={handleModalSave}
      />

      <ConfirmDialog
        show={!!deleteConfirm}
        title="Delete Customer"
        message={`Are you sure you want to delete ${deleteConfirm?.name}? This action cannot be undone.`}
        isDangerous
        onConfirm={() => handleDelete(deleteConfirm.id)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  )
}
