import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAvailableOrders, updateOrderStatus } from '../../store/slices/orderSlice'
import toast from 'react-hot-toast'

function AvailableOrders() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { availableOrders, loading } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(fetchAvailableOrders())
  }, [dispatch])

  const acceptOrder = async (orderId) => {
    const result = await dispatch(updateOrderStatus({ id: orderId, status: 'assigned' }))
    if (updateOrderStatus.fulfilled.match(result)) {
      toast.success('Order accepted!')
      navigate('/rider/my-orders')
    }
  }

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar px-4 py-3" style={{ backgroundColor: '#1C1C1E' }}>
        <span className="navbar-brand text-white fw-bold">🚚 Famhak Express — Rider</span>
        <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/rider/dashboard')}>
          ← Dashboard
        </button>
      </nav>

      <div className="container py-5">
        <h4 className="fw-bold mb-4">Available Orders</h4>

        {loading && <div className="text-center py-5"><div className="spinner-border"></div></div>}

        {!loading && availableOrders.length === 0 && (
          <div className="text-center py-5">
            <div style={{ fontSize: '4rem' }}>🏍️</div>
            <h5 className="fw-bold mt-3">No available orders</h5>
            <p className="text-muted">Check back soon for new delivery requests</p>
          </div>
        )}

        <div className="row g-3">
          {availableOrders.map((order) => (
            <div key={order.id} className="col-12">
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                  <div>
                    <p className="mb-1"><span className="fw-semibold">📍 Pickup:</span> {order.pickup_address}</p>
                    <p className="mb-1"><span className="fw-semibold">🏁 Dropoff:</span> {order.dropoff_address}</p>
                    <p className="mb-1"><span className="fw-semibold">📦 Package:</span> {order.package_description} ({order.package_size})</p>
                    <p className="mb-0"><span className="fw-semibold">👤 Receiver:</span> {order.receiver_name} — {order.receiver_phone}</p>
                  </div>
                  <div className="text-end">
                    <p className="fw-bold fs-5 mb-2" style={{ color: '#F97316' }}>₦{Number(order.price).toLocaleString()}</p>
                    <button className="btn text-white fw-semibold px-4" style={{ backgroundColor: '#1C1C1E', borderRadius: '8px' }} onClick={() => acceptOrder(order.id)}>
                      Accept Order
                    </button>
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

export default AvailableOrders