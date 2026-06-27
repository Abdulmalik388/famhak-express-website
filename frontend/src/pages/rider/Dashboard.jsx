import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyOrders } from '../../store/slices/orderSlice'
import useAuth from '../../hooks/useAuth'

function RiderDashboard() {
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
      <nav className="navbar px-4 py-3" style={{ backgroundColor: '#1C1C1E' }}>
        <span className="navbar-brand text-white fw-bold">🚚 Famhak Express — Rider</span>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white d-none d-md-block">Hi, {user?.full_name?.split(' ')[0]} 👋</span>
          <button className="btn btn-outline-light btn-sm" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="container py-4">
        <div className="mb-4">
          <h4 className="fw-bold mb-1">Rider Dashboard 🏍️</h4>
          <p className="text-muted mb-0">Ready to make some deliveries today?</p>
        </div>

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

        <div className="row g-3">
          <div className="col-md-6">
            <button className="btn w-100 fw-bold py-3 text-white shadow-sm" style={{ backgroundColor: '#1C1C1E', borderRadius: '12px', border: 'none' }} onClick={() => navigate('/rider/available-orders')}>
              🏍️ View Available Orders
            </button>
          </div>
          <div className="col-md-6">
            <button className="btn w-100 fw-bold py-3 shadow-sm" style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #dee2e6' }} onClick={() => navigate('/rider/my-orders')}>
              📋 My Deliveries
            </button>
          </div>
          <div className="col-md-4">
    <button
        className="btn w-100 fw-bold py-3 shadow-sm"
        style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #dee2e6' }}
        onClick={() => navigate('/rider/earnings')}
    >
        💰 My Earnings
    </button>
</div>
        </div>
      </div>
    </div>
  )
}

export default RiderDashboard