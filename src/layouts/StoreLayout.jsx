import { NavLink, Link, Outlet } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'

// Temporary navigation for testing the routes
function StoreLayout() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand as={Link} to="/">
            🛒 E-Commerce
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="store-navbar" />
          <Navbar.Collapse id="store-navbar">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/" end>
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/products">
                Products
              </Nav.Link>
              <Nav.Link as={NavLink} to="/cart">
                Cart
              </Nav.Link>
              <Nav.Link as={NavLink} to="/profile">
                Profile
              </Nav.Link>
              <Nav.Link as={NavLink} to="/dashboard">
                Dashboard
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link as={NavLink} to="/login">
                Login
              </Nav.Link>
              <Nav.Link as={NavLink} to="/register">
                Register
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
    </>
  )
}

export default StoreLayout
