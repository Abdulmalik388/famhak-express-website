import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchMyOrders } from '../../store/slices/orderSlice'
import useAuth from '../../hooks/useAuth'
import NotificationBell from '../../components/NotificationBell'
import RiderSidebar from '../../components/layout/RiderSidebar'

function RiderMyOrders() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { orders, loading } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(fetchMyOrders())
  }, [dispatch])

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status))
  const completedOrders = orders.filter(o => o.status === 'delivered')

  return (
    <div className="min-vh-100 d-flex" style={{ backgroundColor: '#f8f9fa' }}>

      <RiderSidebar />

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: '280px', flex: 1 }}>
        <div className="d-flex justify-content-between align-items-center px-4 py-3"
          style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: 'white' }}>
          <h5 className="fw-bold mb-0">My Deliveries</h5>
          <div className="d-flex align-items-center gap-3">
            <span className="fw-semibold" style={{ fontSize: '15px' }}>Hi, {user?.full_name?.split(' ')[0]} 👋</span>
            <NotificationBell />
          </div>
        </div>

        <div className="p-4">
          <div className="row g-3 mb-4">
            <div className="col-6">
              <div className="card border-0 shadow-sm p-3 text-center" style={{ borderRadius: '12px' }}>
                <h4 className="fw-bold mb-0">{activeOrders.length}</h4>
                <small className="text-muted">Active</small>
              </div>
            </div>
            <div className="col-6">
              <div className="card border-0 shadow-sm p-3 text-center" style={{ borderRadius: '12px' }}>
                <h4 className="fw-bold mb-0">{completedOrders.length}</h4>
                <small className="text-muted">Completed</small>
              </div>
            </div>
          </div>

          {loading && <div className="text-center py-5"><div className="spinner-border"></div></div>}

          {!loading && orders.length === 0 && (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem' }}>🏍️</div>
              <h5 className="fw-bold mt-3">No deliveries yet</h5>
              <p className="text-muted">Accept an order to get started!</p>
              <button className="btn text-white fw-semibold px-4"
                style={{ backgroundColor: '#1C1C1E' }}
                onClick={() => navigate('/rider/available-orders')}>
                View Available Orders
              </button>
            </div>
          )}

          <div className="row g-3">
            {orders.map((order) => (
              <div key={order.id} className="col-12">
                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                      <p className="mb-1 small"><span className="fw-semibold">📍 Pickup:</span> {order.pickup_address}</p>
                      <p className="mb-1 small"><span className="fw-semibold">🏁 Dropoff:</span> {order.dropoff_address}</p>
                      <p className="mb-1 small"><span className="fw-semibold">👤 Receiver:</span> {order.receiver_name} — {order.receiver_phone}</p>
                      <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-end">
                      <span className={`badge d-block mb-2 ${order.status === 'delivered' ? 'bg-success' : order.status === 'cancelled' ? 'bg-danger' : 'bg-warning'}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <p className="fw-bold mb-2" style={{ color: '#F97316' }}>₦{Number(order.price).toLocaleString()}</p>
                      {order.is_paid ? (
                        <span className="badge bg-success d-block mb-2">✅ Payment Received</span>
                      ) : (
                        <span className="badge bg-warning d-block mb-2">⏳ Payment Pending</span>
                      )}
                      {!['delivered', 'cancelled'].includes(order.status) && (
                        <button className="btn btn-sm text-white fw-semibold"
                          style={{ backgroundColor: '#1C1C1E', borderRadius: '8px' }}
                          onClick={() => navigate(`/rider/active-delivery/${order.id}`)}>
                          🏍️ Go to Delivery
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RiderMyOrders