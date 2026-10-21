import { Modal, Button, Spinner } from 'react-bootstrap'

const CURRENT_YEAR = new Date().getFullYear()
const PRODUCT_PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="28" fill="%2394a3b8">📦</text></svg>'

function DeleteProductModal({
  show,
  product,
  loading = false,
  onConfirm,
  onClose,
  getStockStatus,
}) {
  const stockLabel = getStockStatus
    ? getStockStatus(product?.stock)?.label
    : product?.stock > 15
    ? 'In Stock'
    : product?.stock > 0
    ? 'Low Stock'
    : 'Out of Stock'

  return (
    <Modal
      show={show}
      onHide={() => !loading && onClose()}
      centered
      className="dashboard-modal"
    >
      <Modal.Body className="p-4 text-center">
        <div className="delete-warning-icon-wrapper" aria-hidden="true">
          ⚠️
        </div>

        <h4 className="fw-bold text-dark mb-2">Delete Product?</h4>
        <p className="text-muted small mb-3 delete-warning-text">
          This mock deletion updates the current Dashboard view and may reset after refresh or leaving the page.
        </p>

        {/* Product target preview card matching Figma Page 8 */}
        {product && (
          <div className="delete-target-preview text-start">
            <img
              src={
                product.thumbnail ||
                product.images?.[0] ||
                PRODUCT_PLACEHOLDER_IMAGE
              }
              alt={product.title}
              className="delete-target-thumb"
              onError={(e) => {
                e.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE
              }}
            />
            <div className="flex-grow-1 min-width-0">
              <span className="badge bg-success-subtle text-success fw-bold mb-1 d-inline-block delete-target-badge">
                {stockLabel}
              </span>
              <div className="fw-bold text-dark text-truncate">
                {product.title}
              </div>
              <div className="d-flex justify-content-between align-items-center mt-1">
                <span className="small text-muted font-monospace">
                  ID: {product.id}
                </span>
                <span className="fw-bold text-primary">
                  ${Number(product.price).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="d-flex gap-2 justify-content-center mt-4">
          <Button
            variant="outline-secondary"
            className="px-4 py-2"
            onClick={onClose}
            disabled={loading}
          >
            Cancel and Go Back
          </Button>
          <Button
            variant="danger"
            className="px-4 py-2 fw-semibold"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Deleting...
              </>
            ) : (
              'Confirm Delete'
            )}
          </Button>
        </div>

        <div className="mt-4 pt-3 border-top text-muted dashboard-modal-security-footer">
          🔒 Secure Action Required &bull; © {CURRENT_YEAR} ShopStream Inc. Internal Admin Tool
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default DeleteProductModal
