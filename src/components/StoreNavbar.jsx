import { useState, useEffect } from 'react'
import { NavLink, Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'

function StoreNavbar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  // Read cart items from Redux to calculate total quantity
  const cartItems = useSelector((state) => state.cart.items)
  const totalCartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Helper to read active token and user
  function getActiveToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || ''
  }

  function getActiveUser() {
    try {
      const saved = localStorage.getItem('user') || sessionStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  }

  // Auth state initialized directly from storage
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getActiveToken()))
  const [user, setUser] = useState(() => getActiveUser())

  // Sync auth state when storage or authChange event fires
  useEffect(() => {
    function handleAuthSync() {
      setIsAuthenticated(Boolean(getActiveToken()))
      setUser(getActiveUser())
    }

    window.addEventListener('storage', handleAuthSync)
    window.addEventListener('authChange', handleAuthSync)

    return () => {
      window.removeEventListener('storage', handleAuthSync)
      window.removeEventListener('authChange', handleAuthSync)
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
    window.dispatchEvent(new Event('authChange'))
    navigate('/login')
  }


  const currentSearch = searchParams.get('search') || ''

  function handleSearchChange(e) {
    const value = e.target.value
    if (location.pathname === '/products') {
      if (value) {
        setSearchParams({ search: value })
      } else {
        setSearchParams({})
      }
    } else {
      navigate(`/products?search=${encodeURIComponent(value)}`)
    }
  }

  return (
    <Navbar expand="lg" className="store-navbar">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="store-brand">
          ShopStream
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="store-nav-collapse" />

        <Navbar.Collapse id="store-nav-collapse">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/products">
              Products
            </Nav.Link>
            <Nav.Link as={Link} to="/products#categories">
              Categories
            </Nav.Link>
          </Nav>

          <div className="store-search-wrapper me-3">
            <span className="store-search-icon" aria-hidden="true">🔍</span>
            <input
              type="search"
              placeholder="Search products..."
              value={currentSearch}
              onChange={handleSearchChange}
              className="store-search-input"
              aria-label="Search products"
            />
          </div>

          <div className="store-nav-icons">
            {/* Cart Icon Link */}
            <NavLink to="/cart" className="store-icon-link position-relative me-2" aria-label="Cart">
              🛒
              {totalCartQuantity > 0 && (
                <span className="cart-badge">{totalCartQuantity}</span>
              )}
            </NavLink>

            {/* Dynamic Auth Section */}
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                <NavLink to="/profile" className="store-user-chip" aria-label="Profile">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.firstName || 'User'}
                      className="store-nav-avatar"
                    />
                  ) : (
                    <span>👤</span>
                  )}
                  <span>{user?.firstName ? user.firstName : 'Profile'}</span>
                </NavLink>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleLogout}
                  className="nav-auth-btn"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-primary"
                  size="sm"
                  className="nav-auth-btn"
                >
                  Sign In
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  size="sm"
                  className="nav-auth-btn text-white"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default StoreNavbar
