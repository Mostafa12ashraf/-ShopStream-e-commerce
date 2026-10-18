import { Outlet } from 'react-router-dom'

// TODO (Phase 2): check auth state and redirect to /login if not authenticated
// This is a pass-through wrapper for Phase 1 only.
function ProtectedRoute() {
  return <Outlet />
}

export default ProtectedRoute
