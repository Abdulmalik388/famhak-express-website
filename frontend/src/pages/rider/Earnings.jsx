import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { paymentAPI } from '../../services/api'

function RiderEarnings() {
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const response = await paymentAPI.getRiderEarnings()
                setData(response.data)
            } catch (error) {
                console.error('Error fetching earnings')
            }
            setLoading(false)
        }
        fetchEarnings()
    }, [])

    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar px-4 py-3" style={{ backgroundColor: '#1C1C1E' }}>
                <span className="navbar-brand text-white fw-bold">🚚 Famhak Express — Rider</span>
                <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/rider/dashboard')}>
                    ← Dashboard
                </button>
            </nav>

            <div className="container py-4">
                <h4 className="fw-bold mb-4">My Earnings</h4>

                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border"></div>
                    </div>
                )}

                {!loading && data && (
                    <>
                        <div className="card border-0 shadow-sm p-4 mb-4 text-center" style={{ borderRadius: '16px', backgroundColor: '#1C1C1E' }}>
                            <small className="text-secondary">Total Earnings</small>
                            <h2 className="fw-bold text-white mt-1">
                                ₦{Number(data.total_earnings).toLocaleString()}
                            </h2>
                            <small className="text-secondary">80% of each delivery price</small>
                        </div>

                        {data.earnings.length === 0 && (
                            <div className="text-center py-5">
                                <div style={{ fontSize: '4rem' }}>💰</div>
                                <h5 className="fw-bold mt-3">No earnings yet</h5>
                                <p className="text-muted">Complete deliveries to earn money</p>
                            </div>
                        )}

                        <div className="row g-3">
                            {data.earnings.map((earning) => (
                                <div key={earning.id} className="col-12">
                                    <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="fw-semibold mb-1">Delivery completed</p>
                                                <p className="text-muted small mb-0">{new Date(earning.created_at).toLocaleString()}</p>
                                            </div>
                                            <p className="fw-bold fs-5 mb-0" style={{ color: '#F97316' }}>
                                                ₦{Number(earning.amount).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default RiderEarnings