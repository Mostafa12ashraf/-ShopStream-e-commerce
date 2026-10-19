import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/cartSlice'

function ProductCard({ product, variant = 'default' }) {
  const dispatch = useDispatch()
  const { id, title, description, price, rating, thumbnail, discountPercentage, category } = product

  // Calculate original price only when a real discount exists
  const hasDiscount = discountPercentage && discountPercentage > 0
  const originalPrice = hasDiscount
    ? (price / (1 - discountPercentage / 100)).toFixed(2)
    : null

  // Show "NEW" badge on top-rated items without a discount to match Figma
  const isNew = !hasDiscount && rating >= 4.8
  const isBestSeller = rating >= 4.5

  function handleAddToCart(e) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    dispatch(addToCart({ product, quantity: 1 }))
  }

  // Home page variant matching Figma Featured Products card
  if (variant === 'home') {
    return (
      <Card className="product-card product-card--home h-100">
        <Link to={`/products/${id}`} className="product-img-box position-relative">
          {isBestSeller ? (
            <span className="product-badge product-badge--bestseller">
              BEST SELLER
            </span>
          ) : isNew ? (
            <span className="product-badge product-badge--new-pill">
              NEW
            </span>
          ) : null}

          <img
            src={thumbnail}
            alt={title}
            className="product-img-home"
          />
        </Link>

        <Card.Body className="p-3 d-flex flex-column">
          <span className="product-category-tag">
            {category ? category.replace(/-/g, ' ').toUpperCase() : 'TECH'}
          </span>

          <Link to={`/products/${id}`} className="product-title-link mb-2">
            <h6 className="product-title-home mb-0" title={title}>{title}</h6>
          </Link>

          <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
            <span className="product-price-home">${price.toFixed(2)}</span>
            <button
              type="button"
              className="btn-home-cart"
              onClick={handleAddToCart}
              aria-label={`Add ${title} to cart`}
              title="Add to cart"
            >
              🛒+
            </button>
          </div>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card className="product-card h-100">
      {hasDiscount && (
        <span className="product-badge product-badge--discount">
          -{Math.round(discountPercentage)}%
        </span>
      )}
      {isNew && (
        <span className="product-badge product-badge--new">
          NEW
        </span>
      )}

      <Link to={`/products/${id}`} className="product-img-link">
        <Card.Img
          variant="top"
          src={thumbnail}
          alt={title}
          className="product-img"
        />
      </Link>

      <Card.Body className="d-flex flex-column gap-2">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <Link to={`/products/${id}`} className="product-title-link">
            <h6 className="product-title mb-0">{title}</h6>
          </Link>
          <span className="product-rating">★ {rating.toFixed(1)}</span>
        </div>

        <p className="product-description mb-0">{description}</p>

        <div className="d-flex justify-content-between align-items-center mt-auto pt-1">
          <div>
            <span className="product-price">${price.toFixed(2)}</span>
            {originalPrice && (
              <span className="product-original-price">${originalPrice}</span>
            )}
          </div>
          <button
            type="button"
            className="btn btn-primary btn-add"
            onClick={handleAddToCart}
          >
            🛒 Add
          </button>
        </div>
      </Card.Body>
    </Card>
  )
}


export default ProductCard
