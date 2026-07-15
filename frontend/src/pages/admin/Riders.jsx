import { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'
import useAuth from '../../hooks/useAuth'
import AdminSidebar from '../../components/layout/AdminSidebar'
import NotificationBell from '../../components/NotificationBell'
import toast from 'react-hot-toast'

function AdminRiders() {
    const { user } = useAuth()
    const [riders, setRiders] = useState([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        password: '',
    })

    useEffect(() => {
        const fetchRiders = async () => {
            try {
                const response = await adminAPI.getAllUsers('rider')
                setRiders(response.data)
            } catch (error) {
                toast.error('Failed to load riders')
            }
            setLoading(false)
        }
        fetchRiders()
    }, [])

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleCreateRider = async (e) => {
        e.preventDefault()
        if (!formData.full_name || !formData.email || !formData.password) {
            toast.error('Please fill in all required fields')
            return
        }

        setCreating(true)
        try {
            const response = await adminAPI.createRider(formData)
            setRiders([response.data.user, ...riders])
            setFormData({ full_name: '', email: '', phone: '', password: '' })
            toast.success('Rider account created successfully')
        } catch (error) {
            console.error('Create rider error:', error.response?.data || error)
            const serverMessage = error.response?.data?.error
                || error.response?.data?.email?.[0]
                || error.response?.data?.full_name?.[0]
                || error.response?.data?.password?.[0]
                || (typeof error.response?.data === 'string' ? error.response.data : null)
            toast.error(serverMessage || 'Failed to create rider')
        }
        setCreating(false)
    }

    const handleDelete = async (riderId, riderName) => {
        if (!window.confirm(`Delete rider ${riderName}?`)) return
        try {
            await adminAPI.deleteUser(riderId)
            setRiders(riders.filter((rider) => rider.id !== riderId))
            toast.success('Rider deleted')
        } catch (error) {
            toast.error('Failed to delete rider')
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
                        <h5 className="fw-bold mb-0">Riders</h5>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <span className="fw-semibold" style={{ fontSize: '15px' }}>Hi, {user?.full_name?.split(' ')[0]} 👋</span>
                        <NotificationBell />
                    </div>
                </div>

                <div className="p-4">
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '16px' }}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="fw-bold mb-1">Available Riders</h6>
                                        <p className="text-muted mb-0">Manage your rider fleet and see which riders are active.</p>
                                    </div>
                                    <div className="text-end">
                                        <span className="badge bg-success">{riders.length} riders</span>
                                    </div>
                                </div>
                            </div>

                            {loading && (
                                <div className="text-center py-5">
                                    <div className="spinner-border" style={{ color: '#F97316' }}></div>
                                </div>
                            )}

                            {!loading && riders.length === 0 && (
                                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
                                    <p className="mb-0 text-muted">No riders registered yet. Use the form to add a new rider.</p>
                                </div>
                            )}

                            <div className="row g-3">
                                {riders.map((rider) => (
                                    <div key={rider.id} className="col-12">
                                        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
                                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div style={{
                                                        width: '48px', height: '48px', borderRadius: '50%',
                                                        backgroundColor: '#F97316', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        color: 'white', fontWeight: 700, fontSize: '18px', flexShrink: 0,
                                                    }}>
                                                        {rider.full_name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="fw-bold mb-1">{rider.full_name}</p>
                                                        <p className="text-muted small mb-0">{rider.email}</p>
                                                        <p className="text-muted small mb-0">{rider.phone || 'No phone provided'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <span className="badge" style={{ backgroundColor: '#FFF7ED', color: '#F97316' }}>Rider</span>
                                                    <p className="text-muted small mb-2">Joined {new Date(rider.created_at).toLocaleDateString()}</p>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger fw-semibold"
                                                        style={{ borderRadius: '8px' }}
                                                        onClick={() => handleDelete(rider.id, rider.full_name)}
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

                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
                                <h6 className="fw-bold mb-3">Add New Rider</h6>
                                <form onSubmit={handleCreateRider}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small">Full Name</label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            className="form-control"
                                            placeholder="Rider full name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            placeholder="rider@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small">Phone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            className="form-control"
                                            placeholder="0801 234 5678"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold small">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control"
                                            placeholder="Minimum 8 characters"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn w-100 text-white fw-bold py-3"
                                        style={{ backgroundColor: '#F97316', border: 'none', borderRadius: '10px' }}
                                        disabled={creating}
                                    >
                                        {creating ? 'Creating Rider…' : 'Create Rider'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminRiders
