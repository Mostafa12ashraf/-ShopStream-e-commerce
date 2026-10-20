function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const { id, title, price, thumbnail, quantity, category, brand, stock } = item
  const itemTotal = (price * quantity).toFixed(2)

  return (
    <div className="cart-item">
      <div className="cart-item-img-wrapper">
        <img src={thumbnail} alt={title} className="cart-item-img" />
      </div>

      <div className="cart-item-info">
        <h5 className="cart-item-title mb-1">{title}</h5>
        <p className="cart-item-meta text-muted small mb-2">
          {[brand, category].filter(Boolean).join(' | ') || 'In Stock'}
        </p>

        <div className="d-flex align-items-center gap-3">
          <div className="cart-item-qty-control">
            <button
              type="button"
              className="cart-qty-btn"
              onClick={() => onDecrease(id)}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="cart-qty-val">{quantity}</span>
            <button
              type="button"
              className="cart-qty-btn"
              onClick={() => onIncrease(id)}
              disabled={typeof stock === 'number' && quantity >= stock}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="btn-remove-item"
            onClick={() => onRemove(id)}
            aria-label={`Remove ${title} from cart`}
          >
            🗑️ Remove
          </button>
        </div>
      </div>

      <div className="cart-item-price-wrapper">
        <span className="cart-item-price">${itemTotal}</span>
        {quantity > 1 && (
          <small className="cart-item-unit-price">${price.toFixed(2)} each</small>
        )}
      </div>
    </div>
  )
}

export default CartItem
