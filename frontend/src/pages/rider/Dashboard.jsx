import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyOrders } from '../../store/slices/orderSlice'
import useAuth from '../../hooks/useAuth'
import NotificationBell from '../../components/NotificationBell'
import RiderSidebar from '../../components/layout/RiderSidebar'

function RiderDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { orders } = useSelector((state) => state.orders)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    dispatch(fetchMyOrders())
  }, [dispatch])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status))
  const completedOrders = orders.filter(o => o.status === 'delivered')

  return (
    <div className="min-vh-100 d-flex" style={{ backgroundColor: '#f8f9fa' }}>

      <RiderSidebar mobileOpen={sidebarOpen} isMobile={isMobile} onClose={() => setSidebarOpen(false)} />
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)', zIndex: 1050 }}
        />
      )}

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: isMobile ? 0 : '280px', flex: 1 }}>

        {/* Top bar */}
        <div className="d-flex justify-content-between align-items-center px-4 py-3"
          style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: 'white' }}>
          <div className="d-flex align-items-center gap-3">
            {isMobile && (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary d-md-none"
                onClick={() => setSidebarOpen((prev) => !prev)}
                style={{ minWidth: '40px', padding: '0.5rem 0.75rem' }}
              >
                ☰
              </button>
            )}
            <h5 className="fw-bold mb-0">Rider Dashboard</h5>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="fw-semibold" style={{ fontSize: '15px' }}>Hi, {user?.full_name?.split(' ')[0]} 👋</span>
            <NotificationBell />
          </div>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <p className="text-muted mb-0">Ready to make some deliveries today? 🏍️</p>
          </div>

          {/* Stats */}
          <div className="row g-3 mb-4">
            {[
              { label: 'Total Deliveries', value: orders.length, icon: '📦' },
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
          <div className="row g-3">
            <div className="col-md-6">
              <button className="btn w-100 fw-bold py-3 text-white shadow-sm"
                style={{ backgroundColor: '#1C1C1E', borderRadius: '12px', border: 'none' }}
                onClick={() => navigate('/rider/available-orders')}>
                🏍️ View Available Orders
              </button>
            </div>
            <div className="col-md-6">
              <button className="btn w-100 fw-bold py-3 shadow-sm"
                style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #dee2e6' }}
                onClick={() => navigate('/rider/my-orders')}>
                📋 My Deliveries
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RiderDashboard