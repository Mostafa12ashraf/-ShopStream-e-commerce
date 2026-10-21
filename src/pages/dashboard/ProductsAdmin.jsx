import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Row,
  Col,
  Table,
  Button,
  Alert,
  Spinner,
} from 'react-bootstrap'
import ProductFormModal from '../../components/dashboard/ProductFormModal'
import DeleteProductModal from '../../components/dashboard/DeleteProductModal'
import DashboardPagination from '../../components/dashboard/DashboardPagination'

const CURRENT_YEAR = new Date().getFullYear()
const PRODUCT_PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="28" fill="%2394a3b8">📦</text></svg>'

const DEFAULT_CATEGORIES = [
  'beauty',
  'fragrances',
  'furniture',
  'groceries',
  'home-decoration',
  'kitchen-accessories',
  'laptops',
  'mens-shirts',
  'mens-shoes',
  'mens-watches',
  'mobile-accessories',
  'motorcycle',
  'skin-care',
  'smartphones',
  'sports-accessories',
  'sunglasses',
  'tablets',
  'tops',
  'vehicle',
  'womens-bags',
  'womens-dresses',
  'womens-jewellery',
  'womens-shoes',
  'womens-watches',
]

const PAGE_SIZE = 4
const LOW_STOCK_THRESHOLD = 15

// Initial state for consolidated Product Form (Add & Edit)
const INITIAL_PRODUCT_FORM = {
  title: '',
  sku: '',
  category: 'smartphones',
  price: '',
  stock: '',
  description: '',
  thumbnail: '',
  published: true,
}

// Consolidated validation function for both Add and Edit modes
function validateProductForm(formData) {
  const errors = {}
  if (!formData.title?.trim()) {
    errors.title = 'Product title is required.'
  }
  if (!formData.category) {
    errors.category = 'Category is required.'
  }
  if (
    formData.price === '' ||
    formData.price === null ||
    formData.price === undefined ||
    isNaN(formData.price) ||
    Number(formData.price) < 0
  ) {
    errors.price = 'Please enter a valid non-negative price.'
  }
  if (
    formData.stock === '' ||
    formData.stock === null ||
    formData.stock === undefined ||
    isNaN(formData.stock) ||
    Number(formData.stock) < 0
  ) {
    errors.stock = 'Please enter a valid non-negative stock count.'
  }
  return errors
}

function ProductsAdmin() {
  // Main Data States
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [alert, setAlert] = useState(null)
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)

  // Product Form Modal States (Consolidated for Add and Edit)
  const [showFormModal, setShowFormModal] = useState(false)
  const [formMode, setFormMode] = useState('add') // 'add' | 'edit'
  const [productForm, setProductForm] = useState(INITIAL_PRODUCT_FORM)
  const [productFormErrors, setProductFormErrors] = useState({})
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Delete Confirmation Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch Categories on mount
  useEffect(() => {
    let isMounted = true
    async function fetchCategories() {
      try {
        const response = await axios.get(
          'https://dummyjson.com/products/category-list'
        )
        if (isMounted && Array.isArray(response.data) && response.data.length > 0) {
          setCategories(response.data)
        }
      } catch {
        // Fall back to DEFAULT_CATEGORIES
      }
    }
    fetchCategories()
    return () => {
      isMounted = false
    }
  }, [])

  // Refresh trigger for manual refresh button
  const [refreshKey, setRefreshKey] = useState(0)

  // Fetch Products based on currentPage, searchQuery, and refreshKey
  useEffect(() => {
    let isMounted = true
    const skip = (currentPage - 1) * PAGE_SIZE

    async function loadProducts() {
      setLoading(true)
      setError(null)

      try {
        let url = `https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${skip}`
        if (searchQuery.trim()) {
          url = `https://dummyjson.com/products/search?q=${encodeURIComponent(
            searchQuery.trim()
          )}&limit=${PAGE_SIZE}&skip=${skip}`
        }

        const response = await axios.get(url)
        if (isMounted) {
          setProducts(response.data.products || [])
          setTotal(response.data.total || 0)
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              'Failed to load products. Please try again.'
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [currentPage, searchQuery, refreshKey])

  function handleRefresh() {
    setRefreshKey((prev) => prev + 1)
  }

  // Handle Search Input Change
  function handleSearchChange(e) {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to page 1 on search change
  }

  // Stock status helper
  function getStockStatus(stock) {
    const num = Number(stock) || 0
    if (num <= 0) {
      return {
        label: 'Out of Stock',
        dotClass: 'stock-dot-red',
        textClass: 'text-stock-red',
      }
    }
    if (num <= LOW_STOCK_THRESHOLD) {
      return {
        label: `Only ${num} Left`,
        dotClass: 'stock-dot-amber',
        textClass: 'text-stock-amber',
      }
    }
    return {
      label: `${num} In Stock`,
      dotClass: 'stock-dot-green',
      textClass: 'text-stock-green',
    }
  }

  // Summary Metrics calculations
  const totalCatalogProducts = total
  const displayedCount = products.length
  const lowStockCountCurrentPage = products.filter(
    (p) => Number(p.stock) > 0 && Number(p.stock) <= LOW_STOCK_THRESHOLD
  ).length

  // Pagination calculation
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1

  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage)
    }
  }

  // Export visible products to CSV
  function handleExportCSV() {
    if (products.length === 0) return

    const headers = ['ID', 'Title', 'SKU', 'Category', 'Price', 'Stock', 'Availability']
    const rows = products.map((p) => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.sku || 'SKU-' + p.id}"`,
      `"${p.category}"`,
      p.price,
      p.stock,
      `"${getStockStatus(p.stock).label}"`,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `ShopStream_Products_Page_${currentPage}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // ============================================================
  // Form Modal Reset and Change Handlers
  // ============================================================
  function handleCloseFormModal() {
    if (isFormSubmitting) return
    setShowFormModal(false)
    setProductFormErrors({})
    setSelectedProduct(null)
    setProductForm(INITIAL_PRODUCT_FORM)
  }

  function handleFormChange(e) {
    const { name, value } = e.target
    setProductForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear validation error on change if present
    if (productFormErrors[name]) {
      setProductFormErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // ============================================================
  // Add Product Flow (Figma Page 7)
  // ============================================================
  function handleOpenAddModal() {
    const firstCategory = categories[0] || 'smartphones'
    setProductFormErrors({})
    setSelectedProduct(null)
    setFormMode('add')
    setProductForm({
      title: '',
      sku: `SW-${Math.floor(1000 + Math.random() * 9000)}-${firstCategory.slice(0, 2).toUpperCase()}`,
      category: firstCategory,
      price: '',
      stock: '',
      description: '',
      thumbnail: '',
      published: true,
    })
    setShowFormModal(true)
  }

  async function handleAddSubmit() {
    setIsFormSubmitting(true)
    try {
      const payload = {
        title: productForm.title.trim(),
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock, 10),
        category: productForm.category,
        description: productForm.description.trim() || 'No description provided.',
        sku: productForm.sku || `SW-${Math.floor(1000 + Math.random() * 9000)}`,
        thumbnail:
          productForm.thumbnail.trim() || PRODUCT_PLACEHOLDER_IMAGE,
      }

      const response = await axios.post(
        'https://dummyjson.com/products/add',
        payload
      )

      // DummyJSON returns newly created product with generated id
      const created = {
        ...response.data,
        id: response.data.id || Date.now(),
        sku: payload.sku,
        thumbnail: payload.thumbnail,
      }

      // Add to local state at the top of the table and enforce PAGE_SIZE limit
      setProducts((prev) => [created, ...prev].slice(0, PAGE_SIZE))
      setTotal((prev) => prev + 1)
      handleCloseFormModal()

      setAlert({
        type: 'success',
        message: `Product "${created.title}" was added successfully! (Note: This mock change is visible in the current Dashboard view and may reset after refresh or leaving the page).`,
      })
    } catch (err) {
      setAlert({
        type: 'danger',
        message:
          err.response?.data?.message ||
          err.message ||
          'Failed to add product. Please try again.',
      })
    } finally {
      setIsFormSubmitting(false)
    }
  }

  // ============================================================
  // Edit Product Flow (Figma Page 5)
  // ============================================================
  function handleOpenEditModal(product) {
    setProductFormErrors({})
    setSelectedProduct(product)
    setFormMode('edit')
    setProductForm({
      title: product.title || '',
      sku: product.sku || `SKU-${product.id}`,
      category: product.category || categories[0] || 'smartphones',
      price: product.price !== undefined && product.price !== null ? product.price.toString() : '0',
      stock: product.stock !== undefined && product.stock !== null ? product.stock.toString() : '0',
      description: product.description || '',
      thumbnail: product.thumbnail || '',
      published: true,
    })
    setShowFormModal(true)
  }

  async function handleEditSubmit() {
    if (!selectedProduct) return

    setIsFormSubmitting(true)
    try {
      const payload = {
        title: productForm.title.trim(),
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock, 10),
        category: productForm.category,
        description: productForm.description.trim(),
        sku: productForm.sku,
        thumbnail: productForm.thumbnail.trim(),
      }

      const response = await axios.put(
        `https://dummyjson.com/products/${selectedProduct.id}`,
        payload
      )

      // Update matching product in local state
      setProducts((prev) =>
        prev.map((item) =>
          item.id === selectedProduct.id ? { ...item, ...response.data } : item
        )
      )

      handleCloseFormModal()
      setAlert({
        type: 'success',
        message: `Product "${payload.title}" updated successfully!`,
      })
    } catch (err) {
      setAlert({
        type: 'danger',
        message:
          err.response?.data?.message ||
          err.message ||
          'Failed to update product. Please try again.',
      })
    } finally {
      setIsFormSubmitting(false)
    }
  }

  // Unified submit dispatcher
  async function handleFormSubmit(e) {
    e.preventDefault()
    const validationErrors = validateProductForm(productForm)
    if (Object.keys(validationErrors).length > 0) {
      setProductFormErrors(validationErrors)
      return
    }

    if (formMode === 'add') {
      await handleAddSubmit()
    } else {
      await handleEditSubmit()
    }
  }

  // ============================================================
  // Delete Product Flow (Figma Page 8)
  // ============================================================
  function handleOpenDeleteModal(product) {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  function handleCloseDeleteModal() {
    if (isDeleting) return
    setShowDeleteModal(false)
    setProductToDelete(null)
  }

  async function handleDeleteConfirm() {
    if (!productToDelete) return

    setIsDeleting(true)
    try {
      await axios.delete(
        `https://dummyjson.com/products/${productToDelete.id}`
      )

      // Remove from local list
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id))
      setTotal((prev) => Math.max(0, prev - 1))

      // If page becomes empty after deletion and not on page 1, step back safely
      if (products.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      }

      setShowDeleteModal(false)
      setProductToDelete(null)
      setAlert({
        type: 'success',
        message: `Product "${productToDelete.title}" was deleted successfully!`,
      })
    } catch (err) {
      setAlert({
        type: 'danger',
        message:
          err.response?.data?.message ||
          err.message ||
          'Failed to delete product. Please try again.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="products-admin-container">
      {/* Global Feedback Alert */}
      {alert && (
        <Alert
          variant={alert.type}
          dismissible
          onClose={() => setAlert(null)}
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}

      {/* Header Row (Figma Page 6) */}
      <div className="dashboard-header-row">
        <div>
          <h1 className="dashboard-page-title">Product Inventory</h1>
          <p className="dashboard-page-subtitle">
            Manage your catalog, stock levels, and pricing.
          </p>
        </div>
        <div>
          <Button
            type="button"
            className="btn-dashboard-add"
            onClick={handleOpenAddModal}
            aria-label="Add New Product"
          >
            <span>+</span> Add New Product
          </Button>
        </div>
      </div>

      {/* Main Table Card (Figma Page 6) */}
      <div className="dashboard-table-card">
        {/* Table Toolbar */}
        <div className="dashboard-table-toolbar">
          <div className="dashboard-search-wrapper">
            <span className="dashboard-search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="search"
              placeholder="Search products by name, SKU, or category..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="dashboard-search-input"
              aria-label="Search products"
            />
          </div>

          <div className="dashboard-toolbar-actions">
            {searchQuery && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="btn-dashboard-tool"
              >
                Clear Search
              </Button>
            )}
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleExportCSV}
              className="btn-dashboard-tool"
              disabled={products.length === 0}
              title="Export currently displayed page as CSV"
            >
              📥 Export CSV (Page)
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleRefresh}
              className="btn-dashboard-tool"
              title="Refresh inventory"
            >
              🔄 Refresh
            </Button>
          </div>
        </div>

        {/* Loading / Error / Content */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" role="status" />
            <p className="mt-3 text-muted">Loading product inventory...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <Alert variant="danger" className="d-inline-block text-start mb-3">
              {error}
            </Alert>
            <div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleRefresh}
              >
                Retry
              </Button>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-5">
            <div className="fs-1 mb-2 text-muted">📦</div>
            <h5 className="fw-bold">No Products Found</h5>
            <p className="text-muted small">
              {searchQuery
                ? `No products match your search "${searchQuery}".`
                : 'There are currently no products available.'}
            </p>
            {searchQuery && (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setSearchQuery('')}
              >
                Clear Search Filter
              </Button>
            )}
          </div>
        ) : (
          <div className="dashboard-table-responsive">
            <Table hover className="dashboard-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const status = getStockStatus(product.stock)
                  const skuDisplay = product.sku || `SKU-${product.id}`

                  return (
                    <tr key={product.id}>
                      {/* Product cell with thumbnail, title & SKU */}
                      <td>
                        <div className="dashboard-product-cell">
                          <img
                            src={
                              product.thumbnail ||
                              product.images?.[0] ||
                              PRODUCT_PLACEHOLDER_IMAGE
                            }
                            alt={product.title}
                            className="dashboard-product-thumb"
                            onError={(e) => {
                              e.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE
                            }}
                          />
                          <div className="dashboard-product-info">
                            <div
                              className="dashboard-product-title"
                              title={product.title}
                            >
                              {product.title}
                            </div>
                            <div className="dashboard-product-sku">
                              SKU: {skuDisplay}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td>
                        <span className="dashboard-category-badge">
                          {product.category || 'General'}
                        </span>
                      </td>

                      {/* Price */}
                      <td>
                        <span className="dashboard-price-text">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      </td>

                      {/* Stock Status with Colored Dot */}
                      <td>
                        <span className={`stock-dot-status ${status.textClass}`}>
                          <span
                            className={`stock-dot ${status.dotClass}`}
                            aria-hidden="true"
                          />
                          {status.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="text-end dashboard-actions-cell">
                        <button
                          type="button"
                          className="btn-action-icon"
                          onClick={() => handleOpenEditModal(product)}
                          title="Edit Product"
                          aria-label={`Edit ${product.title}`}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="btn-action-icon btn-action-delete"
                          onClick={() => handleOpenDeleteModal(product)}
                          title="Delete Product"
                          aria-label={`Delete ${product.title}`}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        )}

        {/* Table Footer with Extracted DashboardPagination */}
        {!loading && !error && products.length > 0 && (
          <DashboardPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={total}
            pageSize={PAGE_SIZE}
            itemLabel="products"
          />
        )}
      </div>

      {/* Summary Stat Cards Row (Figma Page 6 - Placed Below Table) */}
      <Row className="g-3 my-4">
        <Col xs={12} sm={4}>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-header">
              <span className="dashboard-stat-label">Total Catalog</span>
              <span className="dashboard-stat-badge badge-stat-purple">
                Catalog
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="dashboard-stat-value mb-0">{totalCatalogProducts}</h3>
              <span className="fs-4 text-muted" aria-hidden="true">📈</span>
            </div>
          </div>
        </Col>

        <Col xs={12} sm={4}>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-header">
              <span className="dashboard-stat-label">Showing Products</span>
              <span className="dashboard-stat-badge badge-stat-blue">
                Current Page
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="dashboard-stat-value mb-0">{displayedCount}</h3>
              <span className="fs-4 text-muted" aria-hidden="true">🛍️</span>
            </div>
          </div>
        </Col>

        <Col xs={12} sm={4}>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-header">
              <span className="dashboard-stat-label">Low Stock Alerts</span>
              <span className="dashboard-stat-badge badge-stat-amber">
                Current Page
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="dashboard-stat-value mb-0">{lowStockCountCurrentPage}</h3>
              <span className="fs-4 text-muted" aria-hidden="true">🔔</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* ============================================================
          PRODUCT FORM MODAL (Add & Edit - Figma Page 7 & Page 5)
          ============================================================ */}
      <ProductFormModal
        show={showFormModal}
        mode={formMode}
        formData={productForm}
        errors={productFormErrors}
        loading={isFormSubmitting}
        categories={categories}
        selectedProduct={selectedProduct}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
        onClose={handleCloseFormModal}
      />

      {/* ============================================================
          DELETE PRODUCT MODAL (Figma Page 8)
          ============================================================ */}
      <DeleteProductModal
        show={showDeleteModal}
        product={productToDelete}
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={handleCloseDeleteModal}
        getStockStatus={getStockStatus}
        currentYear={CURRENT_YEAR}
      />
    </div>
  )
}

export default ProductsAdmin
