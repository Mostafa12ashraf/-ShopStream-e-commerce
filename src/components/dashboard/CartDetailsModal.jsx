import { Modal, Table, Button, Alert, Spinner } from 'react-bootstrap'

const PRODUCT_PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="28" fill="%2394a3b8">📦</text></svg>'

function CartDetailsModal({
  show,
  selectedCart,
  loading = false,
  error = null,
  onClose,
}) {
  if (!selectedCart && !loading) return null

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      centered
      className="dashboard-modal"
    >
      <Modal.Header closeButton>
        <div>
          <Modal.Title className="dashboard-modal-title">
            Cart Details: #{selectedCart?.id}
          </Modal.Title>
          <p className="dashboard-modal-subtitle">
            Assigned to User #{selectedCart?.userId} &bull;{' '}
            {selectedCart?.totalProducts} Products &bull;{' '}
            {selectedCart?.totalQuantity} Items
          </p>
        </div>
      </Modal.Header>
      <Modal.Body className="p-4">
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" variant="primary" />
            <p className="small text-muted mt-2">
              Loading detailed cart items...
            </p>
          </div>
        ) : error ? (
          <Alert variant="warning">{error}</Alert>
        ) : (
          <div>
            <div className="table-responsive">
              <Table className="align-middle mb-0" size="sm">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th className="text-center">Price</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Line Total</th>
                    <th className="text-end">Discounted</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCart?.products?.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={p.thumbnail || PRODUCT_PLACEHOLDER_IMAGE}
                            alt={p.title}
                            className="rounded border"
                            style={{
                              width: '38px',
                              height: '38px',
                              objectFit: 'cover',
                            }}
                            onError={(e) => {
                              e.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE
                            }}
                          />
                          <div>
                            <div className="fw-semibold small text-dark">
                              {p.title}
                            </div>
                            <div
                              className="text-muted font-monospace"
                              style={{ fontSize: '0.725rem' }}
                            >
                              ID: {p.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center font-monospace small">
                        ${Number(p.price).toFixed(2)}
                      </td>
                      <td className="text-center fw-bold small">{p.quantity}</td>
                      <td className="text-end font-monospace small">
                        ${Number(p.total).toFixed(2)}
                      </td>
                      <td className="text-end font-monospace text-success fw-bold small">
                        ${Number(p.discountedTotal || p.total).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Totals Summary Footer */}
            <div className="d-flex justify-content-between align-items-center p-3 mt-3 bg-light rounded-3 border">
              <div>
                <span className="small text-muted">Total Products: </span>
                <span className="fw-bold">{selectedCart?.totalProducts}</span>
                <span className="small text-muted ms-3">Total Quantity: </span>
                <span className="fw-bold">{selectedCart?.totalQuantity}</span>
              </div>
              <div className="text-end">
                <div className="small text-muted">
                  Subtotal: ${Number(selectedCart?.total).toFixed(2)}
                </div>
                <div className="fs-5 fw-bold text-primary">
                  Total: $
                  {Number(
                    selectedCart?.discountedTotal || selectedCart?.total
                  ).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CartDetailsModal
