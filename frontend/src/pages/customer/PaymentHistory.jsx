import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { paymentAPI } from '../../services/api'
import useAuth from '../../hooks/useAuth'
import NotificationBell from '../../components/NotificationBell'
import CustomerSidebar from '../../components/layout/CustomerSidebar'

function PaymentHistory() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
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
        <div className="min-vh-100 d-flex" style={{ backgroundColor: '#f8f9fa' }}>

            <CustomerSidebar />

            {/* MAIN CONTENT */}
            <div style={{ marginLeft: '280px', flex: 1 }}>

                {/* Top bar */}
                <div className="d-flex justify-content-between align-items-center px-4 py-3"
                    style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: 'white' }}>
                    <h5 className="fw-bold mb-0">Payment History</h5>
                    <div className="d-flex align-items-center gap-3">
                        <span className="fw-semibold" style={{ fontSize: '15px' }}>Hi, {user?.full_name?.split(' ')[0]} 👋</span>
                        <NotificationBell />
                    </div>
                </div>

                <div className="p-4">
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
        </div>
    )
}

export default PaymentHistory