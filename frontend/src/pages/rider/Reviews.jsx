import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import RiderSidebar from '../../components/layout/RiderSidebar'
import { reviewAPI } from '../../services/api'
import useAuth from '../../hooks/useAuth'
import NotificationBell from '../../components/NotificationBell'
import { useNavigate } from 'react-router-dom'

function RiderReviews() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activePage, setActivePage] = useState('reviews')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '⊙', path: '/rider/dashboard' },
        { id: 'available', label: 'Available Orders', icon: '📦', path: '/rider/available-orders' },
        { id: 'my-orders', label: 'My Deliveries', icon: '▤', path: '/rider/my-orders' },
        { id: 'earnings', label: 'My Earnings', icon: '💰', path: '/rider/earnings' },
        { id: 'reviews', label: 'My Reviews', icon: '⭐', path: '/rider/reviews' },
    ]

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await reviewAPI.getRiderReviews(user?.id)
                setData(response.data)
            } catch (error) {
                console.error('Failed to fetch reviews')
            }
            setLoading(false)
        }
        if (user?.id) fetchReviews()
    }, [user])

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
                        <h5 className="fw-bold mb-0">My Reviews</h5>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <span className="fw-semibold" style={{ fontSize: '15px' }}>Hi, {user?.full_name?.split(' ')[0]} 👋</span>
                        <NotificationBell />
                    </div>
                </div>

                <div className="p-4">
                    {loading && <div className="text-center py-5"><div className="spinner-border"></div></div>}

                    {!loading && data && (
                        <>
                            <div className="row g-3 mb-4">
                                <div className="col-md-4">
                                    <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '12px' }}>
                                        <h2 className="fw-bold mb-0" style={{ color: '#F97316' }}>
                                            {data.average_rating}★
                                        </h2>
                                        <small className="text-muted">Average Rating</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '12px' }}>
                                        <h2 className="fw-bold mb-0">{data.total_reviews}</h2>
                                        <small className="text-muted">Total Reviews</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '12px' }}>
                                        <h2 className="fw-bold mb-0" style={{ color: '#198754' }}>
                                            {data.reviews.filter(r => r.rating >= 4).length}
                                        </h2>
                                        <small className="text-muted">Positive Reviews</small>
                                    </div>
                                </div>
                            </div>

                            {data.reviews.length === 0 && (
                                <div className="text-center py-5">
                                    <div style={{ fontSize: '4rem' }}>⭐</div>
                                    <h5 className="fw-bold mt-3">No reviews yet</h5>
                                    <p className="text-muted">Complete deliveries to get your first review!</p>
                                </div>
                            )}

                            <div className="row g-3">
                                {data.reviews.map((review) => (
                                    <div key={review.id} className="col-12">
                                        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
                                            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                                                <div>
                                                    <p className="fw-semibold mb-1">{review.reviewer_name}</p>
                                                    <div className="mb-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <span key={star} style={{ color: star <= review.rating ? '#F97316' : '#dee2e6', fontSize: '18px' }}>★</span>
                                                        ))}
                                                    </div>
                                                    {review.comment && (
                                                        <p className="text-muted small mb-0">"{review.comment}"</p>
                                                    )}
                                                </div>
                                                <small className="text-muted">{new Date(review.created_at).toLocaleDateString()}</small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RiderReviews