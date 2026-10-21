import { Modal, Button, Spinner } from 'react-bootstrap'

function DeleteUserModal({
  show,
  userToDelete,
  isDeleting = false,
  onConfirm,
  onClose,
  getRoleDisplay,
}) {
  const roleDisplay =
    userToDelete && getRoleDisplay
      ? getRoleDisplay(userToDelete.role)
      : { label: userToDelete?.role || 'User', className: 'role-pill-customer' }

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

        <h4 className="fw-bold text-dark mb-2">Delete User Account?</h4>
        <p className="text-muted small mb-3" style={{ lineHeight: 1.5 }}>
          This mock deletion updates the current Dashboard view and may reset after refresh or leaving the page.
        </p>

        {/* User target preview card matching Figma Page 1 */}
        {userToDelete && (
          <div className="delete-target-preview text-start">
            {userToDelete.image ? (
              <img
                src={userToDelete.image}
                alt={userToDelete.firstName}
                className="delete-target-thumb rounded-circle"
              />
            ) : (
              <div className="dashboard-user-avatar-lg-fallback">
                {userToDelete.firstName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="flex-grow-1 min-width-0">
              <div
                className="fw-bold text-dark text-truncate"
                style={{ fontSize: '0.95rem' }}
              >
                {userToDelete.firstName} {userToDelete.lastName}
              </div>
              <div className="text-muted small text-truncate">
                {userToDelete.email}
              </div>
              <div className="mt-1">
                <span
                  className={`role-pill ${roleDisplay.className}`}
                  style={{ fontSize: '0.7rem' }}
                >
                  {roleDisplay.label}
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
            ← Go Back
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
              'Delete User'
            )}
          </Button>
        </div>

        <div
          className="mt-4 pt-3 border-top text-muted"
          style={{ fontSize: '0.725rem' }}
        >
          ℹ️ This mock deletion updates local state only and will not permanently remove users on the DummyJSON server.
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default DeleteUserModal
