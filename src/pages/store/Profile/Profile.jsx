import { useState, useEffect, useContext } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import axios from 'axios'
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Modal,
  Form,
  Button,
} from 'react-bootstrap'
import { AuthContext } from '../../../context/AuthContext'
import './Profile.css'

function Profile() {
  const navigate = useNavigate()
  const { token, user, updateUser, logout, isAuthenticated } = useContext(AuthContext)

  const [loading, setLoading] = useState(Boolean(token && !user))
  const [error, setError] = useState(null)
  const [profileAlert, setProfileAlert] = useState(null)

  // Edit Profile Modal States
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  })
  const [editErrors, setEditErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  // Latest Local Order from localStorage
  const [localOrder] = useState(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null
      const saved = window.localStorage.getItem('lastOrder')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (!token) {
      return
    }

    let isMounted = true

    async function fetchUserProfile() {
      try {
        const response = await axios.get('https://dummyjson.com/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (isMounted) {
          updateUser(response.data)
        }
      } catch (err) {
        if (isMounted) {
          const status = err.response?.status
          if (status === 401 || status === 403) {
            logout()
            navigate('/login')
          } else {
            setError(err.message || 'Failed to fetch updated profile information.')
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchUserProfile()

    return () => {
      isMounted = false
    }
  }, [token, logout, navigate, updateUser])

  // Support scroll to order section if navigating with #profile-order-history
  useEffect(() => {
    if (window.location.hash === '#profile-order-history') {
      const el = document.getElementById('profile-order-history')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  function handleScrollToOrders() {
    const el = document.getElementById('profile-order-history')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  function handleSignOut() {
    logout()
    navigate('/login')
  }

  // ============================================================
  // Edit Profile Flow
  // ============================================================
  function handleOpenEdit() {
    setEditForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address?.address || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      postalCode: user?.address?.postalCode || '',
    })
    setEditErrors({})
    setSaveError(null)
    setShowEditModal(true)
  }

  function validateEditForm() {
    const errors = {}
    if (!editForm.firstName.trim()) {
      errors.firstName = 'First name is required.'
    }
    if (!editForm.email.trim()) {
      errors.email = 'Email address is required.'
    } else if (!/\S+@\S+\.\S+/.test(editForm.email.trim())) {
      errors.email = 'Please enter a valid email address.'
    }
    setEditErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleEditSubmit(e) {
    e.preventDefault()
    if (!validateEditForm()) return

    setIsSaving(true)
    setSaveError(null)

    try {
      const userId = user?.id || 1
      const payload = {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        address: {
          ...(user?.address || {}),
          address: editForm.address.trim(),
          city: editForm.city.trim(),
          state: editForm.state.trim(),
          postalCode: editForm.postalCode.trim(),
        },
      }

      const response = await axios.put(
        `https://dummyjson.com/users/${userId}`,
        payload
      )

      // Merge response with existing user data safely, preserving existing fields
      const updatedUser = {
        ...user,
        ...response.data,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        address: {
          ...(user?.address || {}),
          ...(response.data?.address || {}),
          address: payload.address.address,
          city: payload.address.city,
          state: payload.address.state,
          postalCode: payload.address.postalCode,
        },
      }

      // Update AuthContext & localStorage/sessionStorage
      updateUser(updatedUser)

      setShowEditModal(false)
      setProfileAlert({
        type: 'success',
        message:
          'Profile updated in local storage. DummyJSON server updates are simulated and may return to original data after a new login or profile refresh.',
      })
    } catch (err) {
      setSaveError(
        err.response?.data?.message ||
          err.message ||
          'Failed to update profile. Please try again.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  // If user is unauthenticated, redirect directly to login
  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (loading && !user) {
    return (
      <Container className="profile-container-figma py-5 text-center">
        <Spinner animation="border" variant="primary" role="status" />
        <p className="mt-3 text-muted">Loading your profile...</p>
      </Container>
    )
  }

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.username || 'User Profile'

  const displayEmail = user?.email || '—'

  return (
    <Container fluid className="profile-container-figma">
      {profileAlert && (
        <Alert
          variant={profileAlert.type}
          dismissible
          onClose={() => setProfileAlert(null)}
          className="mb-4"
        >
          {profileAlert.message}
        </Alert>
      )}

      {error && (
        <Alert
          variant={error.startsWith('401') ? 'danger' : 'warning'}
          dismissible
          onClose={() => setError(null)}
          className="mb-4"
        >
          {error}
        </Alert>
      )}

      <Row className="g-4">
        {/* ── Left Sidebar Navigation ── */}
        <Col xs={12} lg={3}>
          <div className="profile-sidebar-card">
            <h5 className="profile-sidebar-title">Account</h5>
            <p className="profile-sidebar-subtitle">Manage your settings</p>

            <div className="profile-nav-list">
              <button
                type="button"
                className="profile-nav-item profile-nav-item--active"
              >
                <span>👤</span>
                <span>My Profile</span>
              </button>

              <button
                type="button"
                className="profile-nav-item"
                onClick={handleScrollToOrders}
              >
                <span>🕒</span>
                <span>Order History</span>
              </button>

              <div className="profile-nav-divider" />

              <button
                type="button"
                className="profile-nav-item profile-nav-item--danger"
                onClick={handleSignOut}
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </Col>

        {/* ── Main Content Area ── */}
        <Col xs={12} lg={9}>
          {/* Top Profile Summary Card */}
          <div className="profile-main-card">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="profile-avatar-box">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={displayName}
                      className="profile-avatar-circle"
                    />
                  ) : (
                    <div className="profile-avatar-fallback">👤</div>
                  )}
                </div>

                <div>
                  <h3 className="profile-full-name">{displayName}</h3>
                  <p className="profile-email-text">{displayEmail}</p>

                  <div className="d-flex flex-wrap gap-2">
                    <span className="profile-member-badge-green text-capitalize">
                      {user?.role || 'Member'}
                    </span>
                    <span className="profile-member-badge-gray">
                      @{user?.username || 'user'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-2">
                <button
                  type="button"
                  className="btn btn-profile-primary"
                  onClick={handleOpenEdit}
                  aria-label="Edit Profile"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Real Profile Data Sections */}
          <Row className="g-3 mb-4">
            {/* Account Details */}
            <Col xs={12} md={6}>
              <div className="profile-section-card h-100">
                <h4 className="profile-section-title">
                  <span>📋</span> Account Details
                </h4>
                <div className="profile-info-grid">
                  <div className="profile-info-field">
                    <span className="profile-info-label">Full Name</span>
                    <span className="profile-info-value">{displayName}</span>
                  </div>
                  <div className="profile-info-field">
                    <span className="profile-info-label">Username</span>
                    <span className="profile-info-value">{user?.username || '—'}</span>
                  </div>
                  <div className="profile-info-field">
                    <span className="profile-info-label">Email Address</span>
                    <span className="profile-info-value">{user?.email || '—'}</span>
                  </div>
                  <div className="profile-info-field">
                    <span className="profile-info-label">Phone Number</span>
                    <span className="profile-info-value">{user?.phone || '—'}</span>
                  </div>
                  {user?.gender && (
                    <div className="profile-info-field">
                      <span className="profile-info-label">Gender</span>
                      <span className="profile-info-value text-capitalize">{user.gender}</span>
                    </div>
                  )}
                </div>
              </div>
            </Col>

            {/* Address Details */}
            <Col xs={12} md={6}>
              <div className="profile-section-card h-100">
                <h4 className="profile-section-title">
                  <span>📍</span> Delivery Address
                </h4>
                <div className="profile-info-grid">
                  <div className="profile-info-field">
                    <span className="profile-info-label">Street</span>
                    <span className="profile-info-value">{user?.address?.address || '—'}</span>
                  </div>
                  <div className="profile-info-field">
                    <span className="profile-info-label">City</span>
                    <span className="profile-info-value">{user?.address?.city || '—'}</span>
                  </div>
                  <div className="profile-info-field">
                    <span className="profile-info-label">State / Code</span>
                    <span className="profile-info-value">
                      {user?.address?.state || '—'} {user?.address?.stateCode ? `(${user.address.stateCode})` : ''}
                    </span>
                  </div>
                  <div className="profile-info-field">
                    <span className="profile-info-label">Postal Code</span>
                    <span className="profile-info-value">{user?.address?.postalCode || '—'}</span>
                  </div>
                  <div className="profile-info-field">
                    <span className="profile-info-label">Country</span>
                    <span className="profile-info-value">{user?.address?.country || 'United States'}</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Organization & Education (if available from API) */}
          {(user?.company || user?.university) && (
            <Row className="g-3 mb-4">
              <Col xs={12}>
                <div className="profile-section-card">
                  <h4 className="profile-section-title">
                    <span>🏢</span> Professional & Education
                  </h4>
                  <div className="profile-info-grid">
                    {user?.company?.name && (
                      <div className="profile-info-field">
                        <span className="profile-info-label">Company</span>
                        <span className="profile-info-value">{user.company.name}</span>
                      </div>
                    )}
                    {user?.company?.title && (
                      <div className="profile-info-field">
                        <span className="profile-info-label">Job Title</span>
                        <span className="profile-info-value">{user.company.title}</span>
                      </div>
                    )}
                    {user?.company?.department && (
                      <div className="profile-info-field">
                        <span className="profile-info-label">Department</span>
                        <span className="profile-info-value">{user.company.department}</span>
                      </div>
                    )}
                    {user?.university && (
                      <div className="profile-info-field">
                        <span className="profile-info-label">University</span>
                        <span className="profile-info-value">{user.university}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          )}

          {/* ── Latest Local Order Section (Part A2) ── */}
          <div id="profile-order-history" className="orders-card mb-4">
            <div className="orders-header">
              <div>
                <h4 className="orders-title">Latest Local Order</h4>
                <p className="text-muted small mb-0">
                  Stored from the latest local checkout demonstration.
                </p>
              </div>
              {localOrder && (
                <span className="order-badge-processing">
                  Order #{localOrder.orderNumber}
                </span>
              )}
            </div>

            {localOrder ? (
              <div>
                {/* Order Meta details */}
                <div className="d-flex flex-wrap justify-content-between align-items-center py-2 px-3 profile-order-meta rounded-3 mb-3 border">
                  <div>
                    <span className="small text-muted">Estimated Delivery: </span>
                    <span className="small fw-semibold text-dark">
                      {localOrder.estimatedDelivery || 'In 3-5 business days'}
                    </span>
                  </div>
                  {localOrder.shipping && (
                    <div className="small text-muted">
                      Ship to:{' '}
                      <strong className="text-dark">
                        {localOrder.shipping.firstName} {localOrder.shipping.lastName}
                      </strong>{' '}
                      ({localOrder.shipping.city || ''})
                    </div>
                  )}
                </div>

                {/* Ordered Items List */}
                <div className="mb-3">
                  {localOrder.items?.map((item) => (
                    <div key={item.id} className="order-row-item">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="order-thumb-img"
                        />
                      ) : (
                        <div
                          className="order-thumb-img d-flex align-items-center justify-content-center text-white"
                          style={{ backgroundColor: '#4338ca' }}
                        >
                          📦
                        </div>
                      )}
                      <div className="order-meta-info">
                        <div className="order-item-title">{item.title}</div>
                        <div className="order-item-sub">
                          Qty: {item.quantity} &bull; Unit: ${Number(item.price).toFixed(2)}
                        </div>
                      </div>
                      <div className="order-status-col">
                        <div className="order-item-price">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="p-3 profile-order-summary rounded-3 border">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Subtotal:</span>
                    <span className="text-dark fw-semibold">
                      ${Number(localOrder.subtotal || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Shipping:</span>
                    <span className="text-success fw-semibold">
                      {localOrder.shippingFee === 0 ? 'FREE' : `$${Number(localOrder.shippingFee || 0).toFixed(2)}`}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span>Tax:</span>
                    <span className="text-dark fw-semibold">
                      ${Number(localOrder.tax || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between pt-2 border-top">
                    <span className="fw-bold text-dark">Order Total:</span>
                    <span className="fw-bold text-primary fs-6">
                      ${Number(localOrder.total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {localOrder.shipping?.address && (
                  <div className="mt-3 small text-muted">
                    <span>📍 Shipping Address: </span>
                    <span className="text-dark">
                      {localOrder.shipping.address}, {localOrder.shipping.city}{' '}
                      {localOrder.shipping.zipCode}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="fs-1 mb-2 text-muted">📦</div>
                <h5 className="fw-bold text-dark mb-2">No Local Checkout Order Available</h5>
                <p
                  className="text-muted small mb-3"
                  style={{ maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}
                >
                  No local checkout order is available yet. Complete a checkout to see the latest local order here.
                  DummyJSON does not provide persistent remote order history.
                </p>
                <Link to="/products" className="btn btn-sm btn-outline-primary">
                  Browse Catalog
                </Link>
              </div>
            )}
          </div>

          {/* Honest Order History Notice */}
          <div className="profile-section-card">
            <h4 className="profile-section-title">
              <span>📦</span> Order & Activity Status
            </h4>
            <p className="text-secondary small mb-3">
              Orders placed in this application are simulated for the current checkout demonstration.
              Because DummyJSON is an educational mock REST service, remote order histories, persistent wallet balances,
              and loyalty points are not stored on remote user accounts.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <span className="profile-member-badge-gray">
                Order History: Stored from latest local checkout
              </span>
              <span className="profile-member-badge-gray">
                Wallet: Not supported by mock API
              </span>
              <span className="profile-member-badge-gray">
                Loyalty: Not supported by mock API
              </span>
            </div>
          </div>
        </Col>
      </Row>

      {/* ============================================================
          EDIT PROFILE MODAL (Part A1)
          ============================================================ */}
      <Modal
        show={showEditModal}
        onHide={() => !isSaving && setShowEditModal(false)}
        size="lg"
        centered
        className="profile-modal"
      >
        <Modal.Header closeButton>
          <div>
            <Modal.Title className="fw-bold text-dark fs-5">
              Edit Profile
            </Modal.Title>
            <p className="text-muted small mb-0">
              Update personal details for {displayName}
            </p>
          </div>
        </Modal.Header>

        <Form onSubmit={handleEditSubmit}>
          <Modal.Body className="p-4">
            {saveError && (
              <Alert variant="danger" className="py-2 small mb-3">
                {saveError}
              </Alert>
            )}

            <h6 className="fw-bold text-dark mb-3 small text-uppercase" style={{ letterSpacing: '0.04em' }}>
              👤 Personal Details
            </h6>

            <Row className="g-3 mb-4">
              <Col xs={12} sm={6}>
                <Form.Group controlId="editFirstName">
                  <Form.Label className="form-label-dashboard">First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, firstName: e.target.value })
                    }
                    isInvalid={Boolean(editErrors.firstName)}
                    className="form-control-dashboard"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col xs={12} sm={6}>
                <Form.Group controlId="editLastName">
                  <Form.Label className="form-label-dashboard">Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, lastName: e.target.value })
                    }
                    className="form-control-dashboard"
                  />
                </Form.Group>
              </Col>

              <Col xs={12} sm={6}>
                <Form.Group controlId="editEmail">
                  <Form.Label className="form-label-dashboard">Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    isInvalid={Boolean(editErrors.email)}
                    className="form-control-dashboard"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col xs={12} sm={6}>
                <Form.Group controlId="editPhone">
                  <Form.Label className="form-label-dashboard">Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="form-control-dashboard"
                    placeholder="+1 555-0199"
                  />
                </Form.Group>
              </Col>
            </Row>

            <h6 className="fw-bold text-dark mb-3 small text-uppercase" style={{ letterSpacing: '0.04em' }}>
              📍 Delivery Address
            </h6>

            <Row className="g-3">
              <Col xs={12}>
                <Form.Group controlId="editStreetAddress">
                  <Form.Label className="form-label-dashboard">Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm({ ...editForm, address: e.target.value })
                    }
                    className="form-control-dashboard"
                    placeholder="123 Main St, Apt 4B"
                  />
                </Form.Group>
              </Col>

              <Col xs={12} sm={4}>
                <Form.Group controlId="editCity">
                  <Form.Label className="form-label-dashboard">City</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.city}
                    onChange={(e) =>
                      setEditForm({ ...editForm, city: e.target.value })
                    }
                    className="form-control-dashboard"
                  />
                </Form.Group>
              </Col>

              <Col xs={12} sm={4}>
                <Form.Group controlId="editState">
                  <Form.Label className="form-label-dashboard">State</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.state}
                    onChange={(e) =>
                      setEditForm({ ...editForm, state: e.target.value })
                    }
                    className="form-control-dashboard"
                  />
                </Form.Group>
              </Col>

              <Col xs={12} sm={4}>
                <Form.Group controlId="editPostalCode">
                  <Form.Label className="form-label-dashboard">Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.postalCode}
                    onChange={(e) =>
                      setEditForm({ ...editForm, postalCode: e.target.value })
                    }
                    className="form-control-dashboard"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="dashboard-info-notice mt-4">
              <span>ℹ️</span>
              <div>
                Profile changes are stored in the active local or session login storage. DummyJSON server updates are simulated and may return to the original data after a new server-based login or profile refresh.
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer className="px-4 py-3">
            <Button
              variant="outline-secondary"
              onClick={() => setShowEditModal(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSaving}
              style={{ backgroundColor: '#4338ca', borderColor: '#4338ca' }}
            >
              {isSaving ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Saving Profile...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default Profile
