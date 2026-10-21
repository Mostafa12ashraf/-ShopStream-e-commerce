import { Link, useLocation } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'

const CURRENT_YEAR = new Date().getFullYear()

function StoreFooter() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  // Multi-column footer variant matching Figma Page 5 (Home page)
  if (isHomePage) {
    return (
      <footer className="store-footer store-footer--home">
        <Container fluid>
          <Row className="gy-4 py-5">
            {/* Column 1: Brand & Bio */}
            <Col xs={12} md={4} lg={4}>
              <p className="store-footer__brand fs-4 mb-2">ShopStream</p>
              <p className="store-footer__bio text-muted small mb-3" style={{ maxWidth: '320px', lineHeight: 1.6 }}>
                A premium e-commerce experience dedicated to delivering the world&apos;s most innovative electronics right to your doorstep.
              </p>
              <div className="store-footer__socials d-flex gap-2">
                <span className="store-footer__social-circle" aria-label="Website">🌐</span>
                <span className="store-footer__social-circle" aria-label="Twitter">🐦</span>
                <span className="store-footer__social-circle" aria-label="Email">✉️</span>
              </div>
            </Col>

            {/* Column 2: SHOP */}
            <Col xs={6} md={2} lg={2}>
              <h6 className="footer-col-title">SHOP</h6>
              <ul className="footer-links-vertical">
                <li><Link to="/products">All Products</Link></li>
                <li><Link to="/products?category=smartphones">Smartphones</Link></li>
                <li><Link to="/products?category=laptops">Laptops</Link></li>
                <li><span className="text-muted" style={{ fontSize: '0.875rem', cursor: 'default' }}>Wearables (Unavailable)</span></li>
                <li><span className="text-muted" style={{ fontSize: '0.875rem', cursor: 'default' }}>New Arrivals (Unavailable)</span></li>
              </ul>
            </Col>

            {/* Column 3: SUPPORT */}
            <Col xs={6} md={3} lg={3}>
              <h6 className="footer-col-title">SUPPORT</h6>
              <ul className="footer-links-vertical">
                <li><span className="text-muted" style={{ fontSize: '0.875rem', cursor: 'default' }}>Contact Us</span></li>
                <li><span className="text-muted" style={{ fontSize: '0.875rem', cursor: 'default' }}>Shipping Info</span></li>
                <li><span className="text-muted" style={{ fontSize: '0.875rem', cursor: 'default' }}>Returns</span></li>
                <li><span className="text-muted" style={{ fontSize: '0.875rem', cursor: 'default' }}>FAQ</span></li>
              </ul>
            </Col>

            {/* Column 4: LEGAL */}
            <Col xs={12} md={3} lg={3}>
              <h6 className="footer-col-title">LEGAL</h6>
              <ul className="footer-links-vertical">
                <li><span className="text-muted" style={{ fontSize: '0.875rem', cursor: 'default' }}>Privacy Policy</span></li>
                <li><span className="text-muted" style={{ fontSize: '0.875rem', cursor: 'default' }}>Terms of Service</span></li>
              </ul>
            </Col>
          </Row>

          <hr className="my-0 opacity-15" />

          {/* Bottom Bar with Copyright & Payment Icons */}
          <div className="d-flex justify-content-between align-items-center py-3 flex-wrap gap-2">
            <p className="store-footer__copy mb-0">
              © {CURRENT_YEAR} ShopStream Inc. All rights reserved.
            </p>
            <div className="footer-payment-icons d-flex gap-2">
              <span className="payment-card-badge" title="Visa">💳 Visa</span>
              <span className="payment-card-badge" title="Mastercard">💳 MC</span>
              <span className="payment-card-badge" title="Amex">💳 Amex</span>
              <span className="payment-card-badge" title="PayPal">💳 PayPal</span>
            </div>
          </div>
        </Container>
      </footer>
    )
  }

  // Slim footer variant matching Figma Pages 1, 2, 3, 6, 7, 8, 9, 10
  return (
    <footer className="store-footer">
      <Container fluid>
        <Row className="align-items-center py-4 gy-3">
          <Col md={4}>
            <p className="store-footer__brand">ShopStream</p>
            <p className="store-footer__copy">
              © {CURRENT_YEAR} ShopStream Inc. All rights reserved.
            </p>
          </Col>

          <Col md={5}>
            <nav aria-label="Footer navigation">
              <ul className="store-footer__links">
                <li>
                  <span className="text-muted" style={{ fontSize: '0.875rem', cursor: 'default' }}>
                    Privacy Policy
                  </span>
                </li>
                <li>
                  <span className="text-muted" style={{ fontSize: '0.875rem', cursor: 'default' }}>
                    Terms of Service
                  </span>
                </li>
                <li>
                  <span className="text-muted" style={{ fontSize: '0.875rem', cursor: 'default' }}>
                    Contact Us
                  </span>
                </li>
                <li>
                  <span className="text-muted" style={{ fontSize: '0.875rem', cursor: 'default' }}>
                    Shipping Info
                  </span>
                </li>
              </ul>
            </nav>
          </Col>

          <Col md={3} className="text-md-end">
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

