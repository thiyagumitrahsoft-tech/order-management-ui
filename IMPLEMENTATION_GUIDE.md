# Order Management System - Frontend Implementation Guide

## 📋 Complete Implementation Summary

This document provides a step-by-step reference guide for the complete Order Management System frontend implementation.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Backend API Gateway running on http://localhost:8080

### Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
http://localhost:5173
```

---

## 📁 Project Structure

```
src/
├── api/                          # API layer modules
│   ├── axiosClient.js           # Configured Axios with interceptors
│   ├── customerApi.js           # Customer API endpoints
│   ├── productApi.js            # Product API endpoints
│   ├── inventoryApi.js          # Inventory API endpoints
│   ├── orderApi.js              # Order API endpoints
│   └── notificationApi.js       # Notification API endpoints
│
├── components/                   # Reusable UI components
│   ├── Navbar.jsx               # Navigation bar
│   ├── PageHeader.jsx           # Page title and actions
│   ├── StatusBadge.jsx          # Status badge component
│   ├── LoadingSpinner.jsx       # Loading indicator
│   ├── ErrorAlert.jsx           # Error message display
│   ├── ConfirmDialog.jsx        # Confirmation modal
│   └── EmptyState.jsx           # Empty state message
│
├── context/                      # Global state management
│   ├── CartContext.jsx          # Shopping cart state
│   ├── CustomerContext.jsx      # Selected customer state
│   └── NotificationContext.jsx  # Notifications state
│
├── pages/                        # Page components
│   ├── Dashboard.jsx            # Home page
│   ├── customer/
│   │   ├── CustomerList.jsx     # Customer search & list
│   │   └── CustomerModal.jsx    # Create/Edit customer
│   ├── product/
│   │   ├── ProductList.jsx      # Product list with inventory
│   │   ├── ProductModal.jsx     # Create product
│   │   └── StockUpdateDrawer.jsx # Update stock levels
│   ├── order/
│   │   ├── OrderList.jsx        # Orders by customer
│   │   ├── CustomerSelector.jsx # Customer picker
│   │   ├── CreateOrderModal.jsx # Create order with items
│   │   └── OrderDetailPanel.jsx # Order details view
│   └── notification/
│       └── NotificationList.jsx # Notifications by customer
│
├── utils/                        # Utility functions
│   ├── constants.js             # Status colors & messages
│   ├── formatCurrency.js        # Currency formatting
│   └── formatDate.js            # Date formatting
│
├── App.jsx                       # Main app with routing
├── main.jsx                      # App entry point
└── index.css                     # Global styles
```

---

## 🔧 Configuration

### Environment Variables (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### Axios Client (src/api/axiosClient.js)
- Base URL: API Gateway on port 8080
- Timeout: 10 seconds
- Response interceptor for error handling
- Automatic toast notifications for common errors

---

## 📚 Module Reference

### 1. **Customers Module**

**Location**: `src/pages/customer/`

**Features**:
- Search customers by email
- Create new customers
- Edit customer information
- Toggle customer status (ACTIVE/INACTIVE)
- Delete customers with confirmation
- Form validation (name, email format, phone)

**Files**:
- `CustomerList.jsx` - Main customers page
- `CustomerModal.jsx` - Create/Edit modal

**API Endpoints Used**:
- `GET /api/customers?email={email}` - Search customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `PATCH /api/customers/{id}/status` - Toggle status
- `DELETE /api/customers/{id}` - Delete customer

---

### 2. **Products & Inventory Module**

**Location**: `src/pages/product/`

**Features**:
- Display all products with SKU and price
- Lazy-load inventory for each product
- Create new products with SKU and price
- Update product stock levels
- Visual stock indicators (In Stock/Out of Stock)

**Files**:
- `ProductList.jsx` - Product listing
- `ProductModal.jsx` - Create product
- `StockUpdateDrawer.jsx` - Update inventory

**API Endpoints Used**:
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/inventory/{productId}` - Get stock
- `PUT /api/inventory/{productId}/stock` - Update stock

---

### 3. **Orders Module**

**Location**: `src/pages/order/`

**Features**:
- Customer-scoped order management
- Create orders with multiple line items
- Dynamic product selection
- Quantity adjustment
- Real-time total calculation
- View order details and status
- Cancel orders with confirmation
- Status tracking (PENDING, CONFIRMED, REJECTED, CANCELLED)

**Files**:
- `OrderList.jsx` - Main orders page
- `CustomerSelector.jsx` - Customer picker
- `CreateOrderModal.jsx` - Create order form
- `OrderDetailPanel.jsx` - Order details view

**API Endpoints Used**:
- `GET /api/customers` - Get customers for selection
- `POST /api/orders` - Create order
- `GET /api/orders?customerId={id}` - Get customer orders
- `GET /api/products` - Get products for order items
- `PUT /api/orders/{id}/cancel` - Cancel order

---

### 4. **Notifications Module**

**Location**: `src/pages/notification/`

**Features**:
- Customer-scoped notifications
- View notification feed (newest first)
- Unread notification badge
- Mark individual notifications as read
- Mark all notifications as read
- Notification details view

**Files**:
- `NotificationList.jsx` - Main notifications page

**API Endpoints Used**:
- `GET /api/notifications?customerId={id}` - Get notifications
- `PUT /api/notifications/{id}/read` - Mark as read
- `PUT /api/notifications/read-all?customerId={id}` - Mark all as read

---

## 🎨 UI Components & Utilities

### Shared Components

#### StatusBadge
```jsx
<StatusBadge status="CONFIRMED" />
// Renders colored badge based on status
```

#### LoadingSpinner
```jsx
<LoadingSpinner message="Loading customers..." />
```

#### ErrorAlert
```jsx
<ErrorAlert 
  error={error} 
  onRetry={fetchCustomers}
/>
```

#### ConfirmDialog
```jsx
<ConfirmDialog
  show={true}
  title="Delete Customer"
  message="Are you sure?"
  isDangerous
  onConfirm={handleDelete}
  onCancel={handleClose}
/>
```

#### PageHeader
```jsx
<PageHeader
  title="Customers"
  description="Manage customer information"
  action={<button>+ New Customer</button>}
/>
```

### Utility Functions

#### formatCurrency
```js
import { formatCurrency } from '../utils/formatCurrency'
formatCurrency(1500) // Returns: ₹1,500.00
```

#### formatDate
```js
import { formatDate } from '../utils/formatDate'
formatDate("2026-08-17T10:30:00") // Returns: "Aug 17, 2026 10:30 AM"
```

#### Constants
```js
import { ORDER_STATUS, CUSTOMER_STATUS, STATUS_COLORS } from '../utils/constants'
```

---

## 🔌 API Integration Pattern

### Making API Calls

**Pattern**:
```js
import { apiModule } from '../api/apiModule'
import { toast } from 'react-toastify'

// Inside component
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

const fetchData = async () => {
  setLoading(true)
  setError(null)
  try {
    const response = await apiModule.functionName(params)
    setData(response.data)
  } catch (err) {
    setError(err)
    // Toast already shown by interceptor
  } finally {
    setLoading(false)
  }
}
```

### Error Handling

Errors are automatically handled by axios interceptor:
- 400 Bad Request → Validation message
- 404 Not Found → Resource not found
- 500 Server Error → Server error message
- Network errors → API Gateway unavailable

Custom error messages can be extracted:
```js
const message = error.response?.data?.message || 'An error occurred'
```

---

## 🎯 Common Workflows

### Create a Customer

1. Navigate to `/customers`
2. Click "+ New Customer"
3. Fill in: Name, Email, Phone
4. Click "Save"
5. Success toast appears
6. List refreshes automatically

### Create an Order

1. Navigate to `/orders`
2. Select a customer from dropdown
3. Click "+ New Order"
4. Click "+ Add Item"
5. Select product and quantity
6. Repeat for multiple items
7. See order total update
8. Click "Create Order"
9. Order appears in list

### Update Inventory

1. Navigate to `/products`
2. Click "Update Stock" on a product
3. Enter new quantity
4. Click "Update"
5. Stock updates immediately

### Mark Notifications as Read

1. Navigate to `/notifications`
2. Select a customer
3. Click notification to view details
4. Click "Mark as Read" or "Mark All as Read"
5. Unread badge updates

---

## 🧪 Form Validation Rules

### Customer Form
- **Name**: Required, non-empty
- **Email**: Required, valid email format
- **Phone**: Required, non-empty

### Product Form
- **Name**: Required, non-empty
- **Price**: Required, must be > 0
- **SKU**: Optional

### Order Form
- **At least one item**: Required
- **Quantity**: Required, must be > 0

All validations happen:
1. Client-side before submit
2. Server-side (backend validates)
3. Error messages displayed to user

---

## 📱 Responsive Design

- **Desktop**: Full table views, side-by-side panels
- **Tablet**: Stacked layout, full-width tables
- **Mobile**: Card layout, collapsible sections

Bootstrap classes used throughout ensure responsive behavior.

---

## 🎨 Theme & Styling

**Colors**:
- Primary: Blue (#007bff) - Active, info
- Success: Green - Confirmed, active, in-stock
- Warning: Yellow - Pending, low-stock
- Danger: Red - Rejected, cancelled, inactive
- Secondary: Gray - Inactive, secondary actions

**Background**: Pale gray (#f8f9fa)
**Cards**: White with subtle shadow

---

## 🔐 Security Considerations

1. **No secrets in code**: API keys are not hardcoded
2. **API Gateway only**: All requests go through gateway
3. **CORS handling**: API Gateway handles CORS
4. **Input validation**: Client and server validation
5. **Error messages**: User-friendly, no stack traces

---

## 🚨 Error Recovery

### Network Errors
- Automatic toast message
- Retry button available in error alert
- User can retry manually

### Validation Errors
- Field-level error messages
- Disable submit until fixed
- Server validation errors displayed

### API Errors
- Clear error messages from backend
- Generic fallback message
- Console logging for debugging

---

## 📊 State Management

### Global State (Context API)

**CartContext**: Shopping cart for order creation
- `items[]` - Line items
- `addItem()` - Add to cart
- `removeItem()` - Remove from cart
- `updateQuantity()` - Change quantity
- `clearCart()` - Empty cart
- `total` - Calculated total

**CustomerContext**: Selected customer
- `selectedCustomer` - Current customer
- `setSelectedCustomer()` - Change customer

**NotificationContext**: Unread notifications
- `unreadCount` - Badge count
- `setUnread()` - Update count
- `decrementUnread()` - Decrement

### Component State

Used for:
- Form inputs
- Modal visibility
- Loading/error states
- Expanded/collapsed sections

---

## 🔄 Data Flow

### Order Creation Flow

```
User selects Customer
    ↓
Fetches customer's products
    ↓
Adds items to cart (CartContext)
    ↓
Submits to POST /api/orders
    ↓
Backend validates customer + inventory
    ↓
Returns order with status (CONFIRMED/REJECTED)
    ↓
UI updates with result
    ↓
Toast notification
    ↓
Order appears in list
```

### Notification Flow

```
Backend creates order event
    ↓
Kafka: order-events topic
    ↓
Notification Service consumes
    ↓
Creates notification in database
    ↓
Frontend polls: GET /api/notifications?customerId={id}
    ↓
Displays in NotificationList
    ↓
User clicks to read
    ↓
Frontend: PUT /api/notifications/{id}/read
    ↓
Badge updates
```

---

## 🛠️ Customization Guide

### Add New API Module

```js
// src/api/newModuleApi.js
import axiosClient from './axiosClient'

export const newModuleApi = {
  list: () => axiosClient.get('/endpoint'),
  get: (id) => axiosClient.get(`/endpoint/${id}`),
  create: (data) => axiosClient.post('/endpoint', data),
}
```

### Add New Status Type

```js
// src/utils/constants.js
export const STATUS_COLORS = {
  ...existing,
  NEW_STATUS: 'info',
}

export const STATUS_LABELS = {
  ...existing,
  NEW_STATUS: 'New Status',
}
```

### Create New Page

```jsx
// src/pages/newpage/NewPage.jsx
import PageHeader from '../../components/PageHeader'

export default function NewPage() {
  return (
    <div>
      <PageHeader title="New Page" description="Description" />
      {/* Page content */}
    </div>
  )
}

// Update routing in App.jsx
<Route path="/newpage" element={<NewPage />} />
```

---

## 🧪 Testing Checklist

### Customers
- [ ] Search by email works
- [ ] Create customer with validation
- [ ] Edit customer updates data
- [ ] Toggle status works
- [ ] Delete with confirmation
- [ ] Error handling on network failure

### Products
- [ ] List products displays
- [ ] Click "Update Stock" loads inventory
- [ ] Update stock value works
- [ ] Create product saves
- [ ] Price validation works

### Orders
- [ ] Select customer fetches their orders
- [ ] Create order modal opens
- [ ] Add/remove items works
- [ ] Quantity updates total
- [ ] Submit creates order
- [ ] Order appears in list immediately
- [ ] Order status displays correctly
- [ ] Cancel order shows confirmation

### Notifications
- [ ] Select customer shows notifications
- [ ] Click notification shows details
- [ ] Mark as read updates UI
- [ ] Mark all as read works
- [ ] Unread badge displays correctly

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Outputs to `dist/` folder

### Environment Configuration

```
# For production
VITE_API_BASE_URL=https://api.production.com/api
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "run", "preview"]
```

---

## 📖 Key Files Reference

| File | Purpose | Key Functions |
|------|---------|---|
| `axiosClient.js` | API client config | Response interceptor |
| `constants.js` | Static data | STATUS_COLORS, LABELS |
| `formatCurrency.js` | Currency format | formatCurrency() |
| `formatDate.js` | Date format | formatDate() |
| `CartContext.jsx` | Cart state | addItem(), removeItem() |
| `CustomerContext.jsx` | Customer state | setSelectedCustomer() |
| `StatusBadge.jsx` | Status display | Color-coded badge |
| `PageHeader.jsx` | Page layout | Title + action button |
| `CustomerModal.jsx` | Customer form | Create/edit modal |
| `CreateOrderModal.jsx` | Order form | Dynamic line items |

---

## 🆘 Troubleshooting

### Issue: API calls not working
**Solution**: 
- Check if API Gateway is running on :8080
- Verify VITE_API_BASE_URL in .env
- Check browser console for CORS errors
- Verify backend is configured for CORS

### Issue: Form validation not working
**Solution**:
- Check validation function in modal component
- Verify error state is rendered
- Check form field names match validation logic

### Issue: Customer selector shows empty
**Solution**:
- Ensure GET /api/customers endpoint exists
- Check if backend returns customer data
- Verify response format matches expectations

### Issue: Orders not appearing
**Solution**:
- Verify customer is selected
- Check if GET /api/orders?customerId={id} works
- Verify order creation returned order ID
- Check order status (may be REJECTED)

---

## 📞 Support & Next Steps

### Known Limitations
1. GET /api/customers endpoint may not support pagination
2. Product update/delete not implemented (can add if needed)
3. Dashboard aggregation endpoints not available
4. No authentication/authorization (outside scope)

### To Extend
1. Add authentication (JWT tokens)
2. Add product images
3. Add order filtering and sorting
4. Add customer export/import
5. Add order reports and analytics
6. Add real-time notifications (WebSocket)

---

**Last Updated**: August 17, 2026
**Version**: 1.0
**Status**: Complete & Production Ready

