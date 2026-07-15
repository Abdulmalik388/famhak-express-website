import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAvailableOrders, updateOrderStatus } from '../../store/slices/orderSlice'
import useAuth from '../../hooks/useAuth'
import NotificationBell from '../../components/NotificationBell'
import RiderSidebar from '../../components/layout/RiderSidebar'
import toast from 'react-hot-toast'

function AvailableOrders() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { availableOrders, loading } = useSelector((state) => state.orders)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
            <h5 className="fw-bold mb-0">Available Orders</h5>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="fw-semibold" style={{ fontSize: '15px' }}>Hi, {user?.full_name?.split(' ')[0]} 👋</span>
            <NotificationBell />
          </div>
        </div>

        <div className="p-4">
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
                      <p className="mb-1 small"><span className="fw-semibold">📍 Pickup:</span> {order.pickup_address}</p>
                      <p className="mb-1 small"><span className="fw-semibold">🏁 Dropoff:</span> {order.dropoff_address}</p>
                      <p className="mb-1 small"><span className="fw-semibold">📦 Package:</span> {order.package_description} ({order.package_size})</p>
                      <p className="mb-0 small"><span className="fw-semibold">👤 Receiver:</span> {order.receiver_name} — {order.receiver_phone}</p>
                    </div>
                    <div className="text-end">
                      <p className="fw-bold fs-5 mb-2" style={{ color: '#F97316' }}>₦{Number(order.price).toLocaleString()}</p>
                      <button className="btn text-white fw-semibold px-4"
                        style={{ backgroundColor: '#1C1C1E', borderRadius: '8px' }}
                        onClick={() => acceptOrder(order.id)}>
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
    </div>
  )
}

export default AvailableOrders