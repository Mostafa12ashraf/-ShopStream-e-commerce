import { NavLink, Outlet } from 'react-router-dom'
import { Container, Row, Col, Nav } from 'react-bootstrap'

// TODO (Phase 3): replace with the real Sidebar/Offcanvas layout
function DashboardLayout() {
  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={2}>
          <Nav className="flex-column border-end pe-3">
            <Nav.Link as={NavLink} to="/dashboard" end>
              Overview
            </Nav.Link>
            <Nav.Link as={NavLink} to="/dashboard/products">
              Products
            </Nav.Link>
            <Nav.Link as={NavLink} to="/dashboard/carts">
              Carts
            </Nav.Link>
            <Nav.Link as={NavLink} to="/dashboard/users">
              Users
            </Nav.Link>
          </Nav>
        </Col>
        <Col md={10}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}

export default DashboardLayout
