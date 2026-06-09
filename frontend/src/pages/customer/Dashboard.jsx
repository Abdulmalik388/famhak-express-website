import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyOrders } from '../../store/slices/orderSlice'
import useAuth from '../../hooks/useAuth'

function CustomerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { orders } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(fetchMyOrders())
  }, [dispatch])

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status))
  const completedOrders = orders.filter(o => o.status === 'delivered')

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar px-4 py-3" style={{ backgroundColor: '#F97316' }}>
        <span className="navbar-brand text-white fw-bold fs-5">🚚 Famhak Express</span>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white d-none d-md-block">Hi, {user?.full_name?.split(' ')[0]} 👋</span>
          <button className="btn btn-outline-light btn-sm" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="container py-4">
        <div className="mb-4">
          <h4 className="fw-bold mb-1">Welcome back, {user?.full_name?.split(' ')[0]}! 👋</h4>
          <p className="text-muted mb-0">What would you like to send today?</p>
        </div>

        <div className="row g-3 mb-4">
          {[
            { label: 'Total Orders', value: orders.length, icon: '📦', color: '#F97316' },
            { label: 'Active Orders', value: activeOrders.length, icon: '🏍️', color: '#0d6efd' },
            { label: 'Completed', value: completedOrders.length, icon: '✅', color: '#198754' },
          ].map((stat) => (
            <div key={stat.label} className="col-md-4">
              <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '12px' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1 small">{stat.label}</p>
                    <h3 className="fw-bold mb-0">{stat.value}</h3>
                  </div>
                  <div style={{ fontSize: '2.5rem' }}>{stat.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <button className="btn w-100 text-white fw-bold py-3 shadow-sm" style={{ backgroundColor: '#F97316', borderRadius: '12px', border: 'none' }} onClick={() => navigate('/customer/place-order')}>
              📦 Place New Order
            </button>
          </div>
          <div className="col-md-6">
            <button className="btn w-100 fw-bold py-3 shadow-sm" style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #dee2e6' }} onClick={() => navigate('/customer/orders')}>
              📋 View All Orders
            </button>
          </div>
        </div>

        <h5 className="fw-bold mb-3">Recent Orders</h5>
        {orders.length === 0 ? (
          <div className="card border-0 shadow-sm p-5 text-center" style={{ borderRadius: '12px' }}>
            <div style={{ fontSize: '3rem' }}>📦</div>
            <h6 className="fw-bold mt-3">No orders yet</h6>
            <p className="text-muted small">Place your first delivery order!</p>
          </div>
        ) : (
          <div className="row g-2">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="col-12">
                <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '10px' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="fw-semibold mb-0 small">{order.pickup_address} → {order.dropoff_address}</p>
                      <p className="text-muted mb-0" style={{ fontSize: '12px' }}>{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-end">
                      <span className={`badge bg-${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'} d-block mb-1`}>
                        {order.status}
                      </span>
                      <small className="fw-bold" style={{ color: '#F97316' }}>₦{Number(order.price).toLocaleString()}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerDashboard