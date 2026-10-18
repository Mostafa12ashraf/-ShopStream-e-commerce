import { Routes, Route } from 'react-router-dom'

import StoreLayout from '@/layouts/StoreLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import ProtectedRoute from '@/routes/ProtectedRoute'

import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

import Home from '@/pages/store/Home'
import Products from '@/pages/store/Products'
import ProductDetails from '@/pages/store/ProductDetails'
import Cart from '@/pages/store/Cart'
import Profile from '@/pages/store/Profile'

import Overview from '@/pages/dashboard/Overview'
import ProductsAdmin from '@/pages/dashboard/ProductsAdmin'
import CartsAdmin from '@/pages/dashboard/CartsAdmin'
import UsersAdmin from '@/pages/dashboard/UsersAdmin'

import NotFound from '@/pages/NotFound'

function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC – no layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* STORE – wrapped in StoreLayout */}
      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />

        {/* Profile is protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* DASHBOARD – protected, wrapped in DashboardLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/dashboard/products" element={<ProductsAdmin />} />
          <Route path="/dashboard/carts" element={<CartsAdmin />} />
          <Route path="/dashboard/users" element={<UsersAdmin />} />
        </Route>
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
