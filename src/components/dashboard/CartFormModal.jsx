import { Modal, Form, Row, Col, Button, Alert, Spinner } from 'react-bootstrap'
import MockApiNotice from './MockApiNotice'

function CartFormModal({
  show,
  mode = 'add',
  formData,
  errors = {},
  loading = false,
  selectedCart = null,
  onChange,
  onProductRowChange,
  onAddProductRow,
  onRemoveProductRow,
  onSubmit,
  onClose,
}) {
  const isEdit = mode === 'edit'
  const products = formData?.products || []
  
  return (
    <Modal
      show={show}
      onHide={() => !loading && onClose()}
      size="lg"
      centered
      className="dashboard-modal"
    >
      <Modal.Header closeButton>
        <div>
          <Modal.Title className="dashboard-modal-title">
            {isEdit ? `Edit Cart: #${selectedCart?.id}` : 'Add New Cart'}
          </Modal.Title>
          <p className="dashboard-modal-subtitle">
            {isEdit
              ? `Modify product quantities for User #${selectedCart?.userId}`
              : 'Create a new shopping cart with products for a specific user.'}
          </p>
        </div>
      </Modal.Header>

      <Form onSubmit={onSubmit}>
        <Modal.Body>
          {errors.products && (
            <Alert variant="danger" className="py-2 small">
              {errors.products}
            </Alert>
          )}

          {/* User ID Field - Add Mode Only */}
          {!isEdit && (
            <Form.Group controlId="addCartUserId" className="mb-4">
              <Form.Label className="form-label-dashboard">
                User ID *
              </Form.Label>
              <Form.Control
                type="number"
                name="userId"
                min="1"
                placeholder="e.g. 5"
                value={formData.userId || ''}
                onChange={onChange}
                isInvalid={Boolean(errors.userId)}
                className="form-control-dashboard"
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.userId}
              </Form.Control.Feedback>
            </Form.Group>
          )}

          {/* Dynamic Product Rows */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold small text-dark">
              {isEdit ? 'CART PRODUCTS' : 'CART PRODUCTS (ID & QUANTITY)'}
            </span>
            <Button
              variant="outline-primary"
              size="sm"
              type="button"
              onClick={onAddProductRow}
              className="small"
            >
              + Add Product Row
            </Button>
          </div>

          <div className="p-3 bg-light rounded-3 border">
            {products.map((row, idx) => (
              <Row key={idx} className="g-2 align-items-center mb-2">
                <Col xs={6} sm={7}>
                  <Form.Control
                    type="number"
                    min="1"
                    placeholder={
                      isEdit
                        ? 'Product ID'
                        : `Product ID (e.g. ${idx === 0 ? '1' : '50'})`
                    }
                    value={row.id ?? ''}
                    onChange={(e) =>
                      onProductRowChange(idx, 'id', e.target.value)
                    }
                    size="sm"
                    className="form-control-dashboard"
                    required
                  />
                </Col>
                <Col xs={4} sm={4}>
                  <Form.Control
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={row.quantity ?? ''}
                    onChange={(e) =>
                      onProductRowChange(idx, 'quantity', e.target.value)
                    }
                    size="sm"
                    className="form-control-dashboard"
                    required
                  />
                </Col>
                <Col xs={2} sm={1} className="text-end">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    type="button"
                    disabled={products.length <= 1}
                    onClick={() => onRemoveProductRow(idx)}
                    title="Remove product row"
                  >
                    ✕
                  </Button>
                </Col>
              </Row>
            ))}
          </div>

          <MockApiNotice className="mt-3">
            {isEdit
              ? 'This mock change is visible in the current Dashboard view and may reset after refresh or leaving the page. Customer Storefront cart remains isolated.'
              : 'This mock change is visible in the current Dashboard view and may reset after refresh or leaving the page.'}
          </MockApiNotice>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#4338ca', borderColor: '#4338ca' }}
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
                {isEdit ? 'Saving...' : 'Creating Cart...'}
              </>
            ) : isEdit ? (
              'Save Changes'
            ) : (
              'Create Cart'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default CartFormModal
