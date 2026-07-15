import { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'
import useAuth from '../../hooks/useAuth'
import AdminSidebar from '../../components/layout/AdminSidebar'
import NotificationBell from '../../components/NotificationBell'
import toast from 'react-hot-toast'

const statusColors = {
    pending: 'warning', assigned: 'info', picked_up: 'primary',
    in_transit: 'primary', delivered: 'success', cancelled: 'danger',
}

function AdminOrders() {
    const { user } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await adminAPI.getAllOrders()
                setOrders(response.data)
            } catch (error) {
                toast.error('Failed to fetch orders')
            }
            setLoading(false)
        }
        fetchOrders()
    }, [])

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(o => o.status === filter)

    return (
        <div className="min-vh-100 d-flex" style={{ backgroundColor: '#f8f9fa' }}>
            <AdminSidebar mobileOpen={sidebarOpen} isMobile={isMobile} onClose={() => setSidebarOpen(false)} />
            {isMobile && sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)', zIndex: 1050 }}
                />
            )}

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
                        <h5 className="fw-bold mb-0">All Orders</h5>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <span className="fw-semibold" style={{ fontSize: '15px' }}>Hi, {user?.full_name?.split(' ')[0]} 👋</span>
                        <NotificationBell />
                    </div>
                </div>

                <div className="p-4">
                    {/* Filter tabs */}
                    <div className="d-flex gap-2 mb-4 flex-wrap">
                        {['all', 'pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'].map((f) => (
                            <button key={f} onClick={() => setFilter(f)}
                                className="btn btn-sm fw-semibold px-3"
                                style={{
                                    borderRadius: '20px',
                                    backgroundColor: filter === f ? '#1C1C1E' : 'white',
                                    color: filter === f ? 'white' : '#666',
                                    border: filter === f ? 'none' : '1px solid #dee2e6',
                                }}>
                                {f.replace('_', ' ').toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {loading && <div className="text-center py-5"><div className="spinner-border" style={{ color: '#F97316' }}></div></div>}

                    <div className="row g-3">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="col-12">
                                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
                                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                                        <div>
                                            <p className="text-muted mb-1" style={{ fontSize: '11px' }}>ID: {order.id}</p>
                                            <p className="mb-1 small"><span className="fw-semibold">📍 From:</span> {order.pickup_address}</p>
                                            <p className="mb-1 small"><span className="fw-semibold">🏁 To:</span> {order.dropoff_address}</p>
                                            <p className="mb-1 small"><span className="fw-semibold">👤 Customer:</span> {order.customer_detail?.full_name}</p>
                                            <p className="mb-0 small"><span className="fw-semibold">🏍️ Rider:</span> {order.rider_detail?.full_name || 'Not assigned'}</p>
                                        </div>
                                        <div className="text-end">
                                            <span className={`badge bg-${statusColors[order.status]} d-block mb-2`}>
                                                {order.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                            {order.is_paid
                                                ? <span className="badge bg-success d-block mb-2">✅ PAID</span>
                                                : <span className="badge bg-danger d-block mb-2">❌ UNPAID</span>
                                            }
                                            <p className="fw-bold mb-0" style={{ color: '#F97316' }}>
                                                ₦{Number(order.price).toLocaleString()}
                                            </p>
                                            <p className="text-muted mb-0" style={{ fontSize: '11px' }}>
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!loading && filteredOrders.length === 0 && (
                        <div className="text-center py-5">
                            <div style={{ fontSize: '4rem' }}>📦</div>
                            <h5 className="fw-bold mt-3">No orders found</h5>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminOrders