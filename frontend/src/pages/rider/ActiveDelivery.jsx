import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { orderAPI } from '../../services/api'
import useTracking from '../../hooks/useTracking'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const dropoffIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})

const riderIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})

const statusFlow = {
    assigned: { next: 'picked_up', label: 'Mark as Picked Up', color: '#0d6efd' },
    picked_up: { next: 'in_transit', label: 'Mark as In Transit', color: '#F97316' },
    in_transit: { next: 'delivered', label: 'Mark as Delivered', color: '#198754' },
}

function ActiveDelivery() {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentStatus, setCurrentStatus] = useState(null)
    const [riderPos, setRiderPos] = useState(null)
    const locationInterval = useRef(null)

    const { connected, sendLocation, sendStatusUpdate } = useTracking(orderId)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await orderAPI.getOrderDetail(orderId)
                setOrder(response.data)
                setCurrentStatus(response.data.status)
            } catch (error) {
                console.error('Error fetching order')
            }
            setLoading(false)
        }
        fetchOrder()
    }, [orderId])

    // Start sending location every 5 seconds
    useEffect(() => {
        if (!connected) return

        locationInterval.current = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    setRiderPos({ lat: latitude, lng: longitude })
                    sendLocation(latitude, longitude, user?.full_name)
                },
                (error) => {
                    console.error('Location error:', error)
                }
            )
        }, 5000)

        return () => clearInterval(locationInterval.current)
    }, [connected])

    const handleStatusUpdate = async () => {
        const nextStatus = statusFlow[currentStatus]?.next
        if (!nextStatus) return

        try {
            await orderAPI.updateOrderStatus(orderId, { status: nextStatus })
            sendStatusUpdate(nextStatus)
            setCurrentStatus(nextStatus)
            toast.success(`Order marked as ${nextStatus.replace('_', ' ')}!`)

            if (nextStatus === 'delivered') {
                clearInterval(locationInterval.current)
                toast.success('Delivery completed! Great job! 🎉')
                setTimeout(() => navigate('/rider/dashboard'), 2000)
            }
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const defaultCenter = order?.dropoff_lat
        ? [parseFloat(order.dropoff_lat), parseFloat(order.dropoff_lng)]
        : [6.5244, 3.3792]

    if (loading) return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border"></div>
        </div>
    )

    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar px-4 py-3" style={{ backgroundColor: '#1C1C1E' }}>
                <span className="navbar-brand text-white fw-bold">🚚 Active Delivery</span>
                <div className="d-flex align-items-center gap-2">
                    <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        backgroundColor: connected ? '#198754' : '#dc3545'
                    }}></div>
                    <small className="text-white">{connected ? 'Live' : 'Connecting...'}</small>
                </div>
            </nav>

            <div className="container py-4">
                <div className="row g-4">

                    {/* LEFT — Map */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                            <MapContainer
                                center={riderPos ? [riderPos.lat, riderPos.lng] : defaultCenter}
                                zoom={14}
                                style={{ height: '450px', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='© OpenStreetMap contributors'
                                />

                                {order?.dropoff_lat && (
                                    <Marker
                                        position={[parseFloat(order.dropoff_lat), parseFloat(order.dropoff_lng)]}
                                        icon={dropoffIcon}
                                    >
                                        <Popup>🏁 Dropoff: {order.dropoff_address}</Popup>
                                    </Marker>
                                )}

                                {riderPos && (
                                    <Marker position={[riderPos.lat, riderPos.lng]} icon={riderIcon}>
                                        <Popup>🏍️ You are here</Popup>
                                    </Marker>
                                )}
                            </MapContainer>
                        </div>
                    </div>

                    {/* RIGHT — Controls */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm p-4 mb-3" style={{ borderRadius: '16px' }}>
                            <h6 className="fw-bold mb-3">Delivery Details</h6>
                            <p className="mb-2 small"><span className="fw-semibold">📍 Pickup:</span> {order?.pickup_address}</p>
                            <p className="mb-2 small"><span className="fw-semibold">🏁 Dropoff:</span> {order?.dropoff_address}</p>
                            <p className="mb-2 small"><span className="fw-semibold">👤 Receiver:</span> {order?.receiver_name}</p>
                            <p className="mb-2 small"><span className="fw-semibold">📞 Phone:</span> {order?.receiver_phone}</p>
                            <p className="mb-0 small"><span className="fw-semibold">📦 Package:</span> {order?.package_description}</p>
                        </div>

                        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
                            <h6 className="fw-bold mb-3">Update Status</h6>

                            <div className="p-3 rounded-3 mb-3 text-center" style={{ backgroundColor: '#f8f9fa' }}>
                                <small className="text-muted d-block">Current Status</small>
                                <span className="fw-bold text-capitalize" style={{ color: '#F97316' }}>
                                    {currentStatus?.replace('_', ' ')}
                                </span>
                            </div>

                            {statusFlow[currentStatus] && (
                                <button
                                    className="btn w-100 text-white fw-bold py-3"
                                    style={{
                                        backgroundColor: statusFlow[currentStatus].color,
                                        border: 'none',
                                        borderRadius: '10px'
                                    }}
                                    onClick={handleStatusUpdate}
                                >
                                    {statusFlow[currentStatus].label}
                                </button>
                            )}

                            {currentStatus === 'delivered' && (
                                <div className="alert alert-success text-center mt-3">
                                    ✅ Delivery completed!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActiveDelivery