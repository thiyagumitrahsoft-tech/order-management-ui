# Backend API Updates - Frontend Integration

## Changes Made to Support Updated Customer APIs

The backend has updated the Customer API endpoints. The frontend has been updated to use these new endpoints.

---

## 📝 Updated Backend APIs

### 1. Get All Customers
```
Endpoint: GET /api/customers
Purpose: Retrieve all customers
Response: Array of customer objects
```

### 2. Search Customer by Email
```
Endpoint: GET /api/customers/email/{email}
Purpose: Search for a customer by email address
Parameters: email (path parameter)
Response: Customer object
```

---

## 🔧 Frontend Changes

### Updated API Module (src/api/customerApi.js)

```javascript
// Get all customers (NEW)
customerApi.listAll()
  → GET /api/customers

// Search by email (NEW)
customerApi.searchByEmail(email)
  → GET /api/customers/email/{email}

// Backward compatible
customerApi.list(email)
  → Calls listAll() if no email
  → Calls searchByEmail(email) if email provided
```

### Updated Pages

#### 1. CustomerList (src/pages/customer/CustomerList.jsx)
```javascript
// On load: Get all customers
fetchCustomers() → customerApi.listAll()

// On search: Search by email
if (search.trim()) {
  customerApi.searchByEmail(search)
} else {
  customerApi.listAll()
}
```

#### 2. OrderList (src/pages/order/OrderList.jsx)
```javascript
// Get all customers for selection
fetchCustomers() → customerApi.listAll()
```

#### 3. NotificationList (src/pages/notification/NotificationList.jsx)
```javascript
// Get all customers for selection
fetchCustomers() → customerApi.listAll()
```

---

## ✅ Testing the Changes

### Test 1: Load All Customers
1. Navigate to `/customers`
2. Page should load all customers without error
3. Search box should work for email filtering

### Test 2: Search by Email
1. Navigate to `/customers`
2. Enter an email address in search box
3. Click "Search"
4. Should show matching customer or "No customers found"

### Test 3: Create Order (Customer Selector)
1. Navigate to `/orders`
2. Dropdown should show all customers
3. Select a customer
4. Orders for that customer should load

### Test 4: Notifications (Customer Selector)
1. Navigate to `/notifications`
2. Dropdown should show all customers
3. Select a customer
4. Notifications should load

---

## 📝 Notification API Updates

### Get All New Notifications
```
@RequestMapping("/api/notifications")
@GetMapping("/all")

Endpoint: GET /api/notifications/all
Purpose: Retrieve all new (unread) notifications
Response: Array of notification objects
```

### Frontend Integration (src/api/notificationApi.js)

```javascript
// Get all new notifications (NEW)
notificationApi.listAll()
  → GET /api/notifications/all

// Existing methods (unchanged)
notificationApi.listByCustomer(customerId)
  → GET /api/notifications?customerId={customerId}

notificationApi.markAsRead(id)
  → PUT /api/notifications/{id}/read

notificationApi.markAllAsRead(customerId)
  → PUT /api/notifications/read-all
```

### Usage Example
```javascript
import { notificationApi } from '../../api/notificationApi'

// Fetch all new notifications
const response = await notificationApi.listAll()
const allNewNotifications = response.data // Array of notification objects
```

---

## 📊 API Comparison

| Scenario | Old API | New API |
|----------|---------|---------|
| Get all customers | `GET /customers?email=` | `GET /customers` |
| Search by email | `GET /customers?email={email}` | `GET /customers/email/{email}` |
| Get one customer | `GET /customers/{id}` | `GET /customers/{id}` (unchanged) |
| Create customer | `POST /customers` | `POST /customers` (unchanged) |
| Update customer | `PUT /customers/{id}` | `PUT /customers/{id}` (unchanged) |
| Update status | `PATCH /customers/{id}/status` | `PATCH /customers/{id}/status` (unchanged) |
| Delete customer | `DELETE /customers/{id}` | `DELETE /customers/{id}` (unchanged) |

---

## 🔄 Error Handling

If you get a **405 Method Not Allowed** error:
1. Verify backend is running on :8080
2. Check that new endpoints are deployed
3. Clear browser cache and refresh
4. Try the "Retry" button

If you get a **404 Not Found** error:
1. Verify the customer email exists
2. Try searching with different email
3. Load all customers first without search

---

## 📌 Important Notes

1. **Backward Compatibility**: The API module supports both old and new patterns
2. **Performance**: Loading all customers is efficient for reasonable dataset sizes
3. **Search**: Email search uses exact endpoint, no query parameters
4. **Error Messages**: User-friendly error alerts will display if requests fail

---

## 🧪 Verification

Build Status: ✅ **SUCCESSFUL**
- 110 modules transformed
- Build time: 696ms
- Size: 315.81 KB (100.14 KB gzipped)
- No errors or warnings

---

**All pages are now compatible with the updated backend APIs!**

Start the dev server with: `npm run dev`
