import { Routes, Route, Navigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useSelector } from 'react-redux'
import TrackOrder from './pages/customer/TrackOrder'
import ActiveDelivery from './pages/rider/ActiveDelivery'
import Landing from './pages/Landing'
import About from './pages/About'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import Riderform from './pages/Riderform'
import Login from './pages/Login'
import Register from './pages/Register'
import CustomerDashboard from './pages/customer/Dashboard'
import RiderDashboard from './pages/rider/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'
import PlaceOrder from './pages/customer/PlaceOrder'
import CustomerOrders from './pages/customer/Orders'
import AvailableOrders from './pages/rider/AvailableOrders'
import RiderMyOrders from './pages/rider/MyOrders'

import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blog" element={<Blog />} />
     <Route path="/riderform" element={<Riderform />} />

      <Route path="/login" element={
        isAuthenticated
          ? user?.role === 'customer' ? <Navigate to="/customer/dashboard" />
          : user?.role === 'rider' ? <Navigate to="/rider/dashboard" />
          : <Navigate to="/admin/dashboard" />
          : <Login />
      } />

      <Route path="/register" element={
        isAuthenticated
          ? user?.role === 'customer' ? <Navigate to="/customer/dashboard" />
          : user?.role === 'rider' ? <Navigate to="/rider/dashboard" />
          : <Navigate to="/admin/dashboard" />
          : <Register />
      } />

      <Route path="/customer/dashboard" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <CustomerDashboard />
        </ProtectedRoute>
      } />

      <Route path="/customer/place-order" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <PlaceOrder />
        </ProtectedRoute>
      } />

      <Route path="/customer/orders" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <CustomerOrders />
        </ProtectedRoute>
      } />
      <Route path="/customer/track/:orderId" element={
  <ProtectedRoute allowedRoles={['customer']}>
    <TrackOrder />
  </ProtectedRoute>
} />

      <Route path="/rider/dashboard" element={
        <ProtectedRoute allowedRoles={['rider']}>
          <RiderDashboard />
        </ProtectedRoute>
      } />

      <Route path="/rider/available-orders" element={
        <ProtectedRoute allowedRoles={['rider']}>
          <AvailableOrders />
        </ProtectedRoute>
      } />
      <Route path="/rider/my-orders" element={
  <ProtectedRoute allowedRoles={['rider']}>
    <RiderMyOrders />
  </ProtectedRoute>
} />
<Route path="/rider/active-delivery/:orderId" element={
  <ProtectedRoute allowedRoles={['rider']}>
    <ActiveDelivery />
  </ProtectedRoute>
} />

      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    
  )
}

export default App