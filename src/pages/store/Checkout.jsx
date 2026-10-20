import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Form } from 'react-bootstrap'
import { clearCart } from '../../redux/cartSlice'
import './Checkout.css'

// Helper: Calculate estimated delivery date 4 days ahead
function getEstimatedDeliveryDate() {
  const delivery = new Date()
  delivery.setDate(delivery.getDate() + 4)
  return delivery.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

// Helper: Get current timestamp
function getCurrentTimestamp() {
  return new Date().toISOString()
}

// Helper: Generate educational 5-digit order number
function getNewOrderNumber() {
  return Math.floor(10000 + Math.random() * 90000).toString()
}

function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.items)

  // Redirect to cart if empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart')
    }
  }, [cartItems.length, navigate])

  // ── Form State ───────────────────────────────────────────────
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
  })
  const [shippingErrors, setShippingErrors] = useState({})

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  })
  const [cardErrors, setCardErrors] = useState({})

  // ── Cart Calculations ────────────────────────────────────────
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )
  const shipping = 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  // ── Handlers ─────────────────────────────────────────────────
  function handleShippingChange(e) {
    const { name, value } = e.target
    setShippingData((prev) => ({ ...prev, [name]: value }))
    if (shippingErrors[name]) {
      setShippingErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function handleCardChange(e) {
    const { name, value } = e.target
    setCardData((prev) => ({ ...prev, [name]: value }))
    if (cardErrors[name]) {
      setCardErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function validateForm() {
    const sErrors = {}
    if (!shippingData.firstName.trim()) sErrors.firstName = 'First name is required'
    if (!shippingData.lastName.trim()) sErrors.lastName = 'Last name is required'
    if (!shippingData.address.trim()) sErrors.address = 'Street address is required'
    if (!shippingData.city.trim()) sErrors.city = 'City is required'

    if (!shippingData.zipCode.trim()) {
      sErrors.zipCode = 'Zip code is required'
    } else if (!/^\d{4,10}$/.test(shippingData.zipCode.trim())) {
      sErrors.zipCode = 'Please enter a valid zip code'
    }

    if (!shippingData.phone.trim()) {
      sErrors.phone = 'Phone number is required'
    } else if (shippingData.phone.replace(/\D/g, '').length < 7) {
      sErrors.phone = 'Please enter a valid phone number'
    }

    setShippingErrors(sErrors)

    const cErrors = {}
    if (paymentMethod === 'card') {
      const cleanCard = cardData.cardNumber.replace(/\s+/g, '')
      if (!cleanCard) {
        cErrors.cardNumber = 'Card number is required'
      } else if (cleanCard.length < 13 || cleanCard.length > 19) {
        cErrors.cardNumber = 'Card number must be 13-19 digits'
      }

      if (!cardData.expiryDate.trim()) {
        cErrors.expiryDate = 'Expiry date is required (MM/YY)'
      } else if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate.trim())) {
        cErrors.expiryDate = 'Format must be MM/YY'
      }

      if (!cardData.cvc.trim()) {
        cErrors.cvc = 'CVC is required'
      } else if (!/^\d{3,4}$/.test(cardData.cvc.trim())) {
        cErrors.cvc = 'CVC must be 3 or 4 digits'
      }

      setCardErrors(cErrors)
    }

    return Object.keys(sErrors).length === 0 && Object.keys(cErrors).length === 0
  }

  function handlePlaceOrder(e) {
    e.preventDefault()

    if (!validateForm()) return

    const formattedDelivery = getEstimatedDeliveryDate()
    const orderNumber = getNewOrderNumber()

    // Create safe order object (sensitive card details excluded)
    const orderObject = {
      orderNumber,
      items: cartItems,
      shipping: {
        firstName: shippingData.firstName.trim(),
        lastName: shippingData.lastName.trim(),
        address: shippingData.address.trim(),
        city: shippingData.city.trim(),
        zipCode: shippingData.zipCode.trim(),
        phone: shippingData.phone.trim(),
      },
      paymentMethod:
        paymentMethod === 'card' ? 'Credit or Debit Card' : 'PayPal',
      subtotal,
      shippingFee: shipping,
      tax,
      total,
      createdAt: getCurrentTimestamp(),
      estimatedDelivery: formattedDelivery,
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('lastOrder', JSON.stringify(orderObject))
      }
    } catch {
      // Ignore storage error
    }

    dispatch(clearCart())
    navigate('/order-confirmation')
  }

  if (cartItems.length === 0) return null

  return (
    <Container fluid="xl" className="checkout-page py-4">
      {/* ── Page Header ── */}
      <div className="checkout-header mb-4">
        <h2 className="checkout-title mb-1">Secure Checkout</h2>
        <p className="text-muted small mb-3">
          Educational simulation — no real payment will be charged.
        </p>

        {/* Visual Progress Steps */}
        <div className="checkout-steps">
          <div className="step-item step-item--active">
            <span className="step-num">1</span>
            <span className="step-label">Shipping</span>
          </div>
          <span className="step-divider" />
          <div className="step-item">
            <span className="step-num">2</span>
            <span className="step-label">Payment</span>
          </div>
          <span className="step-divider" />
          <div className="step-item">
            <span className="step-num">3</span>
            <span className="step-label">Review</span>
          </div>
        </div>
      </div>

      <Form onSubmit={handlePlaceOrder}>
        <Row className="g-4 align-items-start">
          {/* ── Left Column: Shipping & Payment ── */}
          <Col xs={12} lg={7}>
            {/* Shipping Information Card */}
            <div className="checkout-card mb-4">
              <div className="card-header-clean mb-3">
                <span className="section-icon">🚚</span>
                <h5 className="mb-0 fw-bold">Shipping Information</h5>
              </div>

              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="firstName">
                    <Form.Label className="small fw-semibold">First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={shippingData.firstName}
                      onChange={handleShippingChange}
                      isInvalid={Boolean(shippingErrors.firstName)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {shippingErrors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="lastName">
                    <Form.Label className="small fw-semibold">Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={shippingData.lastName}
                      onChange={handleShippingChange}
                      isInvalid={Boolean(shippingErrors.lastName)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {shippingErrors.lastName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col xs={12}>
                  <Form.Group controlId="address">
                    <Form.Label className="small fw-semibold">Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      placeholder="123 Commerce Way"
                      value={shippingData.address}
                      onChange={handleShippingChange}
                      isInvalid={Boolean(shippingErrors.address)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {shippingErrors.address}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="city">
                    <Form.Label className="small fw-semibold">City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      placeholder="New York"
                      value={shippingData.city}
                      onChange={handleShippingChange}
                      isInvalid={Boolean(shippingErrors.city)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {shippingErrors.city}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="zipCode">
                    <Form.Label className="small fw-semibold">Zip Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="zipCode"
                      placeholder="10001"
                      value={shippingData.zipCode}
                      onChange={handleShippingChange}
                      isInvalid={Boolean(shippingErrors.zipCode)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {shippingErrors.zipCode}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="phone">
                    <Form.Label className="small fw-semibold">Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      value={shippingData.phone}
                      onChange={handleShippingChange}
                      isInvalid={Boolean(shippingErrors.phone)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {shippingErrors.phone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Payment Method Card */}
            <div className="checkout-card mb-4">
              <div className="card-header-clean mb-3">
                <span className="section-icon">💳</span>
                <h5 className="mb-0 fw-bold">Payment Method</h5>
              </div>

              {/* Credit Card Option */}
              <div
                className={`payment-option-box mb-3 ${
                  paymentMethod === 'card' ? 'payment-option-box--selected' : ''
                }`}
              >
                <div
                  className="d-flex justify-content-between align-items-center cursor-pointer p-3"
                  onClick={() => setPaymentMethod('card')}
                >
                  <Form.Check
                    type="radio"
                    id="payment-card"
                    name="paymentMethod"
                    label="Credit or Debit Card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="fw-semibold m-0"
                  />
                  <span className="text-muted">💳</span>
                </div>

                {paymentMethod === 'card' && (
                  <div className="payment-fields-expanded px-3 pb-3 pt-1">
                    <Row className="g-3">
                      <Col xs={12}>
                        <Form.Group controlId="cardNumber">
                          <Form.Label className="small fw-semibold">Card Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="cardNumber"
                            placeholder="0000 0000 0000 0000"
                            value={cardData.cardNumber}
                            onChange={handleCardChange}
                            isInvalid={Boolean(cardErrors.cardNumber)}
                          />
                          <Form.Control.Feedback type="invalid">
                            {cardErrors.cardNumber}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="expiryDate">
                          <Form.Label className="small fw-semibold">Expiry Date</Form.Label>
                          <Form.Control
                            type="text"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={cardData.expiryDate}
                            onChange={handleCardChange}
                            isInvalid={Boolean(cardErrors.expiryDate)}
                          />
                          <Form.Control.Feedback type="invalid">
                            {cardErrors.expiryDate}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="cvc">
                          <Form.Label className="small fw-semibold">CVC</Form.Label>
                          <Form.Control
                            type="text"
                            name="cvc"
                            placeholder="123"
                            maxLength={4}
                            value={cardData.cvc}
                            onChange={handleCardChange}
                            isInvalid={Boolean(cardErrors.cvc)}
                          />
                          <Form.Control.Feedback type="invalid">
                            {cardErrors.cvc}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}
              </div>

              {/* PayPal Option */}
              <div
                className={`payment-option-box ${
                  paymentMethod === 'paypal' ? 'payment-option-box--selected' : ''
                }`}
              >
                <div
                  className="d-flex justify-content-between align-items-center cursor-pointer p-3"
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <Form.Check
                    type="radio"
                    id="payment-paypal"
                    name="paymentMethod"
                    label="PayPal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="fw-semibold m-0"
                  />
                  <span className="text-muted fw-bold">P</span>
                </div>
              </div>
            </div>

            {/* Place Order Action Button */}
            <div className="text-end mb-4">
              <button type="submit" className="btn btn-primary btn-place-order">
                Place Order →
              </button>
            </div>
          </Col>

          {/* ── Right Column: Order Summary ── */}
          <Col xs={12} lg={5}>
            <div className="checkout-summary-card">
              <h5 className="summary-title mb-3">Order Summary</h5>

              {/* Items List */}
              <div className="checkout-items-list mb-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="checkout-item-row">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="checkout-item-thumb"
                    />
                    <div className="checkout-item-details">
                      <p className="checkout-item-name mb-0">{item.title}</p>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                    <span className="checkout-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="my-3 opacity-25" />

              {/* Totals */}
              <div className="summary-row">
                <span className="text-muted">Subtotal</span>
                <span className="fw-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="text-muted">Shipping</span>
                <span className="text-success fw-semibold">FREE</span>
              </div>
              <div className="summary-row mb-3">
                <span className="text-muted">Tax (Est.)</span>
                <span className="fw-semibold">${tax.toFixed(2)}</span>
              </div>

              <hr className="my-3 opacity-25" />

              <div className="summary-row summary-total-row mb-4">
                <span className="summary-total-label">Total</span>
                <span className="summary-total-val">${total.toFixed(2)}</span>
              </div>

              {/* Promo Code Input (Educational Demo Only) */}
              <div className="promo-code-section mb-4">
                <div className="input-group">
                  <Form.Control
                    type="text"
                    placeholder="Promo Code (Demo only)"
                    disabled
                    className="promo-input"
                    aria-label="Promo code input disabled for demo"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-apply-promo"
                    disabled
                    title="Promo codes are not available in this demo"
                  >
                    Apply
                  </button>
                </div>
                <small className="text-muted mt-1 d-block">
                  Promo codes are not available in this educational demo.
                </small>
              </div>

              {/* Security Guarantees */}
              <div className="checkout-security-card">
                <div className="security-item mb-2">
                  <span className="security-icon">🛡️</span>
                  <span>256-bit SSL Secure Payment</span>
                </div>
                <div className="security-item">
                  <span className="security-icon">🔄</span>
                  <span>30-Day Money Back Guarantee</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  )
}

export default Checkout
