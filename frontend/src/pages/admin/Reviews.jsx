import { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'
import useAuth from '../../hooks/useAuth'
import AdminSidebar from '../../components/layout/AdminSidebar'
import NotificationBell from '../../components/NotificationBell'

function AdminReviews() {
    const { user } = useAuth()
    const [reviews, setReviews] = useState([])
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
        const fetchReviews = async () => {
            try {
                const response = await adminAPI.getAllReviews()
                setReviews(response.data)
            } catch (error) {
                console.error('Failed to fetch reviews')
            }
            setLoading(false)
        }
        fetchReviews()
    }, [])

    const avgRating = reviews.length
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0

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
                        <h5 className="fw-bold mb-0">Reviews</h5>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <span className="fw-semibold" style={{ fontSize: '15px' }}>Hi, {user?.full_name?.split(' ')[0]} 👋</span>
                        <NotificationBell />
                    </div>
                </div>

                <div className="p-4">
                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '12px' }}>
                                <h2 className="fw-bold mb-0" style={{ color: '#F97316' }}>{avgRating}★</h2>
                                <small className="text-muted">Average Rating</small>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '12px' }}>
                                <h2 className="fw-bold mb-0">{reviews.length}</h2>
                                <small className="text-muted">Total Reviews</small>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '12px' }}>
                                <h2 className="fw-bold mb-0" style={{ color: '#198754' }}>
                                    {reviews.filter(r => r.rating >= 4).length}
                                </h2>
                                <small className="text-muted">Positive Reviews</small>
                            </div>
                        </div>
                    </div>

                    {loading && <div className="text-center py-5"><div className="spinner-border" style={{ color: '#F97316' }}></div></div>}

                    <div className="row g-3">
                        {reviews.map((review) => (
                            <div key={review.id} className="col-12">
                                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
                                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                                        <div>
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <span className="fw-bold">{review.reviewer_name}</span>
                                                <span className="text-muted small">→</span>
                                                <span className="fw-semibold" style={{ color: '#F97316' }}>{review.rider_name}</span>
                                            </div>
                                            <div className="mb-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span key={star} style={{ color: star <= review.rating ? '#F97316' : '#dee2e6', fontSize: '16px' }}>★</span>
                                                ))}
                                            </div>
                                            {review.comment && <p className="text-muted small mb-0">"{review.comment}"</p>}
                                        </div>
                                        <small className="text-muted">{new Date(review.created_at).toLocaleDateString()}</small>
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

export default AdminReviews