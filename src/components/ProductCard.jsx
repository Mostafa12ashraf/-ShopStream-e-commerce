import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'

function ProductCard({ product }) {
  const { id, title, description, price, rating, thumbnail, discountPercentage } = product

  // Show discount badge and crossed-out original price when discount is meaningful
  const hasDiscount = discountPercentage && discountPercentage >= 5
  const originalPrice = hasDiscount
    ? (price / (1 - discountPercentage / 100)).toFixed(2)
    : null

  return (
    <Card className="product-card h-100">
      {hasDiscount && (
        <span className="product-badge">
          -{Math.round(discountPercentage)}%
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
          {/* onClick will be connected to Cart in a later phase */}
          <button type="button" className="btn btn-primary btn-add">
            🛒 Add
          </button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ProductCard
