import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Row,
  Col,
  Table,
  Button,
  Form,
  Alert,
  Spinner,
} from 'react-bootstrap'
import cartInsightsThumb from '../../assets/cart_insights_thumb.jpg'
import CartFormModal from '../../components/dashboard/CartFormModal'
import CartDetailsModal from '../../components/dashboard/CartDetailsModal'
import DeleteCartModal from '../../components/dashboard/DeleteCartModal'
import DashboardPagination from '../../components/dashboard/DashboardPagination'

const PAGE_SIZE = 4
const PRODUCT_PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="28" fill="%2394a3b8">📦</text></svg>'

// Initial state for consolidated Cart Form (Add & Edit)
const INITIAL_CART_FORM = {
  userId: '',
  products: [{ id: '', quantity: 1 }],
}

// Consolidated validation function for both Add and Edit modes
function validateCartForm(formData, mode = 'add') {
  const errors = {}

  if (mode === 'add') {
    const uid = parseInt(formData.userId, 10)
    if (!formData.userId || isNaN(uid) || uid <= 0) {
      errors.userId = 'Valid positive User ID is required.'
    }
  }

  if (!formData.products || formData.products.length === 0) {
    errors.products = 'At least one product row is required.'
  } else {
    const productErrors = []
    formData.products.forEach((p, idx) => {
      const pid = parseInt(p.id, 10)
      const qty = parseInt(p.quantity, 10)
      if (!p.id || isNaN(pid) || pid <= 0) {
        productErrors.push(`Row ${idx + 1}: Valid Product ID required.`)
      } else if (!p.quantity || isNaN(qty) || qty <= 0) {
        productErrors.push(`Row ${idx + 1}: Quantity must be at least 1.`)
      }
    })
    if (productErrors.length > 0) {
      errors.products = productErrors.join(' ')
    }
  }

  return errors
}

function CartsAdmin() {
  // Main Data States
  const [carts, setCarts] = useState([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [userIdFilter, setUserIdFilter] = useState('')
  const [activeUserFilter, setActiveUserFilter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [alert, setAlert] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [alertsDismissed, setAlertsDismissed] = useState(false)

  // Details Modal States (Step 10)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedCart, setSelectedCart] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState('')

  // Form Modal States (Consolidated for Add and Edit)
  const [showFormModal, setShowFormModal] = useState(false)
  const [formMode, setFormMode] = useState('add') // 'add' | 'edit'
  const [cartForm, setCartForm] = useState(INITIAL_CART_FORM)
  const [cartFormErrors, setCartFormErrors] = useState({})
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const [selectedCartForEdit, setSelectedCartForEdit] = useState(null)

  // Delete Cart Confirmation Modal States (Step 13)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [cartToDelete, setCartToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Load Carts based on pagination or active User ID filter
  useEffect(() => {
    let isMounted = true
    const skip = (currentPage - 1) * PAGE_SIZE

    async function loadCarts() {
      setLoading(true)
      setError(null)

      try {
        let url = `https://dummyjson.com/carts?limit=${PAGE_SIZE}&skip=${skip}`
        if (activeUserFilter) {
          url = `https://dummyjson.com/carts/user/${activeUserFilter}?limit=${PAGE_SIZE}&skip=${skip}`
        }

        const response = await axios.get(url)
        if (isMounted) {
          setCarts(response.data.carts || [])
          setTotal(response.data.total || 0)
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              'Failed to load carts. Please try again.'
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadCarts()

    return () => {
      isMounted = false
    }
  }, [currentPage, activeUserFilter, refreshKey])

  function handleRefresh() {
    setRefreshKey((prev) => prev + 1)
  }

  // Handle User ID Filter Submit
  function handleFilterSubmit(e) {
    e.preventDefault()
    const trimmed = userIdFilter.trim()
    if (!trimmed) {
      handleClearFilter()
      return
    }

    const parsed = parseInt(trimmed, 10)
    if (isNaN(parsed) || parsed <= 0) {
      setAlert({
        type: 'danger',
        message: 'Please enter a valid positive User ID number.',
      })
      return
    }

    setActiveUserFilter(parsed)
    setCurrentPage(1)
  }

  function handleClearFilter() {
    setUserIdFilter('')
    setActiveUserFilter(null)
    setCurrentPage(1)
  }

  // Summary Metrics calculations
  const totalCatalogCarts = total
  const displayedCount = carts.length
  const pageTotalItems = carts.reduce(
    (sum, c) => sum + (Number(c.totalQuantity) || 0),
    0
  )
  const pageCartValue = carts.reduce(
    (sum, c) => sum + (Number(c.total) || 0),
    0
  )

  // Highest value cart on current page (for Insights & System Alerts)
  const highestValueCart =
    carts.length > 0
      ? [...carts].sort(
          (a, b) => (Number(b.total) || 0) - (Number(a.total) || 0)
        )[0]
      : null

  // Pagination calculation
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1

  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage)
    }
  }

  // Export visible carts to CSV
  function handleExportCSV() {
    if (carts.length === 0) return

    const headers = [
      'Cart ID',
      'User ID',
      'Total Products',
      'Total Quantity',
      'Total Price',
      'Discounted Total',
    ]
    const rows = carts.map((c) => [
      c.id,
      c.userId,
      c.totalProducts,
      c.totalQuantity,
      Number(c.total).toFixed(2),
      Number(c.discountedTotal || c.total).toFixed(2),
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `ShopStream_Carts_Page_${currentPage}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // ============================================================
  // Cart Details Flow (Step 10)
  // ============================================================
  async function handleOpenDetails(cart) {
    setSelectedCart(cart)
    setShowDetailsModal(true)
    setDetailsLoading(true)
    setDetailsError('')

    try {
      const response = await axios.get(
        `https://dummyjson.com/carts/${cart.id}`
      )
      setSelectedCart(response.data)
    } catch (err) {
      setDetailsError(
        err.response?.data?.message ||
          err.message ||
          'Failed to load detailed cart information.'
      )
    } finally {
      setDetailsLoading(false)
    }
  }

  function handleCloseDetailsModal() {
    setShowDetailsModal(false)
    setSelectedCart(null)
    setDetailsError('')
  }

  // ============================================================
  // Dynamic Product Rows and Form Handlers
  // ============================================================
  function handleCloseFormModal() {
    if (isFormSubmitting) return
    setShowFormModal(false)
    setCartFormErrors({})
    setSelectedCartForEdit(null)
    setCartForm(INITIAL_CART_FORM)
  }

  function handleFormChange(e) {
    const { name, value } = e.target
    setCartForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (cartFormErrors[name]) {
      setCartFormErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  function handleAddProductRow() {
    setCartForm((prev) => ({
      ...prev,
      products: [...prev.products, { id: '', quantity: 1 }],
    }))
  }

  function handleRemoveProductRow(index) {
    if (cartForm.products.length <= 1) return
    setCartForm((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }))
  }

  function handleProductRowChange(index, field, value) {
    setCartForm((prev) => {
      const updated = [...prev.products]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, products: updated }
    })
    if (cartFormErrors.products) {
      setCartFormErrors((prev) => {
        const next = { ...prev }
        delete next.products
        return next
      })
    }
  }

  // ============================================================
  // Add Cart Flow (Step 11)
  // ============================================================
  function handleOpenAddModal() {
    setCartFormErrors({})
    setSelectedCartForEdit(null)
    setFormMode('add')
    setCartForm({
      userId: '',
      products: [{ id: '', quantity: 1 }],
    })
    setShowFormModal(true)
  }

  async function handleAddSubmit() {
    setIsFormSubmitting(true)
    try {
      const payload = {
        userId: parseInt(cartForm.userId, 10),
        products: cartForm.products.map((p) => ({
          id: parseInt(p.id, 10),
          quantity: parseInt(p.quantity, 10),
        })),
      }

      const response = await axios.post(
        'https://dummyjson.com/carts/add',
        payload
      )

      const created = {
        ...response.data,
        id: response.data.id || Date.now(),
      }

      // Prepend to current list and enforce PAGE_SIZE
      setCarts((prev) => [created, ...prev].slice(0, PAGE_SIZE))
      setTotal((prev) => prev + 1)
      handleCloseFormModal()

      setAlert({
        type: 'success',
        message: `Cart #${created.id} for User #${created.userId} created successfully! (Note: This mock change is visible in the current Dashboard view and may reset after refresh or leaving the page).`,
      })
    } catch (err) {
      setAlert({
        type: 'danger',
        message:
          err.response?.data?.message ||
          err.message ||
          'Failed to add cart. Please try again.',
      })
    } finally {
      setIsFormSubmitting(false)
    }
  }

  // ============================================================
  // Edit Cart Flow (Step 12)
  // ============================================================
  function handleOpenEditModal(cart) {
    setCartFormErrors({})
    setSelectedCartForEdit(cart)
    setFormMode('edit')
    setCartForm({
      userId: cart.userId,
      products: (cart.products || []).map((p) => ({
        id: p.id,
        quantity: p.quantity,
      })),
    })
    setShowFormModal(true)
  }

  async function handleEditSubmit() {
    if (!selectedCartForEdit) return

    setIsFormSubmitting(true)
    try {
      const payload = {
        merge: false,
        products: cartForm.products.map((p) => ({
          id: parseInt(p.id, 10),
          quantity: parseInt(p.quantity, 10),
        })),
      }

      const response = await axios.put(
        `https://dummyjson.com/carts/${selectedCartForEdit.id}`,
        payload
      )

      // Update matching cart locally using map
      setCarts((prev) =>
        prev.map((c) =>
          c.id === selectedCartForEdit.id ? { ...c, ...response.data } : c
        )
      )

      handleCloseFormModal()
      setAlert({
        type: 'success',
        message: `Cart #${selectedCartForEdit.id} updated successfully!`,
      })
    } catch (err) {
      setAlert({
        type: 'danger',
        message:
          err.response?.data?.message ||
          err.message ||
          'Failed to update cart. Please try again.',
      })
    } finally {
      setIsFormSubmitting(false)
    }
  }

  // Unified submit dispatcher
  async function handleFormSubmit(e) {
    e.preventDefault()
    const validationErrors = validateCartForm(cartForm, formMode)
    if (Object.keys(validationErrors).length > 0) {
      setCartFormErrors(validationErrors)
      return
    }

    if (formMode === 'add') {
      await handleAddSubmit()
    } else {
      await handleEditSubmit()
    }
  }

  // ============================================================
  // Delete Cart Flow (Step 13)
  // ============================================================
  function handleOpenDeleteModal(cart) {
    setCartToDelete(cart)
    setShowDeleteModal(true)
  }

  function handleCloseDeleteModal() {
    if (isDeleting) return
    setShowDeleteModal(false)
    setCartToDelete(null)
  }

  async function handleDeleteConfirm() {
    if (!cartToDelete) return

    setIsDeleting(true)
    try {
      await axios.delete(`https://dummyjson.com/carts/${cartToDelete.id}`)

      // Remove from local list using filter
      setCarts((prev) => prev.filter((c) => c.id !== cartToDelete.id))
      setTotal((prev) => Math.max(0, prev - 1))

      // If page becomes empty and not on page 1, step back safely
      if (carts.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      }

      setShowDeleteModal(false)
      setCartToDelete(null)
      setAlert({
        type: 'success',
        message: `Cart #${cartToDelete.id} was deleted successfully!`,
      })
    } catch (err) {
      setAlert({
        type: 'danger',
        message:
          err.response?.data?.message ||
          err.message ||
          'Failed to delete cart. Please try again.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="carts-admin-container">
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

      {/* Header Row (Figma Page 9) */}
      <div className="dashboard-header-row align-items-center">
        <div>
          <h1 className="dashboard-page-title">Cart Management</h1>
          <p className="dashboard-page-subtitle">
            Oversee and monitor all customer shopping activity and orders.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {/* User ID Filter Form */}
          <Form
            onSubmit={handleFilterSubmit}
            className="d-flex align-items-center gap-2"
          >
            <div className="dashboard-search-wrapper" style={{ width: '240px' }}>
              <span className="dashboard-search-icon" aria-hidden="true">
                🔍
              </span>
              <input
                type="number"
                min="1"
                placeholder="User ID (e.g. 5)..."
                value={userIdFilter}
                onChange={(e) => setUserIdFilter(e.target.value)}
                className="dashboard-search-input"
                aria-label="Filter by User ID"
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              style={{ height: '42px', backgroundColor: '#4338ca', borderColor: '#4338ca' }}
            >
              Filter
            </Button>
            {activeUserFilter && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleClearFilter}
                style={{ height: '42px' }}
                title="Clear filter"
              >
                Clear (#{activeUserFilter})
              </Button>
            )}
          </Form>

          <Button
            type="button"
            className="btn-dashboard-add"
            onClick={handleOpenAddModal}
            aria-label="Add New Cart"
            style={{ height: '42px' }}
          >
            <span>+</span> Add New Cart
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards Row (Figma Page 9 Alignment) */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} lg={3}>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-header">
              <span className="dashboard-stat-label">Total Carts</span>
              <span className="dashboard-stat-badge badge-stat-purple">
                Catalog
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="dashboard-stat-value mb-0">{totalCatalogCarts}</h3>
              <span className="fs-4 text-muted" aria-hidden="true">🛒</span>
            </div>
          </div>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-header">
              <span className="dashboard-stat-label">Page Value</span>
              <span className="dashboard-stat-badge badge-stat-green">
                Current Page
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="dashboard-stat-value mb-0">
                ${pageCartValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <span className="fs-4 text-muted" aria-hidden="true">💵</span>
            </div>
          </div>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-header">
              <span className="dashboard-stat-label">Page Items</span>
              <span className="dashboard-stat-badge badge-stat-amber">
                Current Page
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="dashboard-stat-value mb-0">{pageTotalItems}</h3>
              <span className="fs-4 text-muted" aria-hidden="true">📦</span>
            </div>
          </div>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-header">
              <span className="dashboard-stat-label">Showing Carts</span>
              <span className="dashboard-stat-badge badge-stat-blue">
                Showing
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="dashboard-stat-value mb-0">{displayedCount}</h3>
              <span className="fs-4 text-muted" aria-hidden="true">📊</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* Main Table Card (Figma Page 9: Recent Cart Activity) */}
      <div className="dashboard-table-card">
        {/* Table Toolbar */}
        <div className="dashboard-table-toolbar">
          <div className="d-flex align-items-center gap-2">
            <h5 className="dashboard-card-title mb-0">Recent Cart Activity</h5>
            {activeUserFilter && (
              <span className="badge bg-primary-subtle text-primary fw-semibold" style={{ fontSize: '0.75rem' }}>
                Filtered: User #{activeUserFilter}
              </span>
            )}
          </div>

          <div className="dashboard-toolbar-actions">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleExportCSV}
              className="btn-dashboard-tool"
              disabled={carts.length === 0}
              title="Export currently displayed page as CSV"
            >
              📥 Export CSV (Page)
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleRefresh}
              className="btn-dashboard-tool"
              title="Refresh carts list"
            >
              🔄 Refresh
            </Button>
          </div>
        </div>

        {/* Loading / Error / Empty / Table Content */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" role="status" />
            <p className="mt-3 text-muted">Loading carts directory...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <Alert variant="danger" className="d-inline-block text-start mb-3">
              {error}
            </Alert>
            <div>
              <Button variant="primary" size="sm" onClick={handleRefresh}>
                Retry
              </Button>
            </div>
          </div>
        ) : carts.length === 0 ? (
          <div className="text-center py-5">
            <div className="fs-1 mb-2 text-muted">🛍️</div>
            <h5 className="fw-bold">No Carts Found</h5>
            <p className="text-muted small">
              {activeUserFilter
                ? `No carts found for User #${activeUserFilter}.`
                : 'There are currently no customer carts recorded.'}
            </p>
          </div>
        ) : (
          <div className="dashboard-table-responsive">
            <Table hover className="dashboard-table align-middle mb-0">
              <thead>
                <tr>
                  <th>CART ID</th>
                  <th>USER</th>
                  <th>PRODUCTS PREVIEW</th>
                  <th>TOTAL ITEMS</th>
                  <th>TOTAL PRICE</th>
                  <th className="text-end">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {carts.map((cart) => {
                  const products = cart.products || []
                  const previewThumbs = products.slice(0, 3)
                  const remainingCount = products.length - 3

                  return (
                    <tr key={cart.id}>
                      {/* CART ID */}
                      <td>
                        <span className="cart-id-badge font-monospace">
                          #CRT-{cart.id}
                        </span>
                      </td>

                      {/* USER ID */}
                      <td>
                        <span className="cart-user-chip">
                          👤 User #{cart.userId}
                        </span>
                      </td>

                      {/* PRODUCTS PREVIEW */}
                      <td>
                        <div className="cart-products-preview">
                          {previewThumbs.map((p) => (
                            <img
                              key={p.id}
                              src={
                                p.thumbnail ||
                                PRODUCT_PLACEHOLDER_IMAGE
                              }
                              alt={p.title}
                              className="cart-preview-thumb"
                              title={`${p.title} (Qty: ${p.quantity})`}
                              onError={(e) => {
                                e.currentTarget.src =
                                  PRODUCT_PLACEHOLDER_IMAGE
                              }}
                            />
                          ))}
                          {remainingCount > 0 && (
                            <span className="cart-preview-more">
                              +{remainingCount}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* TOTAL ITEMS */}
                      <td>
                        <div>
                          <span className="fw-semibold text-dark">
                            {cart.totalQuantity} items
                          </span>
                          <span className="text-muted small d-block">
                            ({cart.totalProducts} unique)
                          </span>
                        </div>
                      </td>

                      {/* TOTAL PRICE */}
                      <td>
                        <div>
                          <span className="dashboard-price-text">
                            ${Number(cart.total).toFixed(2)}
                          </span>
                          {cart.discountedTotal &&
                            cart.discountedTotal < cart.total && (
                              <span className="text-success small d-block">
                                Disc: ${Number(cart.discountedTotal).toFixed(2)}
                              </span>
                            )}
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="text-end dashboard-actions-cell">
                        <button
                          type="button"
                          className="btn-action-icon"
                          onClick={() => handleOpenDetails(cart)}
                          title="View Cart Details"
                          aria-label={`View Cart ${cart.id}`}
                        >
                          👁️
                        </button>
                        <button
                          type="button"
                          className="btn-action-icon"
                          onClick={() => handleOpenEditModal(cart)}
                          title="Edit Cart"
                          aria-label={`Edit Cart ${cart.id}`}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="btn-action-icon btn-action-delete"
                          onClick={() => handleOpenDeleteModal(cart)}
                          title="Delete Cart"
                          aria-label={`Delete Cart ${cart.id}`}
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
        {!loading && !error && carts.length > 0 && (
          <DashboardPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={total}
            pageSize={PAGE_SIZE}
            itemLabel="carts"
            ariaLabel="Carts pagination"
          />
        )}
      </div>

      {/* Two-Column Lower Section: Abandoned Cart Recovery & System Alerts (Figma Page 9) */}
      <Row className="g-4 my-4">
        {/* Left Column: Abandoned Cart Recovery */}
        <Col xs={12} lg={8}>
          <div className="cart-insights-card">
            <div className="cart-insights-layout">
              <div className="cart-insights-thumb-wrapper">
                <img
                  src={cartInsightsThumb}
                  alt="Abandoned Cart Recovery Dashboard Preview"
                  className="cart-insights-thumb-image"
                />
              </div>

              <div className="cart-insights-content">
                <div className="mb-2">
                  <span className="cart-insights-badge">INSIGHTS</span>
                </div>
                <h4 className="cart-insights-title">Abandoned Cart Recovery</h4>
                <p className="cart-insights-desc">
                  Our AI detected a 14% increase in abandoned high-value carts this week.
                  Consider launching an automated &ldquo;Complete Your Purchase&rdquo; email campaign with a 5% discount incentive.
                </p>
                <div className="d-flex align-items-center gap-2">
                  <a
                    href="#campaign-settings"
                    onClick={(e) => e.preventDefault()}
                    className="cart-insights-link"
                    title="Simulated demo campaign settings"
                  >
                    View Campaign Settings &rarr;
                  </a>
                  <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.65rem' }}>
                    Demo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Col>

        {/* Right Column: System Alerts (Dark Card) */}
        <Col xs={12} lg={4}>
          <div className="cart-alerts-card">
            <div>
              <div className="cart-alerts-top-header">
                <div className="cart-alerts-icon-box" aria-hidden="true">
                  🔔
                </div>
                <span className="cart-alerts-status-dot" title="System Operational" />
              </div>

              <h4 className="cart-alerts-title">System Alerts</h4>

              <div className="cart-alerts-list">
                {alertsDismissed ? (
                  <div className="text-secondary small py-3 text-center">
                    ✓ All alerts dismissed
                  </div>
                ) : (
                  <>
                    <div className="cart-alert-item-figma cart-alert-item-figma--success">
                      Payment gateway response time is optimal (142ms).
                    </div>
                    <div className="cart-alert-item-figma cart-alert-item-figma--danger">
                      Unusually large cart {highestValueCart ? `(#CRT-${highestValueCart.id})` : '(#CRT-88209)'} flagged for verification.
                    </div>
                  </>
                )}
              </div>
            </div>

            <Button
              type="button"
              className="w-100 btn-cart-alerts-dismiss"
              onClick={() => setAlertsDismissed(true)}
              disabled={alertsDismissed}
            >
              Dismiss All
            </Button>
          </div>
        </Col>
      </Row>

      {/* ============================================================
          CART DETAILS MODAL (Step 10)
          ============================================================ */}
      <CartDetailsModal
        show={showDetailsModal}
        selectedCart={selectedCart}
        loading={detailsLoading}
        error={detailsError}
        onClose={handleCloseDetailsModal}
      />

      {/* ============================================================
          CART FORM MODAL (Add & Edit - Step 11 & 12)
          ============================================================ */}
      <CartFormModal
        show={showFormModal}
        mode={formMode}
        formData={cartForm}
        errors={cartFormErrors}
        loading={isFormSubmitting}
        selectedCart={selectedCartForEdit}
        onChange={handleFormChange}
        onProductRowChange={handleProductRowChange}
        onAddProductRow={handleAddProductRow}
        onRemoveProductRow={handleRemoveProductRow}
        onSubmit={handleFormSubmit}
        onClose={handleCloseFormModal}
      />

      {/* ============================================================
          DELETE CART CONFIRMATION MODAL (Step 13)
          ============================================================ */}
      <DeleteCartModal
        show={showDeleteModal}
        cartToDelete={cartToDelete}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={handleCloseDeleteModal}
      />
    </div>
  )
}

export default CartsAdmin
