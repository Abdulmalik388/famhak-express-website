import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import useAuth from '../../hooks/useAuth'
import AdminSidebar from '../../components/layout/AdminSidebar'
import NotificationBell from '../../components/NotificationBell'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

function AdminDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [overview, setOverview] = useState({
        total_orders: 0,
        total_revenue: 0,
        total_customers: 0,
        total_riders: 0,
        pending_orders: 0,
        delivered_orders: 0,
        active_orders: 0,
        last_7_days: [],
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    const fetchOverview = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await adminAPI.getOverview()
            setOverview(response.data)
        } catch (error) {
            console.error('Error fetching overview', error)
            setError('Unable to load dashboard metrics at the moment.')
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchOverview()
    }, [])

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const stats = overview ? [
        { label: 'Total Orders', value: overview.total_orders, icon: '📦', color: '#F97316' },
        { label: 'Total Revenue', value: `₦${Number(overview.total_revenue).toLocaleString()}`, icon: '💰', color: '#198754' },
        { label: 'Customers', value: overview.total_customers, icon: '👥', color: '#0d6efd' },
        { label: 'Riders', value: overview.total_riders, icon: '🏍️', color: '#6f42c1' },
        { label: 'Pending', value: overview.pending_orders, icon: '⏳', color: '#ffc107' },
        { label: 'Active', value: overview.active_orders, icon: '🔄', color: '#0dcaf0' },
        { label: 'Delivered', value: overview.delivered_orders, icon: '✅', color: '#198754' },
    ] : []

    if (loading) return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border" style={{ color: '#F97316' }}></div>
        </div>
    )

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
                        <h5 className="fw-bold mb-0">Admin Dashboard</h5>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <span className="fw-semibold" style={{ fontSize: '15px' }}>Hi, {user?.full_name?.split(' ')[0]} 👋</span>
                        <NotificationBell />
                    </div>
                </div>

                <div className="p-4">
                    {/* Stats grid */}
                    <div className="row g-3 mb-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="col-md-3 col-sm-6">
                                <div className="card border-0 shadow-sm p-3 h-100" style={{ borderRadius: '12px' }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <p className="text-muted mb-1 small">{stat.label}</p>
                                            <h4 className="fw-bold mb-0">{stat.value}</h4>
                                        </div>
                                        <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="row g-4 mb-4">
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
                                <h6 className="fw-bold mb-3">Revenue — Last 7 Days</h6>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={overview?.last_7_days || []}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Revenue']} />
                                        <Line type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2} dot={{ fill: '#F97316', r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
                                <h6 className="fw-bold mb-3">Orders — Last 7 Days</h6>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={overview?.last_7_days || []}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Bar dataKey="orders" fill="#1C1C1E" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Quick actions */}
                    {error && (
                        <div className="alert alert-warning d-flex justify-content-between align-items-center" role="alert">
                            <div>{error}</div>
                            <button className="btn btn-sm btn-outline-dark" onClick={fetchOverview}>
                                Retry
                            </button>
                        </div>
                    )}
                    <div className="row g-3">
                        {[
                            { label: 'Manage Orders', icon: '📦', path: '/admin/orders' },
                            { label: 'Manage Customers', icon: '👥', path: '/admin/customers' },
                            { label: 'Manage Riders', icon: '🏍️', path: '/admin/riders' },
                            { label: 'View Payments', icon: '💳', path: '/admin/payments' },
                        ].map((action) => (
                            <div key={action.label} className="col-md-3">
                                <button
                                    className="btn w-100 fw-semibold py-3"
                                    style={{ backgroundColor: 'white', border: '1px solid #dee2e6', borderRadius: '12px' }}
                                    onClick={() => navigate(action.path)}
                                >
                                    <div style={{ fontSize: '1.5rem' }}>{action.icon}</div>
                                    <div className="small mt-1">{action.label}</div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard