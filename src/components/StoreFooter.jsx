import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'

function StoreFooter() {
  function preventJump(e) {
    e.preventDefault()
  }

  return (
    <footer className="store-footer">
      <Container>
        <Row className="align-items-center py-4 gy-3">
          <Col md={4}>
            <p className="store-footer__brand">ShopStream</p>
            <p className="store-footer__copy">
              © 2024 ShopStream Inc. All rights reserved.
            </p>
          </Col>

          <Col md={4}>
            <nav aria-label="Footer navigation">
              <ul className="store-footer__links">
                <li>
                  <Link to="#" onClick={preventJump}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="#" onClick={preventJump}>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="#" onClick={preventJump}>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="#" onClick={preventJump}>
                    Shipping Info
                  </Link>
                </li>
              </ul>
            </nav>
          </Col>

          <Col md={4} className="text-md-end">
            <span className="store-footer__icon" aria-label="Website">
              🌐
            </span>
            <span className="store-footer__icon" aria-label="Email">
              ✉️
            </span>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default StoreFooter
