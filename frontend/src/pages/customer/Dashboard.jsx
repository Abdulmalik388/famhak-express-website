import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyOrders } from '../../store/slices/orderSlice'
import useAuth from '../../hooks/useAuth'
import NotificationBell from '../../components/NotificationBell'
import CustomerSidebar from '../../components/layout/CustomerSidebar'

function CustomerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { orders } = useSelector((state) => state.orders)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  useEffect(() => {
    dispatch(fetchMyOrders())
  }, [dispatch])

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status))
  const completedOrders = orders.filter(o => o.status === 'delivered')

  return (
    <div className="min-vh-100 d-flex" style={{ backgroundColor: '#f8f9fa' }}>

      <CustomerSidebar mobileOpen={sidebarOpen} isMobile={isMobile} onClose={() => setSidebarOpen(false)} />
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            zIndex: 1040,
          }}
        />
      )}

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: isMobile ? 0 : '280px', flex: 1, padding: '0' }}>

        {/* Top bar */}
        <div
          className="d-flex justify-content-between align-items-center px-4 py-3"
          style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: 'white' }}
        >
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary d-md-none"
              onClick={() => setSidebarOpen((prev) => !prev)}
              style={{ minWidth: '40px', padding: '0.5rem 0.75rem' }}
            >
              ☰
            </button>
            <h4 className="fw-bold mb-0">Welcome back, {user?.full_name?.split(' ')[0]}!</h4>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="fw-semibold" style={{ fontSize: '15px' }}>
              Hi, {user?.full_name?.split(' ')[0]} 👋
            </span>
            <NotificationBell />
          </div>
        </div>

        {/* Dashboard body */}
        <div className="p-4">
          <div className="mb-4">
            <p className="text-muted mb-0">What would you like to send today?</p>
          </div>

          {/* Stats */}
          <div className="row g-3 mb-4">
            {[
              { label: 'Total Orders', value: orders.length, icon: '📦' },
              { label: 'Active Orders', value: activeOrders.length, icon: '🏍️' },
              { label: 'Completed', value: completedOrders.length, icon: '✅' },
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

          {/* Quick actions */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <button
                className="btn w-100 text-white fw-bold py-3 shadow-sm"
                style={{ backgroundColor: '#F97316', borderRadius: '12px', border: 'none' }}
                onClick={() => navigate('/customer/place-order')}
              >
                📦 Place New Order
              </button>
            </div>
            <div className="col-md-6">
              <button
                className="btn w-100 fw-bold py-3 shadow-sm"
                style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #dee2e6' }}
                onClick={() => navigate('/customer/orders')}
              >
                📋 View All Orders
              </button>
            </div>
          </div>

          {/* Recent orders */}
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
    </div>
  )
}

export default CustomerDashboard