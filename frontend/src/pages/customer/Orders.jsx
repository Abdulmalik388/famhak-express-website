import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchMyOrders, updateOrderStatus } from '../../store/slices/orderSlice'
import useAuth from '../../hooks/useAuth'
import NotificationBell from '../../components/NotificationBell'
import CustomerSidebar from '../../components/layout/CustomerSidebar'
import toast from 'react-hot-toast'

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
    const { user, logout } = useAuth()
    const { orders, loading } = useSelector((state) => state.orders)
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

    const handleCancel = async (orderId) => {
        const result = await dispatch(updateOrderStatus({ id: orderId, status: 'cancelled' }))
        if (updateOrderStatus.fulfilled.match(result)) {
            toast.success('Order cancelled successfully')
        }
    }

      return (
        <div className="min-vh-100 d-flex" style={{ backgroundColor: '#f8f9fa' }}>

            <CustomerSidebar mobileOpen={sidebarOpen} isMobile={isMobile} onClose={() => setSidebarOpen(false)} />
            {isMobile && sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)', zIndex: 1040 }}
                />
            )}

            {/* MAIN CONTENT */}
            <div style={{ marginLeft: isMobile ? 0 : '280px', flex: 1 }}>

                {/* Top bar */}
                <div
                    className="d-flex justify-content-between align-items-center px-4 py-3"
                    style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: 'white' }}
                >
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
                        <h5 className="fw-bold mb-0">My Orders</h5>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <span className="fw-semibold" style={{ fontSize: '15px' }}>
                            Hi, {user?.full_name?.split(' ')[0]} 👋
                        </span>
                        <NotificationBell />
                    </div>
                </div>

                <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <p className="text-muted mb-0">Manage and track all your delivery orders</p>
                        <button
                            className="btn text-white fw-semibold"
                            style={{ backgroundColor: '#F97316', border: 'none', borderRadius: '8px' }}
                            onClick={() => navigate('/customer/place-order')}
                        >
                            + New Order
                        </button>
                    </div>

                    {loading && (
                        <div className="text-center py-5">
                            <div className="spinner-border" style={{ color: '#F97316' }}></div>
                        </div>
                    )}

                    {!loading && orders.length === 0 && (
                        <div className="text-center py-5">
                            <div style={{ fontSize: '4rem' }}>📦</div>
                            <h5 className="fw-bold mt-3">No orders yet</h5>
                            <p className="text-muted">Place your first delivery order!</p>
                            <button
                                className="btn text-white fw-semibold px-4"
                                style={{ backgroundColor: '#F97316' }}
                                onClick={() => navigate('/customer/place-order')}
                            >
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
                                            <p className="mb-1 small"><span className="fw-semibold">📍 From:</span> {order.pickup_address}</p>
                                            <p className="mb-1 small"><span className="fw-semibold">🏁 To:</span> {order.dropoff_address}</p>
                                            <p className="mb-1 small"><span className="fw-semibold">📦 Package:</span> {order.package_description}</p>
                                            <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>{new Date(order.created_at).toLocaleString()}</p>
                                        </div>

                                        <div className="text-end">
                                            <span className={`badge bg-${statusColors[order.status]} d-block mb-2`}>
                                                {order.status.replace('_', ' ').toUpperCase()}
                                            </span>

                                            {order.is_paid ? (
                                                <span className="badge bg-success d-block mb-2">✅ PAID</span>
                                            ) : (
                                                order.status !== 'cancelled' && (
                                                    <span className="badge bg-danger d-block mb-2">❌ UNPAID</span>
                                                )
                                            )}

                                            <p className="fw-bold mb-2" style={{ color: '#F97316' }}>
                                                ₦{Number(order.price).toLocaleString()}
                                            </p>

                                            <div className="d-flex gap-2 justify-content-end flex-wrap">
                                                {!order.is_paid && order.status !== 'cancelled' && (
                                                    <button
                                                        className="btn btn-sm text-white fw-semibold"
                                                        style={{ backgroundColor: '#198754', borderRadius: '8px' }}
                                                        onClick={() => navigate(`/customer/payment/${order.id}`)}
                                                    >
                                                        💳 Pay
                                                    </button>
                                                )}

                                                {['assigned', 'picked_up', 'in_transit'].includes(order.status) && (
                                                    <button
                                                        className="btn btn-sm text-white fw-semibold"
                                                        style={{ backgroundColor: '#F97316', borderRadius: '8px' }}
                                                        onClick={() => navigate(`/customer/track/${order.id}`)}
                                                    >
                                                        📍 Track
                                                    </button>
                                                )}
                                                {order.status === 'delivered' && !order.reviewed && (
                                                    <button
                                                        className="btn btn-sm fw-semibold"
                                                        style={{ backgroundColor: '#FFF7ED', color: '#F97316', borderRadius: '8px', border: '1px solid #F97316' }}
                                                        onClick={() => navigate(`/customer/review/${order.id}`)}
                                                    >
                                                        ⭐ Rate
                                                    </button>
                                                )}
                                                {order.status === 'delivered' && order.reviewed && (
                                                    <span className="badge bg-success d-block">✅ Rated</span>
                                                )}

                                                {order.status === 'pending' && (
                                                    <button
                                                        className="btn btn-sm btn-outline-danger fw-semibold"
                                                        style={{ borderRadius: '8px' }}
                                                        onClick={() => handleCancel(order.id)}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
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

export default CustomerOrders