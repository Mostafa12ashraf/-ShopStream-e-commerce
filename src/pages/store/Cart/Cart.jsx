import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Modal, Button } from 'react-bootstrap'
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from '../../../redux/cartSlice'
import CartItem from '../../../components/store/CartItem'
import './Cart.css'

function Cart() {
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.items)
  const [showSupportModal, setShowSupportModal] = useState(false)

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )
  const shipping = 0
  const taxRate = 0.08
  const tax = subtotal * taxRate
  const total = subtotal + shipping + tax

  // ── Empty Cart State ──
  if (cartItems.length === 0) {
    return (
      <Container className="empty-cart-page py-5 text-center">
        <div className="empty-cart-illustration-wrapper mb-4">
          <div className="empty-cart-circle">
            <span className="empty-cart-icon" aria-hidden="true">🛒</span>
          </div>
        </div>

        <h2 className="empty-cart-title mb-2">Your cart is feeling light</h2>
        <p className="empty-cart-subtitle text-muted mb-4">
          It looks like you haven't added anything to your cart yet.
          <br />
          Let's find something special for you.
        </p>

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to="/products" className="btn btn-primary btn-start-shopping">
            Start Shopping
          </Link>
          <button
            type="button"
            className="btn btn-outline-secondary btn-view-saved"
            disabled
            title="Saved items feature is not available in this demo"
          >
            View Saved Items (Unavailable)
          </button>
        </div>

        {/* Assistance section matching PDF Page 6 lower section */}
        <div className="empty-cart-assistance mt-5 pt-4 border-top w-100" style={{ maxWidth: '780px' }}>
          <Row className="g-3 justify-content-center text-start mb-4">
            <Col xs={12} md={6}>
              <div className="empty-help-card h-100">
                <h6 className="fw-bold text-primary mb-2">Looking for ideas?</h6>
                <ul className="empty-help-list mb-0">
                  <li>✓ Explore our trending categories.</li>
                  <li>✓ Discover high-rated featured products.</li>
                  <li>✓ Use the top search bar to find specific items.</li>
                </ul>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="empty-chat-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold text-success mb-1">Live Support (Demo)</h6>
                  <p className="small text-muted mb-2">
                    Live chat support is a demo feature and is currently offline in this project.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-success btn-chat-support w-100"
                  onClick={() => setShowSupportModal(true)}
                  title="Open live support demo"
                >
                  💬 Live Chat (Demo)
                </button>
              </div>
            </Col>
          </Row>

          <div className="popular-categories-section">
            <p className="text-muted small fw-bold mb-2">BROWSE POPULAR CATEGORIES</p>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <Link to="/products?category=smartphones" className="btn btn-sm btn-category-pill">
                Smartphones
              </Link>
              <Link to="/products?category=laptops" className="btn btn-sm btn-category-pill">
                Laptops
              </Link>
              <Link to="/products?category=fragrances" className="btn btn-sm btn-category-pill">
                Fragrances
              </Link>
              <Link to="/products?category=groceries" className="btn btn-sm btn-category-pill">
                Groceries
              </Link>
              <Link to="/products" className="btn btn-sm btn-category-pill">
                All Products
              </Link>
            </div>
          </div>
        </div>

        {/* ── Demo Support Modal ── */}
        <Modal
          show={showSupportModal}
          onHide={() => setShowSupportModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="fs-5 fw-bold">Demo Support</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="mb-0">
              This is a frontend demonstration. Live support and support ticket submission are not connected to a real support service.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSupportModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    )
  }

  // ── Cart with Items ──
  return (
    <Container fluid className="cart-page py-4">
      <h2 className="cart-page-title mb-4">Your Shopping Cart</h2>

      <Row className="g-4 align-items-start">
        {/* Left Column: Cart items */}
        <Col xs={12} lg={8}>
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={(id) => dispatch(increaseQuantity(id))}
                onDecrease={(id) => dispatch(decreaseQuantity(id))}
                onRemove={(id) => dispatch(removeFromCart(id))}
              />
            ))}
          </div>
        </Col>

        {/* Right Column: Order Summary */}
        <Col xs={12} lg={4}>
          <div className="order-summary-card">
            <h4 className="summary-card-title mb-3">Order Summary</h4>

            <div className="summary-row">
              <span className="text-muted">Subtotal</span>
              <span className="fw-semibold">${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span className="text-muted">Shipping</span>
              <span className="text-success fw-semibold">Free</span>
            </div>

            <div className="summary-row mb-3">
              <span className="text-muted">Estimated Tax</span>
              <span className="fw-semibold">${tax.toFixed(2)}</span>
            </div>

            <hr className="my-3 opacity-25" />

            <div className="summary-row summary-total-row mb-4">
              <span className="summary-total-label">Total</span>
              <span className="summary-total-val">${total.toFixed(2)}</span>
            </div>

            <Link
              to="/checkout"
              className="btn btn-primary btn-proceed-checkout w-100 mb-3"
            >
              Proceed to Checkout →
            </Link>

            <p className="checkout-disclaimer text-muted small text-center mb-3">
              By proceeding to checkout, you agree to ShopStream's terms and privacy policy.
            </p>

            {/* Delivery badge */}
            <div className="express-delivery-card">
              <span className="delivery-icon" aria-hidden="true">🚚</span>
              <div>
                <p className="delivery-title mb-0">Free Express Delivery</p>
                <small className="text-muted">Arrives in 2-3 business days</small>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Cart
