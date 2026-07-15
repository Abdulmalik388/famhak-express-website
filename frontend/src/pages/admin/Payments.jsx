import { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'
import useAuth from '../../hooks/useAuth'
import AdminSidebar from '../../components/layout/AdminSidebar'
import NotificationBell from '../../components/NotificationBell'

function AdminPayments() {
    const { user } = useAuth()
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await adminAPI.getAllPayments()
                setPayments(response.data)
            } catch (error) {
                console.error('Failed to fetch payments')
            }
            setLoading(false)
        }
        fetchPayments()
    }, [])

    const totalRevenue = payments
        .filter(p => p.status === 'success')
        .reduce((sum, p) => sum + Number(p.amount), 0)

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
                        <h5 className="fw-bold mb-0">Payments</h5>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <span className="fw-semibold" style={{ fontSize: '15px' }}>Hi, {user?.full_name?.split(' ')[0]} 👋</span>
                        <NotificationBell />
                    </div>
                </div>

                <div className="p-4">
                    <div className="card border-0 shadow-sm p-4 mb-4 text-center" style={{ borderRadius: '16px', backgroundColor: '#1C1C1E' }}>
                        <small className="text-secondary">Total Revenue Collected</small>
                        <h2 className="fw-bold text-white mt-1">₦{totalRevenue.toLocaleString()}</h2>
                        <small className="text-secondary">{payments.filter(p => p.status === 'success').length} successful payments</small>
                    </div>

                    {loading && <div className="text-center py-5"><div className="spinner-border" style={{ color: '#F97316' }}></div></div>}

                    <div className="row g-3">
                        {payments.map((payment) => (
                            <div key={payment.id} className="col-12">
                                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                        <div>
                                            <p className="fw-semibold mb-1">{payment.reference}</p>
                                            <p className="text-muted small mb-0">{new Date(payment.created_at).toLocaleString()}</p>
                                        </div>
                                        <div className="text-end">
                                            <span className={`badge d-block mb-1 ${payment.status === 'success' ? 'bg-success' : payment.status === 'failed' ? 'bg-danger' : 'bg-warning'}`}>
                                                {payment.status.toUpperCase()}
                                            </span>
                                            <p className="fw-bold mb-0" style={{ color: '#F97316' }}>
                                                ₦{Number(payment.amount).toLocaleString()}
                                            </p>
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

export default AdminPayments