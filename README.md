# Order Management System (OMS) - React Frontend

A complete, production-ready React + Vite frontend for the Order Management System microservices architecture.

![Status](https://img.shields.io/badge/status-complete-brightgreen)
![Version](https://img.shields.io/badge/version-1.0-blue)
![Node](https://img.shields.io/badge/node-16+-green)
![React](https://img.shields.io/badge/react-19.2-blue)

---

## 📋 Overview

This is a fully functional, enterprise-grade Order Management System frontend featuring:

- **Customer Management**: Create, search, edit, and manage customer records
- **Product Catalog**: Manage products and real-time inventory tracking  
- **Order Processing**: Create orders with dynamic line items, track status, and cancel when needed
- **Notifications**: Real-time customer notifications with read status tracking
- **Responsive UI**: Works seamlessly on desktop, tablet, and mobile devices
- **Production Ready**: Built with best practices, error handling, and validation

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- API Gateway running on http://localhost:8080

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📚 Documentation

**Start here based on your needs:**

- **New to the project?** → [STEP_BY_STEP_GUIDE.md](STEP_BY_STEP_GUIDE.md)
  - Feature walkthrough with examples
  - Testing scenarios
  - Common issues & solutions

- **Need technical details?** → [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
  - Complete API reference
  - Component architecture
  - State management patterns
  - Customization guide

---

## ✨ Key Features

### Customers
✅ Search by email | Create | Edit | Toggle Status | Delete with confirmation

### Products  
✅ View products | Create with validation | Update inventory | Stock indicators

### Orders
✅ Customer-scoped | Dynamic line items | Real-time totals | Status tracking | Cancel with confirmation

### Notifications
✅ Customer notifications | Read/Unread | Mark one/all as read | Details view

---

## 🔧 Available Scripts

```bash
npm run dev      # Start development server (port 5173)
npm run build    # Build for production (creates dist/)
npm run preview  # Preview production build locally
npm run lint     # Run linter
```

---

## 📁 Project Structure

```
src/
├── api/              # API layer (customerApi, productApi, etc.)
├── components/       # Reusable UI components (Navbar, StatusBadge, etc.)
├── context/          # Global state (CartContext, CustomerContext, etc.)
├── pages/            # Page components (Dashboard, CustomerList, OrderList, etc.)
├── utils/            # Utilities (formatCurrency, formatDate, constants)
├── App.jsx           # Main app with routing
└── main.jsx          # Entry point
```

---

## 🌍 Environment Setup

Create `.env` file in project root:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 📊 Build Information

| Metric | Value |
|--------|-------|
| Build Size | 315KB (100KB gzipped) |
| Build Time | ~655ms |
| Components | 15+ |
| Pages | 8 |
| API Modules | 5 |

---

## ✅ Features Implemented

- [x] Customer CRUD + Search
- [x] Product Management + Inventory
- [x] Order Creation with Line Items
- [x] Order Status Tracking & Cancellation
- [x] Notifications & Read Status
- [x] Form Validation (Client & Server)
- [x] Error Handling & Retry
- [x] Loading States & Spinners
- [x] Empty States
- [x] Responsive Design
- [x] Toast Notifications
- [x] Confirmation Dialogs
- [x] Status Badges
- [x] Production Build

---

## 🎯 Quick Walkthrough

**1. Create a Customer**
```
Dashboard → Customers → + New Customer → Fill form → Save
```

**2. Create Products**
```
Dashboard → Products → + New Product → Set price → Create
```

**3. Create an Order**
```
Dashboard → Orders → Select Customer → + New Order → Add Items → Submit
```

**4. View Notifications**
```
Dashboard → Notifications → Select Customer → Click notification
```

For detailed steps, see [STEP_BY_STEP_GUIDE.md](STEP_BY_STEP_GUIDE.md)

---

## 🛠️ Tech Stack

- **React 19.2** - UI framework
- **Vite 8.2** - Build tool
- **React Router 7.18** - Routing
- **Axios 1.19** - HTTP client
- **Bootstrap 5.3** - UI framework
- **React Toastify 11.1** - Notifications
- **Context API** - State management

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
# Output: dist/ folder ready to deploy
```

### Docker
```bash
docker build -t oms-frontend .
docker run -p 3000:3000 oms-frontend
```

---

## ⚠️ Known Limitations

1. GET /api/customers (list all) - Not available, search by email instead
2. No authentication included in scope
3. No real-time WebSocket updates

---

## 📞 Support

- Check [STEP_BY_STEP_GUIDE.md](STEP_BY_STEP_GUIDE.md) for feature details
- See [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for technical reference
- Review component comments in source code
- Check browser console (F12) for errors

---

## 📄 License

MIT License

---

**Status**: ✅ Complete & Production Ready

**Last Updated**: August 17, 2026

**Version**: 1.0.0

---

🎉 Ready to start? Run `npm install && npm run dev` and open http://localhost:5173
