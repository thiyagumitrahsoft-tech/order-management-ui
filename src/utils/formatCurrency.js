export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '₹0.00'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(value)
}

export const formatPrice = (price) => formatCurrency(price)

export const calculateTotal = (items = []) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0)
}
