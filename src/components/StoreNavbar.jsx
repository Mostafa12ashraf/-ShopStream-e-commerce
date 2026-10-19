import { NavLink, Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'

function StoreNavbar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

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
      <Container>
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
            <Nav.Link as={NavLink} to="/products">
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
            <NavLink to="/cart" className="store-icon-link" aria-label="Cart">
              🛒
            </NavLink>
            <NavLink to="/profile" className="store-icon-link" aria-label="Profile">
              👤
            </NavLink>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default StoreNavbar
