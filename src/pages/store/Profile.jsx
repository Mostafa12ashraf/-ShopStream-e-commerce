import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap'

// Asset imports for recent order thumbnails matching Figma
import heroHeadphones from '../../assets/hero_headphones.jpg'
import catWearables from '../../assets/cat_wearables.jpg'
import catComputing from '../../assets/cat_computing.jpg'

import './Profile.css'

function Profile() {
  const navigate = useNavigate()

  // Safely read token using lazy initializer
  const [token] = useState(() => localStorage.getItem('token') || sessionStorage.getItem('token') || '')

  // Safely read cached user from localStorage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user') || sessionStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [loading, setLoading] = useState(Boolean(token))
  const [error, setError] = useState(null)

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
          setUser(response.data)
          localStorage.setItem('user', JSON.stringify(response.data))
        }
      } catch (err) {
        if (isMounted) {
          const status = err.response?.status
          if (status === 401 || status === 403) {
            setError('Your session has expired. Please sign in again.')
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('user')
            window.dispatchEvent(new Event('authChange'))
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
  }, [token])

  function handleSignOut() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    window.dispatchEvent(new Event('authChange'))
    navigate('/login')
  }

  // If user is not authenticated, show sign-in prompt
  if (!token) {
    return (
      <Container className="profile-container-figma py-5">
        <div className="text-center py-5">
          <div className="mb-3" style={{ fontSize: '3rem' }}>🔒</div>
          <h3 className="fw-bold mb-2">Sign In Required</h3>
          <p className="text-muted mb-4">
            You must be signed in to view and manage your profile.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/login" className="btn btn-profile-primary px-4">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-profile-outline px-4">
              Create Account
            </Link>
          </div>
        </div>
      </Container>
    )
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
    ? `${user.firstName} ${user.lastName || ''}`
    : 'Julian Sterling'

  const displayEmail = user?.email || 'julian.sterling@example.com'

  return (
    <Container fluid className="profile-container-figma">
      {error && (
        <Alert variant="warning" className="mb-4">
          {error}
          <div className="mt-2">
            <Link to="/login" className="btn btn-sm btn-warning">
              Go to Login
            </Link>
          </div>
        </Alert>
      )}

      <Row className="g-4">
        {/* ── Left Sidebar Navigation (Figma Image 1) ── */}
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

              <Link
                to="/products"
                className="profile-nav-item"
              >
                <span>🕒</span>
                <span>Order History</span>
              </Link>

              <Link
                to="/cart"
                className="profile-nav-item"
              >
                <span>⚙️</span>
                <span>Account Settings</span>
              </Link>

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

        {/* ── Main Content Area (Figma Image 1) ── */}
        <Col xs={12} lg={9}>
          {/* Top Profile Summary Card */}
          <div className="profile-main-card">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="profile-avatar-box">
                  <img
                    src={user?.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                    alt={displayName}
                    className="profile-avatar-circle"
                  />
                  <span className="profile-edit-avatar-badge" title="Change photo">
                    ✏
                  </span>
                </div>

                <div>
                  <h3 className="profile-full-name">{displayName}</h3>
                  <p className="profile-email-text">{displayEmail}</p>

                  <div className="d-flex flex-wrap gap-2">
                    <span className="profile-member-badge-green">
                      Premium Member
                    </span>
                    <span className="profile-member-badge-gray">
                      Member since 2022
                    </span>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-2">
                <button
                  type="button"
                  className="btn btn-profile-primary"
                  onClick={() => {}}
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="btn btn-profile-outline"
                  onClick={() => {}}
                >
                  View Analytics
                </button>
              </div>
            </div>
          </div>

          {/* Three Metric / Stat Cards in a row */}
          <Row className="g-3 mb-4">
            <Col xs={12} sm={4}>
              <div className="profile-stat-card">
                <div className="stat-icon-wrapper stat-icon-purple">
                  🛍️
                </div>
                <span className="stat-pill-highlight">+2 this month</span>
                <div className="stat-label">Total Orders</div>
                <h4 className="stat-value">24</h4>
              </div>
            </Col>

            <Col xs={12} sm={4}>
              <div className="profile-stat-card">
                <div className="stat-icon-wrapper stat-icon-green">
                  💳
                </div>
                <div className="stat-label">Wallet Balance</div>
                <h4 className="stat-value">$1,248.50</h4>
              </div>
            </Col>

            <Col xs={12} sm={4}>
              <div className="profile-stat-card">
                <div className="stat-icon-wrapper stat-icon-blue">
                  ⭐
                </div>
                <div className="stat-label">Loyalty Points</div>
                <h4 className="stat-value">4,800</h4>
              </div>
            </Col>
          </Row>

          {/* Recent Orders Card */}
          <div className="orders-card">
            <div className="orders-header">
              <h4 className="orders-title">Recent Orders</h4>
              <Link to="/products" className="orders-view-all">
                View All
              </Link>
            </div>

            {/* Order Row 1 */}
            <div className="order-row-item">
              <img
                src={heroHeadphones}
                alt="StreamX Pro Wireless Headphones"
                className="order-thumb-img"
              />
              <div className="order-meta-info">
                <h6 className="order-item-title">
                  StreamX Pro Wireless Headphones
                </h6>
                <p className="order-item-sub">
                  Order #SS-98231 &bull; Placed on Oct 12, 2023
                </p>
              </div>
              <div className="order-status-col">
                <div className="order-item-price">$299.00</div>
                <span className="order-badge-delivered">Delivered</span>
                <Link to="/products" className="order-action-link">
                  Track Package
                </Link>
              </div>
            </div>

            {/* Order Row 2 */}
            <div className="order-row-item">
              <img
                src={catWearables}
                alt="Quantum Watch Series 4"
                className="order-thumb-img"
              />
              <div className="order-meta-info">
                <h6 className="order-item-title">Quantum Watch Series 4</h6>
                <p className="order-item-sub">
                  Order #SS-98442 &bull; Placed on Oct 15, 2023
                </p>
              </div>
              <div className="order-status-col">
                <div className="order-item-price">$449.00</div>
                <span className="order-badge-shipped">Shipped</span>
                <Link to="/products" className="order-action-link">
                  Track Package
                </Link>
              </div>
            </div>

            {/* Order Row 3 */}
            <div className="order-row-item">
              <img
                src={catComputing}
                alt="Mechanical Chroma Keyboard"
                className="order-thumb-img"
              />
              <div className="order-meta-info">
                <h6 className="order-item-title">
                  Mechanical Chroma Keyboard
                </h6>
                <p className="order-item-sub">
                  Order #SS-98771 &bull; Placed on Oct 18, 2023
                </p>
              </div>
              <div className="order-status-col">
                <div className="order-item-price">$189.00</div>
                <span className="order-badge-processing">Processing</span>
                <Link to="/products" className="order-action-link">
                  Edit Order
                </Link>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Profile
