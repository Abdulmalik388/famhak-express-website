import { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'
import useAuth from '../../hooks/useAuth'
import AdminSidebar from '../../components/layout/AdminSidebar'
import NotificationBell from '../../components/NotificationBell'
import toast from 'react-hot-toast'

function AdminCustomers() {
    const { user } = useAuth()
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await adminAPI.getAllUsers('customer')
                setCustomers(response.data)
            } catch (error) {
                toast.error('Failed to fetch customers')
            }
            setLoading(false)
        }
        fetchCustomers()
    }, [])

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleDelete = async (userId, name) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return
        try {
            await adminAPI.deleteUser(userId)
            toast.success('Customer deleted')
            setCustomers(customers.filter(c => c.id !== userId))
        } catch (error) {
            toast.error('Failed to delete customer')
        }
    }

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
                        <h5 className="fw-bold mb-0">Customers</h5>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <span className="fw-semibold" style={{ fontSize: '15px' }}>Hi, {user?.full_name?.split(' ')[0]} 👋</span>
                        <NotificationBell />
                    </div>
                </div>

                <div className="p-4">
                    <p className="text-muted mb-4">{customers.length} customers registered</p>

                    {loading && <div className="text-center py-5"><div className="spinner-border" style={{ color: '#F97316' }}></div></div>}

                    <div className="row g-3">
                        {customers.map((customer) => (
                            <div key={customer.id} className="col-12">
                                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                        <div className="d-flex align-items-center gap-3">
                                            <div style={{
                                                width: '48px', height: '48px', borderRadius: '50%',
                                                backgroundColor: '#F97316', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                color: 'white', fontWeight: 700, fontSize: '18px', flexShrink: 0,
                                            }}>
                                                {customer.full_name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="fw-bold mb-0">{customer.full_name}</p>
                                                <p className="text-muted small mb-0">{customer.email}</p>
                                                <p className="text-muted small mb-0">{customer.phone || 'No phone'}</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="badge" style={{ backgroundColor: '#FFF7ED', color: '#F97316' }}>Customer</span>
                                            <span className="text-muted small">{new Date(customer.created_at).toLocaleDateString()}</span>
                                            <button
                                                className="btn btn-sm btn-outline-danger fw-semibold"
                                                style={{ borderRadius: '8px' }}
                                                onClick={() => handleDelete(customer.id, customer.full_name)}
                                            >
                                                Delete
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

export default AdminCustomers