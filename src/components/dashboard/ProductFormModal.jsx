import { Modal, Form, Row, Col, Button, Spinner } from 'react-bootstrap'
import MockApiNotice from './MockApiNotice'

const PRODUCT_PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="28" fill="%2394a3b8">📦</text></svg>'

function ProductFormModal({
  show,
  mode = 'add',
  formData,
  errors = {},
  loading = false,
  categories = [],
  selectedProduct = null,
  onChange,
  onSubmit,
  onClose,
}) {
  const isEdit = mode === 'edit'

  return (
    <Modal
      show={show}
      onHide={() => !loading && onClose()}
      size={isEdit ? 'lg' : undefined}
      centered
      className="dashboard-modal"
    >
      <Modal.Header closeButton>
        <div>
          <Modal.Title className="dashboard-modal-title">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </Modal.Title>
          <p className="dashboard-modal-subtitle">
            {isEdit
              ? `Update details for ${selectedProduct?.title || 'Selected Product'}`
              : 'Create a new product in your store catalog.'}
          </p>
        </div>
      </Modal.Header>

      <Form onSubmit={onSubmit}>
        <Modal.Body>
          {isEdit ? (
            /* ============================================================
               EDIT MODE (Figma Page 5 - 2-Column Layout)
               ============================================================ */
            <Row className="g-4">
              {/* Left Column: Image preview & status toggle */}
              <Col xs={12} md={4}>
                <div className="text-center p-3 border rounded-3 bg-light">
                  <div className="small fw-bold text-muted mb-2 text-start">
                    PRODUCT IMAGE
                  </div>
                  <img
                    src={
                      formData.thumbnail ||
                      selectedProduct?.thumbnail ||
                      PRODUCT_PLACEHOLDER_IMAGE
                    }
                    alt={formData.title || 'Product Preview'}
                    className="rounded border mb-3 w-100 product-edit-preview-img"
                    onError={(e) => {
                      e.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE
                    }}
                  />
                  <Form.Group controlId="editProductThumbnail" className="text-start">
                    <Form.Label className="form-label-dashboard">
                      Image URL
                    </Form.Label>
                    <Form.Control
                      type="url"
                      name="thumbnail"
                      size="sm"
                      value={formData.thumbnail || ''}
                      onChange={onChange}
                      className="form-control-dashboard"
                      placeholder="https://..."
                    />
                  </Form.Group>

                  <div className="mt-3 pt-3 border-top text-start">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="small fw-semibold text-secondary">
                        Visible on storefront{' '}
                        <span className="badge bg-secondary-subtle text-secondary badge-demo-pill">
                          Demo
                        </span>
                      </span>
                      <Form.Check
                        type="switch"
                        id="publish-status-switch"
                        checked={true}
                        disabled
                        title="Demo control: Visibility filtering is not supported by DummyJSON API"
                        aria-label="Visible on storefront (demo only)"
                      />
                    </div>
                  </div>
                </div>
              </Col>

              {/* Right Column: Form Inputs */}
              <Col xs={12} md={8}>
                <Row className="g-3">
                  {/* Title */}
                  <Col xs={12}>
                    <Form.Group controlId="editProductTitle">
                      <Form.Label className="form-label-dashboard">
                        Product Name *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title || ''}
                        onChange={onChange}
                        isInvalid={Boolean(errors.title)}
                        className="form-control-dashboard"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.title}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* SKU & Category */}
                  <Col xs={12} sm={6}>
                    <Form.Group controlId="editProductSku">
                      <Form.Label className="form-label-dashboard">
                        SKU
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="sku"
                        value={formData.sku || ''}
                        onChange={onChange}
                        className="form-control-dashboard"
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} sm={6}>
                    <Form.Group controlId="editProductCategory">
                      <Form.Label className="form-label-dashboard">
                        Category *
                      </Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category || ''}
                        onChange={onChange}
                        isInvalid={Boolean(errors.category)}
                        className="form-control-dashboard text-capitalize"
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat} className="text-capitalize">
                            {cat.replace(/-/g, ' ')}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.category}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Price & Current Stock */}
                  <Col xs={12} sm={6}>
                    <Form.Group controlId="editProductPrice">
                      <Form.Label className="form-label-dashboard">
                        Price (USD) *
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        step="0.01"
                        min="0"
                        value={formData.price ?? ''}
                        onChange={onChange}
                        isInvalid={Boolean(errors.price)}
                        className="form-control-dashboard"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.price}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col xs={12} sm={6}>
                    <Form.Group controlId="editProductStock">
                      <Form.Label className="form-label-dashboard">
                        Current Stock *
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="stock"
                        min="0"
                        value={formData.stock ?? ''}
                        onChange={onChange}
                        isInvalid={Boolean(errors.stock)}
                        className="form-control-dashboard"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.stock}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Description */}
                  <Col xs={12}>
                    <Form.Group controlId="editProductDescription">
                      <Form.Label className="form-label-dashboard">
                        Description
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        name="description"
                        rows={3}
                        value={formData.description || ''}
                        onChange={onChange}
                        className="form-control-dashboard"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
          ) : (
            /* ============================================================
               ADD MODE (Figma Page 7 - Clean Grid Layout)
               ============================================================ */
            <Row className="g-3">
              {/* Product Name */}
              <Col xs={12} sm={6}>
                <Form.Group controlId="addProductName">
                  <Form.Label className="form-label-dashboard">
                    Product Name *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="e.g. SonicWave Pro 2"
                    value={formData.title || ''}
                    onChange={onChange}
                    isInvalid={Boolean(errors.title)}
                    className="form-control-dashboard"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* SKU */}
              <Col xs={12} sm={6}>
                <Form.Group controlId="addProductSku">
                  <Form.Label className="form-label-dashboard">SKU</Form.Label>
                  <Form.Control
                    type="text"
                    name="sku"
                    placeholder="SKU-0000-XX"
                    value={formData.sku || ''}
                    onChange={onChange}
                    className="form-control-dashboard"
                  />
                </Form.Group>
              </Col>

              {/* Category */}
              <Col xs={12} sm={6}>
                <Form.Group controlId="addProductCategory">
                  <Form.Label className="form-label-dashboard">
                    Category *
                  </Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category || ''}
                    onChange={onChange}
                    isInvalid={Boolean(errors.category)}
                    className="form-control-dashboard text-capitalize"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="text-capitalize">
                        {cat.replace(/-/g, ' ')}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Price */}
              <Col xs={12} sm={6}>
                <Form.Group controlId="addProductPrice">
                  <Form.Label className="form-label-dashboard">
                    Price ($) *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.price ?? ''}
                    onChange={onChange}
                    isInvalid={Boolean(errors.price)}
                    className="form-control-dashboard"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Stock */}
              <Col xs={12} sm={6}>
                <Form.Group controlId="addProductStock">
                  <Form.Label className="form-label-dashboard">
                    Stock Quantity *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    min="0"
                    placeholder="0"
                    value={formData.stock ?? ''}
                    onChange={onChange}
                    isInvalid={Boolean(errors.stock)}
                    className="form-control-dashboard"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.stock}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Image URL */}
              <Col xs={12} sm={6}>
                <Form.Group controlId="addProductThumbnail">
                  <Form.Label className="form-label-dashboard">
                    Image URL
                  </Form.Label>
                  <Form.Control
                    type="url"
                    name="thumbnail"
                    placeholder="https://example.com/image.jpg"
                    value={formData.thumbnail || ''}
                    onChange={onChange}
                    className="form-control-dashboard"
                  />
                </Form.Group>
              </Col>

              {/* Description */}
              <Col xs={12}>
                <Form.Group controlId="addProductDescription">
                  <Form.Label className="form-label-dashboard">
                    Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    rows={3}
                    placeholder="Enter product details..."
                    value={formData.description || ''}
                    onChange={onChange}
                    className="form-control-dashboard"
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          <MockApiNotice className="mt-4">
            This mock change is visible in the current Dashboard view and may reset after refresh or leaving the page.
          </MockApiNotice>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={onClose}
            disabled={loading}
          >
            {isEdit ? 'Discard' : 'Cancel'}
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="btn-dashboard-submit"
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
                {isEdit ? 'Saving...' : 'Creating...'}
              </>
            ) : isEdit ? (
              'Save Changes'
            ) : (
              'Create Product'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ProductFormModal
