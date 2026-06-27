import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { paymentAPI } from '../../services/api'

function PaymentHistory() {
    const navigate = useNavigate()
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await paymentAPI.getHistory()
                setPayments(response.data)
            } catch (error) {
                console.error('Error fetching payments')
            }
            setLoading(false)
        }
        fetchPayments()
    }, [])

    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar px-4 py-3" style={{ backgroundColor: '#F97316' }}>
                <span className="navbar-brand text-white fw-bold">🚚 Famhak Express</span>
                <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/customer/dashboard')}>
                    ← Dashboard
                </button>
            </nav>

            <div className="container py-4">
                <h4 className="fw-bold mb-4">Payment History</h4>

                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border" style={{ color: '#F97316' }}></div>
                    </div>
                )}

                {!loading && payments.length === 0 && (
                    <div className="text-center py-5">
                        <div style={{ fontSize: '4rem' }}>💳</div>
                        <h5 className="fw-bold mt-3">No payments yet</h5>
                        <p className="text-muted">Your payment history will appear here</p>
                    </div>
                )}

                <div className="row g-3">
                    {payments.map((payment) => (
                        <div key={payment.id} className="col-12">
                            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                    <div>
                                        <p className="fw-semibold mb-1">Ref: {payment.reference}</p>
                                        <p className="text-muted small mb-0">{new Date(payment.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="text-end">
                                        <span className={`badge d-block mb-2 ${payment.status === 'success' ? 'bg-success' : payment.status === 'failed' ? 'bg-danger' : 'bg-warning'}`}>
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
    )
}

export default PaymentHistory