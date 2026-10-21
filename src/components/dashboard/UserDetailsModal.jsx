import { Modal, Row, Col, Button } from 'react-bootstrap'

function UserDetailsModal({ show, selectedUser, onClose, getRoleDisplay }) {
  if (!selectedUser) return null

  const roleDisplay = getRoleDisplay
    ? getRoleDisplay(selectedUser.role)
    : { label: selectedUser.role || 'User', className: 'role-pill-customer' }

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      className="dashboard-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="dashboard-modal-title">
          User Profile Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div>
          <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
            {selectedUser.image ? (
              <img
                src={selectedUser.image}
                alt={selectedUser.firstName || 'User'}
                className="dashboard-user-avatar-lg"
              />
            ) : (
              <div className="dashboard-user-avatar-lg-fallback">
                {selectedUser.firstName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <h5 className="fw-bold mb-1 text-dark">
                {selectedUser.firstName} {selectedUser.lastName}
              </h5>
              <div className="text-muted small">@{selectedUser.username}</div>
              <span className={`role-pill mt-2 d-inline-block ${roleDisplay.className}`}>
                {roleDisplay.label}
              </span>
            </div>
          </div>

          <Row className="g-3">
            <Col xs={12} sm={6}>
              <div className="user-detail-field">
                <span className="user-detail-label">Email Address</span>
                <span className="user-detail-value">{selectedUser.email || 'N/A'}</span>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="user-detail-field">
                <span className="user-detail-label">Phone</span>
                <span className="user-detail-value">{selectedUser.phone || 'N/A'}</span>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="user-detail-field">
                <span className="user-detail-label">Age / Gender</span>
                <span className="user-detail-value text-capitalize">
                  {selectedUser.age ? `${selectedUser.age} yrs` : ''}{' '}
                  {selectedUser.gender ? `• ${selectedUser.gender}` : 'N/A'}
                </span>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="user-detail-field">
                <span className="user-detail-label">Company</span>
                <span className="user-detail-value">
                  {selectedUser.company?.name || 'N/A'}
                  {selectedUser.company?.title
                    ? ` (${selectedUser.company.title})`
                    : ''}
                </span>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="user-detail-field">
                <span className="user-detail-label">Location</span>
                <span className="user-detail-value">
                  {selectedUser.address?.city
                    ? `${selectedUser.address.city}, ${selectedUser.address.state || ''}`
                    : 'N/A'}
                </span>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="user-detail-field">
                <span className="user-detail-label">University</span>
                <span className="user-detail-value">
                  {selectedUser.university || 'N/A'}
                </span>
              </div>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default UserDetailsModal
