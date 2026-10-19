import { NavLink, Link } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'

function StoreNavbar() {
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
