import { Outlet } from 'react-router-dom'
import StoreNavbar from '../components/layout/StoreNavbar'
import StoreFooter from '../components/layout/StoreFooter'

function StoreLayout() {
  return (
    <div className="store-layout">
      <StoreNavbar />
      <main className="store-main">
        <Outlet />
      </main>
      <StoreFooter />
    </div>
  )
}

export default StoreLayout
