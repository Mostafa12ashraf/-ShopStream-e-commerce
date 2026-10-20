import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap'
import { addToCart } from '../../redux/cartSlice'
import ProductCard from '../../components/ProductCard'
import './ProductDetails.css'

function ProductDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // ── State ────────────────────────────────────────────────────
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState('')
  const [activeTab, setActiveTab] = useState('specifications')
  const [relatedProducts, setRelatedProducts] = useState([])
  const [retryCount, setRetryCount] = useState(0)
  const [addedFeedback, setAddedFeedback] = useState(false)

  // ── Fetch single product ─────────────────────────────────────
  useEffect(() => {
    let isMounted = true

    async function getProduct() {
      setLoading(true)
      setError(null)
      setQuantity(1)

      try {
        const response = await axios.get(`https://dummyjson.com/products/${id}`)
        const data = response.data

        if (isMounted) {
          setProduct(data)

          // Set the first available image
          if (data.images && data.images.length > 0) {
            setSelectedImage(data.images[0])
          } else {
            setSelectedImage(data.thumbnail || '')
          }
        }

        // Fetch related products from the same category
        if (data.category) {
          try {
            const relatedRes = await axios.get(
              `https://dummyjson.com/products/category/${encodeURIComponent(data.category)}?limit=6`
            )
            if (isMounted) {
              const relatedList = (relatedRes.data.products || [])
                .filter((p) => p.id !== data.id)
                .slice(0, 4)
              setRelatedProducts(relatedList)
            }
          } catch {
            if (isMounted) {
              setRelatedProducts([])
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          if (err.response && err.response.status === 404) {
            setError('Product not found.')
          } else {
            setError(err.message || 'Failed to load product details.')
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    getProduct()

    return () => {
      isMounted = false
    }
  }, [id, retryCount])

  // ── Derived data ──────────────────────────────────────────────
  const images =
    product?.images && product.images.length > 0
      ? product.images
      : [product?.thumbnail].filter(Boolean)

  const hasDiscount = Boolean(product?.discountPercentage && product.discountPercentage > 0)
  const originalPrice = hasDiscount
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null

  const stock = typeof product?.stock === 'number' ? product.stock : 99
  const isOutOfStock = stock <= 0
  const maxAllowedQuantity = Math.max(1, stock)

  // Real review count from API data
  const reviewCount = product?.reviews ? product.reviews.length : 0

  // ── Handlers ─────────────────────────────────────────────────
  function handleAddToCart() {
    if (!product || isOutOfStock) return
    dispatch(addToCart({ product, quantity }))
    setAddedFeedback(true)
    setTimeout(() => setAddedFeedback(false), 2000)
  }

  function handleBuyNow() {
    if (!product || isOutOfStock) return
    dispatch(addToCart({ product, quantity }))
    navigate('/checkout')
  }

  // ── Loading state ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="product-details-loading">
        <Spinner animation="border" variant="primary" role="status" />
        <p className="mt-3 text-muted">Loading product details...</p>
      </div>
    )
  }

  // ── Error state ───────────────────────────────────────────────
  if (error || !product) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p className="mb-3">{error || 'Unable to display product.'}</p>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setRetryCount((c) => c + 1)}
            >
              Retry
            </button>
            <Link to="/products" className="btn btn-outline-secondary">
              Back to Products
            </Link>
          </div>
        </Alert>
      </Container>
    )
  }

  return (
    <Container fluid="xl" className="product-details-page py-4">
      {/* ── Breadcrumb ── */}
      <nav aria-label="breadcrumb" className="details-breadcrumb mb-4">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/products?category=${encodeURIComponent(product.category)}`}>
              {product.category}
            </Link>
          </li>
          {product.brand && (
            <li className="breadcrumb-item">
              <span className="text-muted">{product.brand}</span>
            </li>
          )}
          <li className="breadcrumb-item active" aria-current="page">
            {product.title}
          </li>
        </ol>
      </nav>

      {/* ── Main Product Display ── */}
      <Row className="g-5 align-items-start">
        {/* Left Column: Image Gallery */}
        <Col xs={12} lg={6}>
          <div className="gallery-layout">
            {/* Vertical thumbnails on the left */}
            {images.length > 1 && (
              <div className="gallery-thumbs" aria-label="Product thumbnails">
                {images.map((imgUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`gallery-thumb-btn ${
                      selectedImage === imgUrl ? 'gallery-thumb-btn--active' : ''
                    }`}
                    onClick={() => setSelectedImage(imgUrl)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      className="gallery-thumb-img"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image Container */}
            <div className="gallery-main-container">
              <img
                src={selectedImage || product.thumbnail}
                alt={product.title}
                className="gallery-main-img"
              />
            </div>
          </div>
        </Col>

        {/* Right Column: Product Information & Purchase Controls */}
        <Col xs={12} lg={6}>
          <div className="product-info-panel">
            {/* Top row: availability badge + SKU */}
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className={`badge ${!isOutOfStock ? 'badge-arrival' : 'badge-outofstock'}`}>
                {product.availabilityStatus || (!isOutOfStock ? 'In Stock' : 'Out of Stock')}
              </span>
              {product.sku && (
                <span className="text-muted small">SKU: {product.sku}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="product-details-title mb-2">{product.title}</h1>

            {/* Rating & Real Reviews Count */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="rating-stars-green">
                {'★'.repeat(Math.round(product.rating || 5))}
                {'☆'.repeat(Math.max(0, 5 - Math.round(product.rating || 5)))}
              </div>
              <span className="fw-bold small">{product.rating?.toFixed(1)}</span>
              <span className="text-muted small">
                ({reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'})
              </span>
            </div>

            {/* Price & Discount */}
            <div className="price-block mb-3">
              <div className="d-flex align-items-baseline gap-2">
                <span className="price-current">${product.price?.toFixed(2)}</span>
                {originalPrice && (
                  <span className="price-original">${originalPrice}</span>
                )}
                {hasDiscount && (
                  <span className="discount-tag">
                    ({Math.round(product.discountPercentage)}% OFF)
                  </span>
                )}
              </div>
              {product.shippingInformation && (
                <p className="shipping-note text-muted small mt-1 mb-0">
                  {product.shippingInformation}
                </p>
              )}
            </div>

            <hr className="my-3 text-muted opacity-25" />

            {/* Description */}
            <p className="product-details-description mb-4">
              {product.description}
            </p>

            {/* Quantity and Add to Cart */}
            <div className="purchase-controls mb-3">
              <div className="quantity-wrapper">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() =>
                    setQuantity((q) => Math.min(maxAllowedQuantity, q + 1))
                  }
                  disabled={quantity >= maxAllowedQuantity || isOutOfStock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-details-add"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock
                  ? 'Out of Stock'
                  : addedFeedback
                  ? '✓ Added to Cart!'
                  : '🛍️ Add to Cart'}
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              type="button"
              className="btn btn-success btn-buy-now w-100 mb-4"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
            </button>

            {/* Real Highlights & Policies Grid */}
            <div className="guarantees-grid">
              {product.warrantyInformation && (
                <div className="guarantee-item">
                  <span className="guarantee-icon">🛡️</span>
                  <span>{product.warrantyInformation}</span>
                </div>
              )}
              {product.shippingInformation && (
                <div className="guarantee-item">
                  <span className="guarantee-icon">🚚</span>
                  <span>{product.shippingInformation}</span>
                </div>
              )}
              {product.returnPolicy && (
                <div className="guarantee-item">
                  <span className="guarantee-icon">🔄</span>
                  <span>{product.returnPolicy}</span>
                </div>
              )}
              {product.availabilityStatus && (
                <div className="guarantee-item">
                  <span className="guarantee-icon">📦</span>
                  <span>{product.availabilityStatus}</span>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* ── Specifications & Reviews Tabs ── */}
      <section className="details-tabs-section mt-5 pt-3">
        <div className="details-tabs-nav mb-4">
          <button
            type="button"
            className={`tab-btn ${
              activeTab === 'specifications' ? 'tab-btn--active' : ''
            }`}
            onClick={() => setActiveTab('specifications')}
          >
            Specifications
          </button>
          <button
            type="button"
            className={`tab-btn ${
              activeTab === 'reviews' ? 'tab-btn--active' : ''
            }`}
            onClick={() => setActiveTab('reviews')}
          >
            User Reviews ({reviewCount})
          </button>
        </div>

        {/* Tab 1: Real Specifications */}
        {activeTab === 'specifications' && (
          <Row className="g-4">
            <Col md={4}>
              <div className="spec-card h-100">
                <h5 className="spec-card-title mb-3">Product Specs</h5>
                <ul className="spec-list">
                  {product.brand && (
                    <li>
                      <span className="spec-label">Brand</span>
                      <span className="spec-val">{product.brand}</span>
                    </li>
                  )}
                  <li>
                    <span className="spec-label">Category</span>
                    <span className="spec-val">{product.category}</span>
                  </li>
                  {typeof product.weight === 'number' && (
                    <li>
                      <span className="spec-label">Weight</span>
                      <span className="spec-val">{product.weight}g</span>
                    </li>
                  )}
                  {product.minimumOrderQuantity && (
                    <li>
                      <span className="spec-label">Min. Order</span>
                      <span className="spec-val">
                        {product.minimumOrderQuantity} units
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </Col>

            <Col md={4}>
              <div className="spec-card h-100">
                <h5 className="spec-card-title mb-3">Physical Dimensions</h5>
                <ul className="spec-list">
                  {product.dimensions?.width && (
                    <li>
                      <span className="spec-label">Width</span>
                      <span className="spec-val">{product.dimensions.width} cm</span>
                    </li>
                  )}
                  {product.dimensions?.height && (
                    <li>
                      <span className="spec-label">Height</span>
                      <span className="spec-val">{product.dimensions.height} cm</span>
                    </li>
                  )}
                  {product.dimensions?.depth && (
                    <li>
                      <span className="spec-label">Depth</span>
                      <span className="spec-val">{product.dimensions.depth} cm</span>
                    </li>
                  )}
                  <li>
                    <span className="spec-label">Stock Status</span>
                    <span className="spec-val">
                      {product.availabilityStatus || (product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock')}
                    </span>
                  </li>
                </ul>
              </div>
            </Col>

            <Col md={4}>
              <div className="spec-card h-100">
                <h5 className="spec-card-title mb-3">Product Tags & Meta</h5>
                <p className="text-muted small mb-3">
                  Official catalog tags and metadata provided by the manufacturer.
                </p>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {product.tags && product.tags.length > 0 ? (
                    product.tags.map((tag) => (
                      <span key={tag} className="badge bg-light text-secondary border">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted small">No tags specified</span>
                  )}
                </div>
                {product.meta?.qrCode && (
                  <div className="text-center pt-2">
                    <img
                      src={product.meta.qrCode}
                      alt={`${product.title} QR code`}
                      style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                    />
                  </div>
                )}
              </div>
            </Col>
          </Row>
        )}

        {/* Tab 2: Real User Reviews */}
        {activeTab === 'reviews' && (
          <div className="reviews-tab-content">
            {product.reviews && product.reviews.length > 0 ? (
              <Row className="g-3">
                {product.reviews.map((rev, idx) => (
                  <Col md={6} key={`${rev.reviewerName || 'reviewer'}-${rev.date || idx}-${idx}`}>
                    <div className="spec-card h-100">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>{rev.reviewerName || 'Verified Buyer'}</strong>
                        <span className="rating-stars-green">
                          {'★'.repeat(Math.round(rev.rating || 5))}
                          {'☆'.repeat(Math.max(0, 5 - Math.round(rev.rating || 5)))}
                        </span>
                      </div>
                      <p className="mb-2 text-dark">{rev.comment}</p>
                      {rev.date && (
                        <small className="text-muted">
                          {new Date(rev.date).toLocaleDateString()}
                        </small>
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <p className="text-muted">No reviews recorded yet for this product.</p>
            )}
          </div>
        )}
      </section>

      {/* ── Related Products: Complete Your Setup ── */}
      {relatedProducts.length > 0 && (
        <section className="related-section mt-5 pt-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="related-title mb-1">Complete Your Setup</h3>
              <p className="text-muted small mb-0">
                Related products from the same category.
              </p>
            </div>
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="view-all-link"
            >
              View All →
            </Link>
          </div>

          <Row xs={1} sm={2} lg={4} className="g-4">
            {relatedProducts.map((relProduct) => (
              <Col key={relProduct.id}>
                <ProductCard product={relProduct} />
              </Col>
            ))}
          </Row>
        </section>
      )}
    </Container>
  )
}

export default ProductDetails
