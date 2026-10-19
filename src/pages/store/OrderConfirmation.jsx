import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import './OrderConfirmation.css'

function OrderConfirmation() {
  // Read lastOrder directly on initial render
  const [order] = useState(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null
      const saved = window.localStorage.getItem('lastOrder')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // If no order exists in localStorage
  if (!order) {
    return (
      <Container className="confirmation-fallback py-5 text-center">
        <div className="empty-cart-circle mb-3">
          <span className="empty-cart-icon" aria-hidden="true">📦</span>
        </div>
        <h3 className="mb-2">No recent order found</h3>
        <p className="text-muted mb-4">
          It looks like there is no active order confirmation to display right now.
        </p>
        <Link to="/products" className="btn btn-primary btn-continue-shopping">
          Start Shopping
        </Link>
      </Container>
    )
  }

  const {
    orderNumber,
    items = [],
    shipping = {},
    subtotal = 0,
    tax = 0,
    total = 0,
    estimatedDelivery = 'in 3-5 business days',
  } = order

  const customerName = `${shipping.firstName || ''} ${shipping.lastName || ''}`.trim() || 'Customer'

  return (
    <Container fluid="xl" className="confirmation-page py-4">
      {/* ── Success Header ── */}
      <div className="confirmation-header text-center mb-5">
        <div className="success-icon-circle mb-3">
          <span className="success-icon" aria-hidden="true">✓</span>
        </div>
        <h2 className="confirmation-title mb-2">
          Order #{orderNumber} Confirmed
        </h2>
        <p className="confirmation-subtitle text-muted mb-0">
          Woohoo! Your order has been placed successfully. We've prepared everything for {customerName}.
        </p>
      </div>

      {/* ── Two-Column Showcase ── */}
      <Row className="g-4 align-items-start mb-5">
        {/* Left Column: Estimated Delivery & Progress */}
        <Col xs={12} lg={7}>
          <div className="confirmation-card mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0 fw-bold">Estimated Delivery</h5>
              <span className="fs-5" aria-hidden="true">🚚</span>
            </div>

            <p className="delivery-highlight-date mb-4">{estimatedDelivery}</p>

            {/* Visual Order Progress Bar */}
            <div className="order-progress-tracker mb-4">
              <div className="progress-step progress-step--completed">
                <span className="step-circle">✓</span>
                <span className="step-name">Placed</span>
              </div>
              <div className="progress-track progress-track--active" />
              <div className="progress-step progress-step--active">
                <span className="step-circle">📦</span>
                <span className="step-name">Processing</span>
              </div>
              <div className="progress-track" />
              <div className="progress-step">
                <span className="step-circle">🚚</span>
                <span className="step-name">Shipped</span>
              </div>
            </div>

            <hr className="my-4 opacity-25" />

            {/* Shipping Address & Method */}
            <Row className="g-3">
              <Col sm={6}>
                <p className="section-subheading mb-1">SHIPPING ADDRESS</p>
                <p className="address-text mb-0">
                  <strong>{customerName}</strong>
                  <br />
                  {shipping.address}
                  <br />
                  {shipping.city}{shipping.zipCode ? `, ${shipping.zipCode}` : ''}
                  {shipping.phone && (
                    <>
                      <br />
                      <small className="text-muted">{shipping.phone}</small>
                    </>
                  )}
                </p>
              </Col>

              <Col sm={6}>
                <p className="section-subheading mb-1">SHIPPING METHOD</p>
                <p className="address-text mb-0">
                  Express Delivery (2-3 Business Days)
                </p>
              </Col>
            </Row>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3 flex-wrap">
            <Link to="/products" className="btn btn-primary btn-continue-shopping">
              Continue Shopping
            </Link>
            <button
              type="button"
              className="btn btn-outline-secondary btn-order-history"
              disabled
              title="Order history is not implemented in this demo"
            >
              View Order History
            </button>
          </div>
        </Col>

        {/* Right Column: Order Summary */}
        <Col xs={12} lg={5}>
          <div className="confirmation-card">
            <h5 className="mb-3 fw-bold">Order Summary</h5>

            {/* Ordered Items List */}
            <div className="ordered-items-list mb-3">
              {items.map((item) => (
                <div key={item.id} className="ordered-item-row">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="ordered-item-thumb"
                  />
                  <div className="ordered-item-info">
                    <p className="ordered-item-name mb-0">{item.title}</p>
                    <small className="text-muted">Qty: {item.quantity}</small>
                  </div>
                  <span className="ordered-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <hr className="my-3 opacity-25" />

            {/* Calculations */}
            <div className="summary-row">
              <span className="text-muted">Subtotal</span>
              <span className="fw-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span className="text-muted">Shipping</span>
              <span className="text-success fw-semibold">FREE</span>
            </div>
            <div className="summary-row mb-3">
              <span className="text-muted">Tax</span>
              <span className="fw-semibold">${tax.toFixed(2)}</span>
            </div>

            <hr className="my-3 opacity-25" />

            <div className="summary-row summary-total-row">
              <span className="summary-total-label">Total</span>
              <span className="summary-total-val">${total.toFixed(2)}</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* ── Need Help Banner ── */}
      <div className="help-support-banner d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <span className="help-icon-circle" aria-hidden="true">?</span>
          <div>
            <p className="help-banner-title mb-0">Need help with your order?</p>
            <small className="help-banner-text">
              Our support team is available 24/7. Reference order #{orderNumber} when contacting us.
            </small>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-contact-support"
          onClick={() => {}}
        >
          Contact Support
        </button>
      </div>
    </Container>
  )
}

export default OrderConfirmation
