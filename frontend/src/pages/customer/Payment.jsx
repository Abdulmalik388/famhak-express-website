import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePaystackPayment } from 'react-paystack'
import { paymentAPI, orderAPI } from '../../services/api'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

function Payment() {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
const [order, setOrder] = useState(null)
const [paymentData, setPaymentData] = useState(null)
const [loading, setLoading] = useState(true)
const [initializing, setInitializing] = useState(false)
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
            console.log('Payment init response:', response.data)
            setPaymentData(response.data)
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to initialize payment')
        }
        setInitializing(false)
    }

    console.log('Current user:', user)
   if (paymentSuccess) {
    return (
        <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
            <div
                className="card border-0 shadow-lg p-5 text-center"
                style={{
                    maxWidth: "500px",
                    borderRadius: "20px"
                }}
            >
                <div style={{ fontSize: "70px" }}>✅</div>

                <h2 className="fw-bold mt-3">
                    Payment Successful
                </h2>

                <p className="text-muted">
                    Your payment has been received successfully.
                </p>

                <p className="text-muted">
                    Thank you for choosing Famhak Express.
                </p>

                <button
                    className="btn text-white mt-3"
                    style={{
                        backgroundColor: "#F97316",
                        border: "none"
                    }}
                    onClick={() => navigate("/customer/orders")}
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
        <div className="min-vh-100 bg-light">
            <nav className="navbar px-4 py-3" style={{ backgroundColor: '#F97316' }}>
                <span className="navbar-brand text-white fw-bold">🚚 Famhak Express</span>
                <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/customer/orders')}>
                    ← My Orders
                </button>
            </nav>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
                            <h5 className="fw-bold mb-4 text-center">Complete Payment</h5>

                            <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: '#FFF7ED' }}>
                                <div className="d-flex justify-content-between mb-2">
                                    <small className="text-muted">Pickup</small>
                                    <small className="fw-semibold text-end" style={{ maxWidth: '60%' }}>{order?.pickup_address}</small>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <small className="text-muted">Dropoff</small>
                                    <small className="fw-semibold text-end" style={{ maxWidth: '60%' }}>{order?.dropoff_address}</small>
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
                                <PaystackButton
                                    paymentData={paymentData}
                                    email={user?.email}
                                    navigate={navigate}
                                    onPaymentSuccess={() => setPaymentSuccess(true)}
                                />
                            )}

                            <p className="text-center text-muted small mt-3">
                                🔒 Secured by Paystack
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function PaystackButton({
    paymentData,
    email,
    navigate,
    onPaymentSuccess
}) {
    console.log("Payment Data:", paymentData)
    console.log("Paystack Key:", import.meta.env.VITE_PAYSTACK_PUBLIC_KEY)

    const config = {
        reference: paymentData?.reference,
        email: email || "customer@famhakexpress.com",
        amount: Number(paymentData?.amount),
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    }

    const initPay = usePaystackPayment(config)

    const onSuccess = async (response) => {
        try {
            console.log('Paystack response:', response)
            toast.success("Payment completed successfully 🎉")

            console.log('Calling verify with reference:', response.reference)
            const verifyResponse = await paymentAPI.verify({ reference: response.reference })
            console.log('Verify response:', verifyResponse.data)

            onPaymentSuccess?.()
            window.location.replace("/customer/orders")
        } catch (error) {
            console.error('Payment verification failed:', error)
            toast.error(error.response?.data?.error || 'Payment verification failed')
        }
    }

    const onClose = () => {
        toast("Payment window closed")
    }

    const handleClick = () => {
        if (!config.publicKey) {
            toast.error("Paystack public key is missing")
            return
        }

        if (!config.reference) {
            toast.error("Payment reference is missing")
            return
        }

        if (!config.amount || config.amount <= 0) {
            toast.error("Invalid payment amount")
            return
        }

        try {
            initPay({
                onSuccess,
                onClose,
            })
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <button
            className="btn w-100 text-white fw-bold py-3"
            style={{
                backgroundColor: "#F97316",
                border: "none",
                borderRadius: "10px",
            }}
            onClick={handleClick}
        >
            💳 Pay ₦{Number(paymentData?.amount / 100).toLocaleString()} Now
        </button>
    )
}

export default Payment