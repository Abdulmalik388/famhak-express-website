import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { paymentAPI, orderAPI } from '../../services/api'
import { useSelector } from 'react-redux'
import useAuth from '../../hooks/useAuth'
import NotificationBell from '../../components/NotificationBell'
import CustomerSidebar from '../../components/layout/CustomerSidebar'
import toast from 'react-hot-toast'

function Payment() {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const { logout } = useAuth()
    const [order, setOrder] = useState(null)
    const [paymentData, setPaymentData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [initializing, setInitializing] = useState(false)
    const [verifying, setVerifying] = useState(false)
    const [paymentSuccess, setPaymentSuccess] = useState(false)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await orderAPI.getOrderDetail(orderId)
                setOrder(response.data)
            } catch (error) {
                toast.error('Order not found')
                navigate('/customer/orders')
            }
            setLoading(false)
        }
        fetchOrder()
    }, [orderId])

    const initializePayment = async () => {
        setInitializing(true)
        try {
            const response = await paymentAPI.initialize({ order_id: orderId })
            setPaymentData(response.data)
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to initialize payment')
        }
        setInitializing(false)
    }

    const payNow = () => {
        if (!window.PaystackPop) {
            toast.error('Payment system still loading, please try again')
            return
        }

        const handler = window.PaystackPop.setup({
            key: paymentData.public_key,
            email: user?.email,
            amount: paymentData.amount,
            ref: paymentData.reference,
            callback: function (response) {
                verifyPayment(response.reference)
            },
            onClose: function () {
                toast('Payment window closed')
            },
        })

        handler.openIframe()
    }

    const verifyPayment = async (reference) => {
        setVerifying(true)
        try {
            await paymentAPI.verify({ reference })
            setPaymentSuccess(true)
        } catch (error) {
            toast.error(error.response?.data?.error || 'Payment verification failed')
        }
        setVerifying(false)
    }

    if (paymentSuccess) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="card border-0 shadow-lg p-5 text-center" style={{ maxWidth: '500px', borderRadius: '20px' }}>
                    <div style={{ fontSize: '70px' }}>✅</div>
                    <h2 className="fw-bold mt-3">Payment Successful</h2>
                    <p className="text-muted">Your payment has been received successfully.</p>
                    <p className="text-muted">Thank you for choosing Famhak Express.</p>
                    <button
                        className="btn text-white mt-3"
                        style={{ backgroundColor: '#F97316', border: 'none' }}
                        onClick={() => navigate('/customer/orders')}
                    >
                        View My Orders
                    </button>
                </div>
            </div>
        )
    }

    if (loading) return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border" style={{ color: '#F97316' }}></div>
        </div>
    )

    return (
        <div className="min-vh-100 d-flex" style={{ backgroundColor: '#f8f9fa' }}>

            <CustomerSidebar />

            {/* MAIN CONTENT */}
            <div style={{ marginLeft: '280px', flex: 1 }}>

                {/* Top bar */}
                <div
                    className="d-flex justify-content-between align-items-center px-4 py-3"
                    style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: 'white' }}
                >
                    <h5 className="fw-bold mb-0">Complete Payment</h5>
                    <div className="d-flex align-items-center gap-3">
                        <span className="fw-semibold" style={{ fontSize: '15px' }}>
                            Hi, {user?.full_name?.split(' ')[0]} 👋
                        </span>
                        <NotificationBell />
                    </div>
                </div>

                <div className="p-4">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
                                <h5 className="fw-bold mb-4 text-center">Order Summary</h5>

                                <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: '#FFF7ED' }}>
                                    <div className="d-flex justify-content-between mb-2">
                                        <small className="text-muted">Pickup</small>
                                        <small className="fw-semibold text-end" style={{ maxWidth: '60%' }}>{order?.pickup_address}</small>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <small className="text-muted">Dropoff</small>
                                        <small className="fw-semibold text-end" style={{ maxWidth: '60%' }}>{order?.dropoff_address}</small>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <small className="text-muted">Package</small>
                                        <small className="fw-semibold">{order?.package_description}</small>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <small className="text-muted">Distance</small>
                                        <small className="fw-semibold">{order?.distance_km} km</small>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <span className="fw-bold">Total</span>
                                        <span className="fw-bold fs-5" style={{ color: '#F97316' }}>
                                            ₦{Number(order?.price).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {!paymentData ? (
                                    <button
                                        className="btn w-100 text-white fw-bold py-3"
                                        style={{ backgroundColor: '#1C1C1E', border: 'none', borderRadius: '10px' }}
                                        onClick={initializePayment}
                                        disabled={initializing}
                                    >
                                        {initializing ? 'Initializing...' : 'Proceed to Payment →'}
                                    </button>
                                ) : (
                                    <button
                                        className="btn w-100 text-white fw-bold py-3"
                                        style={{ backgroundColor: '#F97316', border: 'none', borderRadius: '10px' }}
                                        onClick={payNow}
                                        disabled={verifying}
                                    >
                                        {verifying ? 'Verifying...' : `💳 Pay ₦${Number(order?.price).toLocaleString()} Now`}
                                    </button>
                                )}

                                <p className="text-center text-muted small mt-3">
                                    🔒 Secured by Paystack
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment