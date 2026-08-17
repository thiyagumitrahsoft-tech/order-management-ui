import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import PageHeader from '../../components/PageHeader'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorAlert from '../../components/ErrorAlert'
import EmptyState from '../../components/EmptyState'
import { productApi } from '../../api/productApi'
import { inventoryApi } from '../../api/inventoryApi'
import { formatCurrency } from '../../utils/formatCurrency'
import ProductModal from './ProductModal'
import StockUpdateDrawer from './StockUpdateDrawer'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showStockDrawer, setShowStockDrawer] = useState(false)
  const [inventory, setInventory] = useState({})
  const [loadingInventory, setLoadingInventory] = useState({})

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await productApi.list()
      setProducts(response.data || [])
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchInventory = async (productId) => {
    if (inventory[productId] !== undefined) return
    setLoadingInventory((prev) => ({ ...prev, [productId]: true }))
    try {
      const response = await inventoryApi.get(productId)
      setInventory((prev) => ({ ...prev, [productId]: response.data }))
    } catch (err) {
      console.error('Failed to fetch inventory:', err)
    } finally {
      setLoadingInventory((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const handleCreateClick = () => {
    setSelectedProduct(null)
    setShowModal(true)
  }

  const handleStockUpdateClick = (product) => {
    setSelectedProduct(product)
    fetchInventory(product.id)
    setShowStockDrawer(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setSelectedProduct(null)
  }

  const handleModalSave = async () => {
    await fetchProducts()
    handleModalClose()
  }

  const handleStockUpdateClose = () => {
    setShowStockDrawer(false)
    setSelectedProduct(null)
  }

  const handleStockUpdateSave = async () => {
    await fetchInventory(selectedProduct.id)
    await fetchProducts()
    handleStockUpdateClose()
  }

  const getStockStatus = (productId) => {
    const inv = inventory[productId]
    if (!inv) return 'unknown'
    return inv.availableQuantity > 0 ? 'in-stock' : 'out-of-stock'
  }

  const actionButton = (
    <button className="btn btn-primary" onClick={handleCreateClick}>
      + New Product
    </button>
  )

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage products and inventory"
        action={actionButton}
      />

      {error && <ErrorAlert error={error} onRetry={fetchProducts} className="mb-3" />}

      {loading ? (
        <LoadingSpinner message="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          message="Create a new product to get started"
          icon="📦"
        />
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const inv = inventory[product.id]
                  const isLoading = loadingInventory[product.id]
                  const stockStatus = getStockStatus(product.id)

                  return (
                    <tr key={product.id}>
                      <td>
                        <strong>{product.name}</strong>
                      </td>
                      <td>{product.sku || '-'}</td>
                      <td>{formatCurrency(product.price)}</td>
                      <td>
                        {isLoading ? (
                          <span className="text-muted small">Loading...</span>
                        ) : inv ? (
                          <span
                            className={`badge ${
                              stockStatus === 'in-stock' ? 'bg-success' : 'bg-danger'
                            }`}
                          >
                            {inv.availableQuantity} units
                          </span>
                        ) : (
                          <span
                            className="text-muted small"
                            onMouseEnter={() => fetchInventory(product.id)}
                          >
                            Click to load
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => handleStockUpdateClick(product)}
                        >
                          Update Stock
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ProductModal
        show={showModal}
        onClose={handleModalClose}
        onSave={handleModalSave}
      />

      <StockUpdateDrawer
        show={showStockDrawer}
        product={selectedProduct}
        inventory={inventory[selectedProduct?.id]}
        onClose={handleStockUpdateClose}
        onSave={handleStockUpdateSave}
      />
    </div>
  )
}
