import { useContext } from 'react'
import { NavLink, Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { AuthContext } from '../../context/AuthContext'
import { ThemeContext } from '../../context/ThemeContext'

function StoreNavbar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  // Read cart items from Redux to calculate total quantity
  const cartItems = useSelector((state) => state.cart.items)
  const totalCartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Auth state and actions from shared AuthContext
  const { isAuthenticated, user, logout } = useContext(AuthContext)

  // Shared Theme Context
  const { theme, toggleTheme } = useContext(ThemeContext)

  function handleLogout() {
    logout()
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
            <Nav.Link as={NavLink} to="/dashboard">
              Dashboard
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
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="store-theme-toggle-btn me-1"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

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
