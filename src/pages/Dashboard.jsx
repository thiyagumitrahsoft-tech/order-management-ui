import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

export default function Dashboard() {
  const modules = [
    {
      icon: '👥',
      title: 'Customers',
      description: 'Manage customer information and status',
      link: '/customers',
      color: 'primary',
    },
    {
      icon: '📦',
      title: 'Products',
      description: 'Manage products and inventory',
      link: '/products',
      color: 'success',
    },
    {
      icon: '📋',
      title: 'Orders',
      description: 'Create and manage customer orders',
      link: '/orders',
      color: 'info',
    },
    {
      icon: '🔔',
      title: 'Notifications',
      description: 'View order notifications',
      link: '/notifications',
      color: 'warning',
    },
  ]

  return (
    <div>
      <PageHeader
        title="Order Management System"
        description="Welcome to OMS Dashboard"
      />

      <div className="row g-3">
        {modules.map((module) => (
          <div key={module.link} className="col-md-6 col-lg-3">
            <Link to={module.link} className="text-decoration-none">
              <div className="card h-100 border-0 shadow-sm hover-shadow" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                <div className={`card-body text-center bg-${module.color} text-white py-4`}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    {module.icon}
                  </div>
                  <h6 className="mb-2">{module.title}</h6>
                  <small>{module.description}</small>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">Quick Start Guide</h5>
            <ol className="mb-0">
              <li className="mb-2">
                <strong>Create Customers:</strong> Go to Customers and add customer information
              </li>
              <li className="mb-2">
                <strong>Manage Products:</strong> Set up products and manage inventory levels
              </li>
              <li className="mb-2">
                <strong>Create Orders:</strong> Select a customer and create orders with products
              </li>
              <li>
                <strong>Track Notifications:</strong> View order status notifications for customers
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
