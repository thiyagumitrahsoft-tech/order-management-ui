import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CustomerList from './pages/customer/CustomerList.jsx'
import ProductList from './pages/product/ProductList.jsx'
import OrderList from './pages/order/OrderList.jsx'
import NotificationList from './pages/notification/NotificationList.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { CustomerProvider } from './context/CustomerContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'

function App() {
  return (
    <CartProvider>
      <CustomerProvider>
        <NotificationProvider>
          <Navbar />
          <main className="container py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/notifications" element={<NotificationList />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </NotificationProvider>
      </CustomerProvider>
    </CartProvider>
  )
}

export default App
