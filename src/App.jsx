import { Routes, Route } from 'react-router-dom'

import StoreLayout from './layouts/StoreLayout'
import DashboardLayout from './layouts/DashboardLayout'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

import Home from './pages/store/Home'
import Products from './pages/store/Products'
import ProductDetails from './pages/store/ProductDetails'
import Cart from './pages/store/Cart'
import Checkout from './pages/store/Checkout'
import OrderConfirmation from './pages/store/OrderConfirmation'
import Profile from './pages/store/Profile'

import Overview from './pages/dashboard/Overview'
import ProductsAdmin from './pages/dashboard/ProductsAdmin'
import CartsAdmin from './pages/dashboard/CartsAdmin'
import UsersAdmin from './pages/dashboard/UsersAdmin'

import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Store routes */}
      <Route element={<StoreLayout />}>
        <Route index element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Dashboard routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Overview />} />
        <Route path="/dashboard/products" element={<ProductsAdmin />} />
        <Route path="/dashboard/carts" element={<CartsAdmin />} />
        <Route path="/dashboard/users" element={<UsersAdmin />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
