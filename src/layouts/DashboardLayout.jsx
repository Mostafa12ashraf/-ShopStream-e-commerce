import { useState, useContext } from 'react'
import { NavLink, Link, Outlet, useNavigate, Navigate } from 'react-router-dom'
import { Button, Offcanvas } from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'
import '../pages/dashboard/Dashboard.css'

const CURRENT_YEAR = new Date().getFullYear()

function DashboardLayout() {
  const navigate = useNavigate()
  const { token, isAuthenticated, user, logout } = useContext(AuthContext)
  const { theme, toggleTheme } = useContext(ThemeContext)
  const [showMobileNav, setShowMobileNav] = useState(false)

  // Auth protection: Unauthenticated visitors are redirected to /login
  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const displayName =
    user?.firstName || user?.lastName
      ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
      : user?.username || 'User'

  const userRole = user?.role ? user.role.toUpperCase() : 'ACCOUNT'

  const userInitial = user?.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : user?.username
    ? user.username.charAt(0).toUpperCase()
    : 'U'

  // Shared Navigation content for desktop sidebar & mobile offcanvas
  const navContent = (
    <>
      <div className="dashboard-brand-box">
        <Link to="/dashboard/products" className="text-decoration-none">
          <div className="dashboard-brand-title">ShopStream</div>
          <div className="dashboard-brand-badge">Admin Panel</div>
        </Link>
      </div>

      <nav className="dashboard-nav-list" aria-label="Dashboard navigation">
        <NavLink
          to="/dashboard/products"
          className={({ isActive }) =>
            `dashboard-nav-item ${isActive ? 'active' : ''}`
          }
          onClick={() => setShowMobileNav(false)}
        >
          <span>📦</span>
          <span>Inventory</span>
        </NavLink>

        <NavLink
          to="/dashboard/carts"
          className={({ isActive }) =>
            `dashboard-nav-item ${isActive ? 'active' : ''}`
          }
          onClick={() => setShowMobileNav(false)}
        >
          <span>🛍️</span>
          <span>Orders</span>
        </NavLink>

        <NavLink
          to="/dashboard/users"
          className={({ isActive }) =>
            `dashboard-nav-item ${isActive ? 'active' : ''}`
          }
          onClick={() => setShowMobileNav(false)}
        >
          <span>👥</span>
          <span>Customers</span>
        </NavLink>

        <div className="dashboard-nav-divider" />

        <Link
          to="/"
          className="dashboard-nav-item"
          onClick={() => setShowMobileNav(false)}
        >
          <span>🏪</span>
          <span>Store</span>
        </Link>
      </nav>

      {/* User Area */}
      <div className="dashboard-user-card">
        <div className="dashboard-user-info">
          {user?.image ? (
            <img
              src={user.image}
              alt={displayName}
              className="dashboard-user-avatar"
            />
          ) : (
            <div className="dashboard-user-avatar-fallback">{userInitial}</div>
          )}
          <div className="dashboard-user-names">
            <p className="dashboard-user-name" title={displayName}>
              {displayName}
            </p>
            <p className="dashboard-user-role">{userRole}</p>
          </div>
        </div>
        <div className="d-flex align-items-center gap-1">
          <button
            type="button"
            className="dashboard-theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            type="button"
            className="dashboard-signout-btn"
            onClick={handleLogout}
            title="Sign Out"
            aria-label="Sign Out"
          >
            🚪
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="dashboard-wrapper">
      {/* Desktop Sticky Sidebar */}
      <aside className="dashboard-sidebar">{navContent}</aside>

      {/* Mobile Responsive Offcanvas Navigation */}
      <Offcanvas
        show={showMobileNav}
        onHide={() => setShowMobileNav(false)}
        placement="start"
        className="dashboard-sidebar d-flex"
      >
        <Offcanvas.Header closeButton className="p-3">
          <Offcanvas.Title className="fw-bold text-primary fs-5">
            Admin Menu
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column p-3">
          {navContent}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content Area */}
      <div className="dashboard-main-area">
        {/* Mobile Topbar: spans 100% at the top of viewport */}
        <div className="dashboard-mobile-topbar">
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowMobileNav(true)}
              aria-label="Open dashboard navigation"
            >
              ☰
            </Button>
            <span className="fw-bold text-primary">ShopStream Admin</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="dashboard-theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <Link to="/" className="btn btn-sm btn-outline-primary">
              View Store
            </Link>
          </div>
        </div>

        <main className="dashboard-content-body">
          <Outlet />
        </main>

        {/* Dashboard Footer */}
        <footer className="dashboard-footer">
          <div>© {CURRENT_YEAR} ShopStream Inc. All rights reserved.</div>
          <div className="dashboard-footer-links">
            <span className="text-muted small">Internal Administration Tool</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default DashboardLayout
