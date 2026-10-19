import { Outlet } from 'react-router-dom'
import StoreNavbar from '../components/StoreNavbar'
import StoreFooter from '../components/StoreFooter'

function StoreLayout() {
  return (
    <>
      <StoreNavbar />
      <Outlet />
      <StoreFooter />
    </>
  )
}

export default StoreLayout
