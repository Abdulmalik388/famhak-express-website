import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { reviewAPI } from '../../services/api'
import useAuth from '../../hooks/useAuth'
import NotificationBell from '../../components/NotificationBell'
import CustomerSidebar from '../../components/layout/CustomerSidebar'
import toast from 'react-hot-toast'

function ReviewOrder() {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [rating, setRating] = useState(0)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [comment, setComment] = useState('')
    const [hoveredStar, setHoveredStar] = useState(0)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (rating === 0) {
            toast.error('Please select a star rating')
            return
        }
        setSubmitting(true)
        try {
            await reviewAPI.create({ order: orderId, rating, comment })
            toast.success('Review submitted! Thank you 🎉')
            navigate('/customer/orders')
        } catch (error) {
            toast.error(error.response?.data?.error || JSON.stringify(error.response?.data) || 'Failed to submit review')
        }
        setSubmitting(false)
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
                        <h5 className="fw-bold mb-0">Rate Your Delivery</h5>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <span className="fw-semibold" style={{ fontSize: '15px' }}>Hi, {user?.full_name?.split(' ')[0]} 👋</span>
                        <NotificationBell />
                    </div>
                </div>

                <div className="p-4">
                    <div className="row justify-content-center">
                        <div className="col-lg-5">
                            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
                                <div className="text-center mb-4">
                                    <div style={{ fontSize: '4rem' }}>🏍️</div>
                                    <h5 className="fw-bold mt-2">How was your delivery?</h5>
                                    <p className="text-muted small">Your feedback helps us improve our service</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    {/* Star rating */}
                                    <div className="text-center mb-4">
                                        <p className="fw-semibold mb-2">Tap to rate</p>
                                        <div className="d-flex justify-content-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHoveredStar(star)}
                                                    onMouseLeave={() => setHoveredStar(0)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        fontSize: '2.5rem',
                                                        cursor: 'pointer',
                                                        color: star <= (hoveredStar || rating) ? '#F97316' : '#dee2e6',
                                                        transition: 'color 0.1s',
                                                        padding: '0 4px',
                                                    }}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                        {rating > 0 && (
                                            <p className="mt-2 fw-semibold" style={{ color: '#F97316' }}>
                                                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][rating]}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold small">Comment (optional)</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Tell us about your experience..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn w-100 text-white fw-bold py-3"
                                        style={{ backgroundColor: '#F97316', border: 'none', borderRadius: '10px' }}
                                        disabled={submitting || rating === 0}
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Review'}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn w-100 fw-semibold py-2 mt-2"
                                        style={{ border: '1px solid #dee2e6', borderRadius: '10px' }}
                                        onClick={() => navigate('/customer/orders')}
                                    >
                                        Skip for now
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

export default ReviewOrder