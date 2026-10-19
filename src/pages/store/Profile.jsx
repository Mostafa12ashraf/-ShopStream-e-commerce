import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap'
import './Profile.css'

function Profile() {
  const navigate = useNavigate()

  // Safely read token from localStorage using lazy initializer
  const [token] = useState(() => localStorage.getItem('token') || '')

  // Safely read cached user from localStorage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [loading, setLoading] = useState(Boolean(token))
  const [error, setError] = useState(null)

  useEffect(() => {
    // If no token exists, prompt redirect
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
          // Update cached user in storage
          localStorage.setItem('user', JSON.stringify(response.data))
        }
      } catch (err) {
        if (isMounted) {
          const status = err.response?.status
          if (status === 401 || status === 403) {
            // Invalid or expired token
            setError('Your session has expired or is invalid. Please sign in again.')
            localStorage.removeItem('token')
            localStorage.removeItem('user')
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

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('authChange'))
    navigate('/login')
  }

  // State when not logged in
  if (!token) {
    return (
      <Container className="profile-page py-5">
        <div className="text-center py-5">
          <div className="mb-3" style={{ fontSize: '3rem' }}>🔒</div>
          <h3 className="fw-bold mb-2">Sign in required</h3>
          <p className="text-muted mb-4">
            You need to be logged in to view and manage your profile.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/login" variant="primary" className="px-4">
              Sign In
            </Button>
            <Button as={Link} to="/register" variant="outline-secondary" className="px-4">
              Create Account
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  if (loading && !user) {
    return (
      <Container className="profile-page py-5 text-center">
        <Spinner animation="border" variant="primary" role="status" />
        <p className="mt-3 text-muted">Loading your profile...</p>
      </Container>
    )
  }

  return (
    <Container className="profile-page">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          {error && (
            <Alert variant="warning" className="mb-4">
              {error}
              <div className="mt-2">
                <Button as={Link} to="/login" variant="warning" size="sm">
                  Go to Login
                </Button>
              </div>
            </Alert>
          )}

          <div className="profile-card">
            {/* Header Gradient Banner */}
            <div className="profile-header-banner" />

            {/* Profile Info Header */}
            <div className="profile-header-body">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-end">
                <div className="profile-avatar-wrapper">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.firstName || 'User'}
                      className="profile-avatar-img"
                    />
                  ) : (
                    <div className="profile-avatar-fallback">👤</div>
                  )}
                </div>

                <div className="mb-3 mb-sm-0 d-flex gap-2">
                  <Button
                    as={Link}
                    to="/products"
                    variant="outline-primary"
                    size="sm"
                    className="profile-action-btn"
                  >
                    🛍️ Browse Store
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="profile-action-btn"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </Button>
                </div>
              </div>

              <h2 className="profile-name">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'ShopStream Member'}
              </h2>
              <p className="profile-username">@{user?.username || 'member'}</p>
              <span className="profile-badge">
                ✓ {user?.role ? user.role.toUpperCase() : 'VERIFIED CUSTOMER'}
              </span>
            </div>

            {/* Account Details Section */}
            <div className="profile-info-section">
              <h5 className="profile-section-title">
                <span>📋</span> Contact Information
              </h5>
              <Row>
                <Col sm={6} className="profile-detail-item">
                  <div className="profile-detail-label">Email Address</div>
                  <div className="profile-detail-val">{user?.email || 'N/A'}</div>
                </Col>
                <Col sm={6} className="profile-detail-item">
                  <div className="profile-detail-label">Phone Number</div>
                  <div className="profile-detail-val">{user?.phone || 'N/A'}</div>
                </Col>
              </Row>
            </div>

            {/* Shipping & Company Section */}
            <div className="profile-info-section">
              <h5 className="profile-section-title">
                <span>📍</span> Location & Details
              </h5>
              <Row>
                <Col sm={6} className="profile-detail-item">
                  <div className="profile-detail-label">City / State</div>
                  <div className="profile-detail-val">
                    {user?.address?.city
                      ? `${user.address.city}, ${user.address.state || ''}`
                      : 'N/A'}
                  </div>
                </Col>
                <Col sm={6} className="profile-detail-item">
                  <div className="profile-detail-label">Address</div>
                  <div className="profile-detail-val">
                    {user?.address?.address || 'N/A'}
                  </div>
                </Col>
                <Col sm={6} className="profile-detail-item">
                  <div className="profile-detail-label">Company / Department</div>
                  <div className="profile-detail-val">
                    {user?.company?.name
                      ? `${user.company.title || ''} at ${user.company.name}`
                      : 'N/A'}
                  </div>
                </Col>
                <Col sm={6} className="profile-detail-item">
                  <div className="profile-detail-label">Gender</div>
                  <div className="profile-detail-val text-capitalize">
                    {user?.gender || 'N/A'}
                  </div>
                </Col>
              </Row>
            </div>

            {/* Quick Actions Footer */}
            <div className="profile-info-section bg-light d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <h6 className="mb-1 fw-bold">Need assistance?</h6>
                <p className="text-muted small mb-0">Our 24/7 support team is here to help with any inquiries.</p>
              </div>
              <div className="d-flex gap-2">
                <Button as={Link} to="/cart" variant="primary" size="sm" className="profile-action-btn">
                  View Cart 🛒
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Profile
