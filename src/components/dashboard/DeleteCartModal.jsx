import { Modal, Button, Spinner } from 'react-bootstrap'

function DeleteCartModal({
  show,
  cartToDelete,
  isDeleting = false,
  onConfirm,
  onClose,
}) {
  return (
    <Modal
      show={show}
      onHide={() => !isDeleting && onClose()}
      centered
      className="dashboard-modal"
    >
      <Modal.Body className="p-4 text-center">
        <div className="delete-warning-icon-wrapper" aria-hidden="true">
          ⚠️
        </div>

        <h4 className="fw-bold text-dark mb-2">Delete Cart?</h4>
        <p className="text-muted small mb-3" style={{ lineHeight: 1.5 }}>
          This mock deletion updates the current Dashboard view and may reset after refresh or leaving the page.
        </p>

        {cartToDelete && (
          <div className="delete-target-preview text-start">
            <div className="flex-grow-1">
              <span className="cart-id-badge font-monospace mb-1 d-inline-block">
                #CRT-{cartToDelete.id}
              </span>
              <div
                className="fw-bold text-dark"
                style={{ fontSize: '0.95rem' }}
              >
                User #{cartToDelete.userId} &bull; {cartToDelete.totalQuantity} items
              </div>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <span className="small text-muted">
                  {cartToDelete.totalProducts} unique products
                </span>
                <span className="fw-bold text-primary">
                  ${Number(cartToDelete.total).toFixed(2)}
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
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="px-4 py-2 fw-semibold"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
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
      </Modal.Body>
    </Modal>
  )
}

export default DeleteCartModal
