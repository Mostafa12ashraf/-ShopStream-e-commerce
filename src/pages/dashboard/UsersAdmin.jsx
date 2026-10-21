import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Row,
  Col,
  Table,
  Button,
  Alert,
  Spinner,
} from 'react-bootstrap'
import UserFormModal from '../../components/dashboard/UserFormModal'
import UserDetailsModal from '../../components/dashboard/UserDetailsModal'
import DeleteUserModal from '../../components/dashboard/DeleteUserModal'
import DashboardPagination from '../../components/dashboard/DashboardPagination'

const PAGE_SIZE = 10

// Initial state for consolidated User Form (Add & Edit)
const INITIAL_USER_FORM = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phone: '',
  role: 'user',
  password: '',
  image: '',
}

function getRoleDisplay(role) {
  if (role === 'admin') {
    return {
      label: 'Admin',
      className: 'role-pill-admin',
    }
  }

  if (role === 'moderator') {
    return {
      label: 'Moderator',
      className: 'role-pill-moderator',
    }
  }

  return {
    label: 'Customer',
    className: 'role-pill-customer',
  }
}

// Consolidated validation function for both Add and Edit modes
function validateUserForm(formData) {
  const errors = {}
  if (!formData.firstName?.trim()) {
    errors.firstName = 'First name is required.'
  }
  if (!formData.username?.trim()) {
    errors.username = 'Username is required.'
  }
  if (!formData.email?.trim()) {
    errors.email = 'Email address is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  return errors
}

function UsersAdmin() {
  // Main Data States
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [alert, setAlert] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Details Modal States
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Form Modal States (Consolidated for Add and Edit)
  const [showFormModal, setShowFormModal] = useState(false)
  const [formMode, setFormMode] = useState('add') // 'add' | 'edit'
  const [userForm, setUserForm] = useState(INITIAL_USER_FORM)
  const [userFormErrors, setUserFormErrors] = useState({})
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)

  // Delete User Confirmation Modal States (Figma Page 1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch Users on mount and when page, search query, or refresh trigger changes
  useEffect(() => {
    let isMounted = true
    const skip = (currentPage - 1) * PAGE_SIZE

    async function loadUsers() {
      setLoading(true)
      setError(null)

      try {
        let url = `https://dummyjson.com/users?limit=${PAGE_SIZE}&skip=${skip}`
        if (searchQuery.trim()) {
          url = `https://dummyjson.com/users/search?q=${encodeURIComponent(
            searchQuery.trim()
          )}&limit=${PAGE_SIZE}&skip=${skip}`
        }

        const response = await axios.get(url)
        if (isMounted) {
          setUsers(response.data.users || [])
          setTotal(response.data.total || 0)
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              'Failed to load users. Please try again.'
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      isMounted = false
    }
  }, [currentPage, searchQuery, refreshKey])

  function handleRefresh() {
    setRefreshKey((prev) => prev + 1)
  }

  // Handle Search Input Change
  function handleSearchChange(e) {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to page 1 on search change
  }

  // Summary Metrics calculations
  const totalCatalogUsers = total
  const displayedCount = users.length
  const adminsOnPage = users.filter((u) => u.role === 'admin').length
  const customersOnPage = users.filter(
    (u) => u.role !== 'admin' && u.role !== 'moderator'
  ).length

  // Pagination calculations
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1

  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage)
    }
  }

  // Export visible users to CSV
  function handleExportCSV() {
    if (users.length === 0) return

    const headers = ['ID', 'Full Name', 'Username', 'Email', 'Role', 'Phone', 'Company']
    const rows = users.map((u) => [
      u.id,
      `"${(u.firstName + ' ' + (u.lastName || '')).trim().replace(/"/g, '""')}"`,
      `"${u.username || ''}"`,
      `"${u.email || ''}"`,
      `"${u.role || 'user'}"`,
      `"${u.phone || ''}"`,
      `"${(u.company?.name || '').replace(/"/g, '""')}"`,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `ShopStream_Users_Page_${currentPage}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // ============================================================
  // Details Flow
  // ============================================================
  function handleOpenDetails(user) {
    setSelectedUser(user)
    setShowDetailsModal(true)
  }

  function handleCloseDetailsModal() {
    setShowDetailsModal(false)
    setSelectedUser(null)
  }

  // ============================================================
  // Form Modal Reset and Change Handlers
  // ============================================================
  function handleCloseFormModal() {
    if (isFormSubmitting) return
    setShowFormModal(false)
    setUserFormErrors({})
    setSelectedUser(null)
    setUserForm(INITIAL_USER_FORM)
  }

  function handleFormChange(e) {
    const { name, value } = e.target
    setUserForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear validation error on change if present
    if (userFormErrors[name]) {
      setUserFormErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // ============================================================
  // Add User Flow (Figma Page 3)
  // ============================================================
  function handleOpenAddModal() {
    setUserFormErrors({})
    setSelectedUser(null)
    setFormMode('add')
    setUserForm(INITIAL_USER_FORM)
    setShowFormModal(true)
  }

  async function handleAddSubmit() {
    setIsFormSubmitting(true)
    try {
      const payload = {
        firstName: userForm.firstName.trim(),
        lastName: userForm.lastName.trim(),
        username: userForm.username.trim(),
        email: userForm.email.trim(),
        role: userForm.role,
        phone: userForm.phone.trim() || undefined,
        password: userForm.password || undefined,
        image: userForm.image.trim() || undefined,
      }

      const response = await axios.post(
        'https://dummyjson.com/users/add',
        payload
      )

      const created = {
        ...response.data,
        id: response.data.id || Date.now(),
        firstName: payload.firstName,
        lastName: payload.lastName,
        username: payload.username,
        email: payload.email,
        role: payload.role,
        image:
          payload.image ||
          `https://dummyjson.com/icon/${payload.username}/128`,
      }

      // Add to local state and enforce PAGE_SIZE
      setUsers((prev) => [created, ...prev].slice(0, PAGE_SIZE))
      setTotal((prev) => prev + 1)
      handleCloseFormModal()

      setAlert({
        type: 'success',
        message: `User "${created.firstName} ${created.lastName}" added successfully! (Note: This mock change is visible in the current Dashboard view and may reset after refresh or leaving the page).`,
      })
    } catch (err) {
      setAlert({
        type: 'danger',
        message:
          err.response?.data?.message ||
          err.message ||
          'Failed to add user. Please try again.',
      })
    } finally {
      setIsFormSubmitting(false)
    }
  }

  // ============================================================
  // Edit User Flow (Figma Page 4)
  // ============================================================
  function handleOpenEditModal(user) {
    setUserFormErrors({})
    setSelectedUser(user)
    setFormMode('edit')
    setUserForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'user',
      password: '',
      image: user.image || '',
    })
    setShowFormModal(true)
  }

  async function handleEditSubmit() {
    if (!selectedUser) return

    setIsFormSubmitting(true)
    try {
      const payload = {
        firstName: userForm.firstName.trim(),
        lastName: userForm.lastName.trim(),
        username: userForm.username.trim(),
        email: userForm.email.trim(),
        role: userForm.role,
        phone: userForm.phone.trim() || undefined,
        image: userForm.image.trim() || undefined,
      }

      const response = await axios.put(
        `https://dummyjson.com/users/${selectedUser.id}`,
        payload
      )

      // Update matching user in local state without touching AuthContext session
      setUsers((prev) =>
        prev.map((item) =>
          item.id === selectedUser.id ? { ...item, ...response.data } : item
        )
      )

      handleCloseFormModal()
      setAlert({
        type: 'success',
        message: `User "${payload.firstName} ${payload.lastName}" updated successfully!`,
      })
    } catch (err) {
      setAlert({
        type: 'danger',
        message:
          err.response?.data?.message ||
          err.message ||
          'Failed to update user. Please try again.',
      })
    } finally {
      setIsFormSubmitting(false)
    }
  }

  // Unified submit dispatcher
  async function handleFormSubmit(e) {
    e.preventDefault()
    const validationErrors = validateUserForm(userForm)
    if (Object.keys(validationErrors).length > 0) {
      setUserFormErrors(validationErrors)
      return
    }

    if (formMode === 'add') {
      await handleAddSubmit()
    } else {
      await handleEditSubmit()
    }
  }

  // ============================================================
  // Delete User Flow (Figma Page 1)
  // ============================================================
  function handleOpenDeleteModal(user) {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  function handleCloseDeleteModal() {
    if (isDeleting) return
    setShowDeleteModal(false)
    setUserToDelete(null)
  }

  async function handleDeleteConfirm() {
    if (!userToDelete) return

    setIsDeleting(true)
    try {
      await axios.delete(`https://dummyjson.com/users/${userToDelete.id}`)

      // Remove from local list
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id))
      setTotal((prev) => Math.max(0, prev - 1))

      // If page becomes empty after deletion and not on page 1, step back safely
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      }

      setShowDeleteModal(false)
      setUserToDelete(null)
      setAlert({
        type: 'success',
        message: `User "${userToDelete.firstName} ${userToDelete.lastName}" was deleted successfully!`,
      })
    } catch (err) {
      setAlert({
        type: 'danger',
        message:
          err.response?.data?.message ||
          err.message ||
          'Failed to delete user. Please try again.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="users-admin-container">
      {/* Global Feedback Alert */}
      {alert && (
        <Alert
          variant={alert.type}
          dismissible
          onClose={() => setAlert(null)}
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}

      {/* Header Row (Figma Page 2) */}
      <div className="dashboard-header-row">
        <div>
          <h1 className="dashboard-page-title">User Directory</h1>
          <p className="dashboard-page-subtitle">
            Manage your store members, customers, and administrators.
          </p>
        </div>
        <div>
          <Button
            type="button"
            className="btn-dashboard-add btn-dashboard-add-purple"
            onClick={handleOpenAddModal}
            aria-label="Add New User"
          >
            <span>+</span> Add New User
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards Row (Figma Page 2) */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} lg={3}>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-header">
              <span className="dashboard-stat-label">Total Users</span>
              <span className="dashboard-stat-badge badge-stat-purple">
                Catalog
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="dashboard-stat-value mb-0">{totalCatalogUsers}</h3>
              <span className="fs-4 text-muted" aria-hidden="true">👥</span>
            </div>
          </div>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-header">
              <span className="dashboard-stat-label">Admins</span>
              <span className="dashboard-stat-badge badge-stat-green">
                Current Page
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="dashboard-stat-value mb-0">{adminsOnPage}</h3>
              <span className="fs-4 text-muted" aria-hidden="true">🛡️</span>
            </div>
          </div>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-header">
              <span className="dashboard-stat-label">Customers</span>
              <span className="dashboard-stat-badge badge-stat-blue">
                Current Page
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="dashboard-stat-value mb-0">{customersOnPage}</h3>
              <span className="fs-4 text-muted" aria-hidden="true">👤</span>
            </div>
          </div>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-header">
              <span className="dashboard-stat-label">Page Items</span>
              <span className="dashboard-stat-badge badge-stat-amber">
                Showing
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="dashboard-stat-value mb-0">{displayedCount}</h3>
              <span className="fs-4 text-muted" aria-hidden="true">📄</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* Main Users Table Card (Figma Page 2) */}
      <div className="dashboard-table-card">
        {/* Table Toolbar */}
        <div className="dashboard-table-toolbar">
          <div className="dashboard-search-wrapper">
            <span className="dashboard-search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="search"
              placeholder="Search users by name, username, or email..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="dashboard-search-input"
              aria-label="Search users"
            />
          </div>

          <div className="dashboard-toolbar-actions">
            {searchQuery && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="btn-dashboard-tool"
              >
                Clear Search
              </Button>
            )}
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleExportCSV}
              className="btn-dashboard-tool"
              disabled={users.length === 0}
              title="Export currently displayed page as CSV"
            >
              📥 Export CSV (Page)
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleRefresh}
              className="btn-dashboard-tool"
              title="Refresh users directory"
            >
              🔄 Refresh
            </Button>
          </div>
        </div>

        {/* Loading / Error / Empty / Table Content */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" role="status" />
            <p className="mt-3 text-muted">Loading user directory...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <Alert variant="danger" className="d-inline-block text-start mb-3">
              {error}
            </Alert>
            <div>
              <Button variant="primary" size="sm" onClick={handleRefresh}>
                Retry
              </Button>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-5">
            <div className="fs-1 mb-2 text-muted">👥</div>
            <h5 className="fw-bold">No Users Found</h5>
            <p className="text-muted small">
              {searchQuery
                ? `No users match your search "${searchQuery}".`
                : 'There are currently no users in the directory.'}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="dashboard-table align-middle mb-0">
              <thead>
                <tr>
                  <th>USER</th>
                  <th>EMAIL ADDRESS</th>
                  <th>ROLE</th>
                  <th>PHONE</th>
                  <th className="text-end">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const fullName = `${u.firstName} ${u.lastName || ''}`.trim()
                  const initial = u.firstName ? u.firstName.charAt(0).toUpperCase() : 'U'
                  const roleDisplay = getRoleDisplay(u.role)

                  return (
                    <tr key={u.id}>
                      {/* USER Column (Avatar, Full Name, Username) */}
                      <td>
                        <div className="dashboard-user-cell">
                          {u.image ? (
                            <img
                              src={u.image}
                              alt={fullName}
                              className="dashboard-user-avatar"
                              onError={(e) => {
                                e.currentTarget.src =
                                  'https://dummyjson.com/icon/default/128'
                              }}
                            />
                          ) : (
                            <div className="dashboard-user-avatar-fallback">
                              {initial}
                            </div>
                          )}
                          <div className="dashboard-user-info">
                            <div className="dashboard-user-name" title={fullName}>
                              {fullName}
                            </div>
                            <div className="dashboard-user-username">
                              @{u.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL ADDRESS */}
                      <td>
                        <span className="dashboard-email-text" title={u.email}>
                          {u.email}
                        </span>
                      </td>

                      {/* ROLE */}
                      <td>
                        <span className={`role-pill ${roleDisplay.className}`}>
                          {roleDisplay.label}
                        </span>
                      </td>

                      {/* PHONE (Real API field) */}
                      <td>
                        <span className="dashboard-phone-text text-secondary small">
                          {u.phone || 'N/A'}
                        </span>
                      </td>

                      {/* ACTIONS: Details, Edit, Delete */}
                      <td className="text-end dashboard-actions-cell">
                        <button
                          type="button"
                          className="btn-action-icon"
                          onClick={() => handleOpenDetails(u)}
                          title="View User Details"
                          aria-label={`View details of ${fullName}`}
                        >
                          👁️
                        </button>
                        <button
                          type="button"
                          className="btn-action-icon"
                          onClick={() => handleOpenEditModal(u)}
                          title="Edit User"
                          aria-label={`Edit ${fullName}`}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="btn-action-icon btn-action-delete"
                          onClick={() => handleOpenDeleteModal(u)}
                          title="Delete User"
                          aria-label={`Delete ${fullName}`}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        )}

        {/* Table Footer with Extracted DashboardPagination */}
        {!loading && !error && users.length > 0 && (
          <DashboardPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={total}
            pageSize={PAGE_SIZE}
            itemLabel="users"
            ariaLabel="Users pagination"
          />
        )}
      </div>

      {/* ============================================================
          USER DETAILS MODAL
          ============================================================ */}
      <UserDetailsModal
        show={showDetailsModal}
        selectedUser={selectedUser}
        onClose={handleCloseDetailsModal}
        getRoleDisplay={getRoleDisplay}
      />

      {/* ============================================================
          USER FORM MODAL (Add & Edit - Figma Page 3 & Page 4)
          ============================================================ */}
      <UserFormModal
        show={showFormModal}
        mode={formMode}
        formData={userForm}
        errors={userFormErrors}
        loading={isFormSubmitting}
        selectedUser={selectedUser}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
        onClose={handleCloseFormModal}
      />

      {/* ============================================================
          DELETE USER MODAL (Figma Page 1)
          ============================================================ */}
      <DeleteUserModal
        show={showDeleteModal}
        userToDelete={userToDelete}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={handleCloseDeleteModal}
        getRoleDisplay={getRoleDisplay}
      />
    </div>
  )
}

export default UsersAdmin
