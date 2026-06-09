import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchMyOrders } from '../../store/slices/orderSlice'

const statusColors = {
  pending: 'warning',
  assigned: 'info',
  picked_up: 'primary',
  in_transit: 'primary',
  delivered: 'success',
  cancelled: 'danger',
}

function CustomerOrders() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { orders, loading } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(fetchMyOrders())
  }, [dispatch])

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar px-4 py-3" style={{ backgroundColor: '#F97316' }}>
        <span className="navbar-brand text-white fw-bold">🚚 Famhak Express</span>
        <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/customer/dashboard')}>
          ← Dashboard
        </button>
      </nav>

      <div className="container py-5">
        <h4 className="fw-bold mb-4">My Orders</h4>

        {loading && <div className="text-center py-5"><div className="spinner-border" style={{ color: '#F97316' }}></div></div>}

        {!loading && orders.length === 0 && (
          <div className="text-center py-5">
            <div style={{ fontSize: '4rem' }}>📦</div>
            <h5 className="fw-bold mt-3">No orders yet</h5>
            <p className="text-muted">Place your first delivery order!</p>
            <button className="btn text-white fw-semibold px-4" style={{ backgroundColor: '#F97316' }} onClick={() => navigate('/customer/place-order')}>
              Place Order
            </button>
          </div>
        )}

        <div className="row g-3">
          {orders.map((order) => (
            <div key={order.id} className="col-12">
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div>
                    <span className="text-muted small">Order ID</span>
                    <p className="fw-bold mb-1" style={{ fontSize: '13px' }}>{order.id}</p>
                    <p className="mb-1"><span className="fw-semibold">From:</span> {order.pickup_address}</p>
                    <p className="mb-1"><span className="fw-semibold">To:</span> {order.dropoff_address}</p>
                    <p className="mb-0 text-muted small">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-end">
                    <span className={`badge bg-${statusColors[order.status]} mb-2 d-block`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <p className="fw-bold mb-0" style={{ color: '#F97316' }}>₦{Number(order.price).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CustomerOrders