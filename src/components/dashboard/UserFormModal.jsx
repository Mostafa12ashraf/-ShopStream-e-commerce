import { Modal, Form, Row, Col, Button, Spinner } from 'react-bootstrap'
import MockApiNotice from './MockApiNotice'

function UserFormModal({
  show,
  mode = 'add',
  formData,
  errors = {},
  loading = false,
  selectedUser = null,
  onChange,
  onSubmit,
  onClose,
}) {
  const isEdit = mode === 'edit'

  return (
    <Modal
      show={show}
      onHide={() => !loading && onClose()}
      centered
      className="dashboard-modal"
    >
      <Modal.Header closeButton>
        <div>
          <Modal.Title className="dashboard-modal-title">
            {isEdit ? 'Edit User' : 'Add New User'}
          </Modal.Title>
          <p className="dashboard-modal-subtitle">
            {isEdit
              ? `Update details for ${
                  selectedUser
                    ? `${selectedUser.firstName} ${selectedUser.lastName || ''}`.trim()
                    : 'User'
                }`
              : 'Create a new account for your store management team.'}
          </p>
        </div>
      </Modal.Header>

      <Form onSubmit={onSubmit}>
        <Modal.Body>
          {isEdit ? (
            /* ============================================================
               EDIT MODE (Figma Page 4 - Avatar Preview Banner at Top)
               ============================================================ */
            <>
              <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded-3 border">
                {formData.image || selectedUser?.image ? (
                  <img
                    src={formData.image || selectedUser?.image}
                    alt={formData.firstName || 'User Avatar'}
                    className="dashboard-user-avatar-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://dummyjson.com/icon/default/128'
                    }}
                  />
                ) : (
                  <div className="dashboard-user-avatar-lg-fallback">
                    {formData.firstName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="flex-grow-1">
                  <Form.Group controlId="editAvatarUrl">
                    <Form.Label className="form-label-dashboard mb-1">
                      Profile Picture URL
                    </Form.Label>
                    <Form.Control
                      type="url"
                      name="image"
                      size="sm"
                      value={formData.image || ''}
                      onChange={onChange}
                      className="form-control-dashboard"
                      placeholder="https://..."
                    />
                  </Form.Group>
                </div>
              </div>

              <Row className="g-3">
                {/* First Name */}
                <Col xs={12} sm={6}>
                  <Form.Group controlId="editFirstName">
                    <Form.Label className="form-label-dashboard">
                      First Name *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={formData.firstName || ''}
                      onChange={onChange}
                      isInvalid={Boolean(errors.firstName)}
                      className="form-control-dashboard"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Last Name */}
                <Col xs={12} sm={6}>
                  <Form.Group controlId="editLastName">
                    <Form.Label className="form-label-dashboard">
                      Last Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={onChange}
                      className="form-control-dashboard"
                    />
                  </Form.Group>
                </Col>

                {/* Username */}
                <Col xs={12} sm={6}>
                  <Form.Group controlId="editUsername">
                    <Form.Label className="form-label-dashboard">
                      Username *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username || ''}
                      onChange={onChange}
                      isInvalid={Boolean(errors.username)}
                      className="form-control-dashboard"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Email Address */}
                <Col xs={12} sm={6}>
                  <Form.Group controlId="editEmail">
                    <Form.Label className="form-label-dashboard">
                      Email Address *
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={onChange}
                      isInvalid={Boolean(errors.email)}
                      className="form-control-dashboard"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Role Dropdown */}
                <Col xs={12} sm={6}>
                  <Form.Group controlId="editRole">
                    <Form.Label className="form-label-dashboard">
                      Role *
                    </Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role || 'user'}
                      onChange={onChange}
                      className="form-control-dashboard"
                    >
                      <option value="user">Customer</option>
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* Phone Field */}
                <Col xs={12} sm={6}>
                  <Form.Group controlId="editPhone">
                    <Form.Label className="form-label-dashboard">
                      Phone
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={onChange}
                      className="form-control-dashboard"
                      placeholder="+1 555-0199"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          ) : (
            /* ============================================================
               ADD MODE (Figma Page 3 - Clean Creation Grid with Password)
               ============================================================ */
            <Row className="g-3">
              {/* First Name */}
              <Col xs={12} sm={6}>
                <Form.Group controlId="addFirstName">
                  <Form.Label className="form-label-dashboard">
                    First Name *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="e.g. Johnathan"
                    value={formData.firstName || ''}
                    onChange={onChange}
                    isInvalid={Boolean(errors.firstName)}
                    className="form-control-dashboard"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Last Name */}
              <Col xs={12} sm={6}>
                <Form.Group controlId="addLastName">
                  <Form.Label className="form-label-dashboard">
                    Last Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="e.g. Doe"
                    value={formData.lastName || ''}
                    onChange={onChange}
                    className="form-control-dashboard"
                  />
                </Form.Group>
              </Col>

              {/* Username */}
              <Col xs={12} sm={6}>
                <Form.Group controlId="addUsername">
                  <Form.Label className="form-label-dashboard">
                    Username *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="@johndoe"
                    value={formData.username || ''}
                    onChange={onChange}
                    isInvalid={Boolean(errors.username)}
                    className="form-control-dashboard"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Email Address */}
              <Col xs={12} sm={6}>
                <Form.Group controlId="addEmail">
                  <Form.Label className="form-label-dashboard">
                    Email Address *
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="john@shopstream.com"
                    value={formData.email || ''}
                    onChange={onChange}
                    isInvalid={Boolean(errors.email)}
                    className="form-control-dashboard"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Role Dropdown */}
              <Col xs={12} sm={6}>
                <Form.Group controlId="addRole">
                  <Form.Label className="form-label-dashboard">
                    Role *
                  </Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role || 'user'}
                    onChange={onChange}
                    className="form-control-dashboard"
                  >
                    <option value="user">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Password */}
              <Col xs={12} sm={6}>
                <Form.Group controlId="addPassword">
                  <Form.Label className="form-label-dashboard">
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password || ''}
                    onChange={onChange}
                    className="form-control-dashboard"
                  />
                </Form.Group>
              </Col>

              {/* Avatar Image URL */}
              <Col xs={12}>
                <Form.Group controlId="addImage">
                  <Form.Label className="form-label-dashboard">
                    Profile Picture URL
                  </Form.Label>
                  <Form.Control
                    type="url"
                    name="image"
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.image || ''}
                    onChange={onChange}
                    className="form-control-dashboard"
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          <MockApiNotice className="dashboard-info-notice-blue mt-3">
            This mock change is visible in the current Dashboard view and may reset after refresh or leaving the page.
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
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : isEdit ? (
              'Update User'
            ) : (
              '+ Create User'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default UserFormModal
