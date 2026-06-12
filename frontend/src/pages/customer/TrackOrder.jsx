import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { orderAPI } from '../../services/api'
import useTracking from '../../hooks/useTracking'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const riderIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})

const pickupIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})

const dropoffIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})

const statusSteps = ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered']

const statusLabels = {
    pending: 'Waiting for rider',
    assigned: 'Rider assigned',
    picked_up: 'Package picked up',
    in_transit: 'On the way',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
}

function TrackOrder() {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    const { riderLocation, orderStatus, connected } = useTracking(orderId)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await orderAPI.getOrderDetail(orderId)
                setOrder(response.data)
            } catch (error) {
                console.error('Error fetching order')
            }
            setLoading(false)
        }
        fetchOrder()
    }, [orderId])

    const currentStatus = orderStatus || order?.status
    const currentStepIndex = statusSteps.indexOf(currentStatus)

    const defaultCenter = order?.pickup_lat
        ? [parseFloat(order.pickup_lat), parseFloat(order.pickup_lng)]
        : [6.5244, 3.3792]

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

            <div className="container py-4">
                <div className="row g-4">

                    {/* LEFT — Map */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                                <h6 className="fw-bold mb-0">📍 Live Tracking</h6>
                                <div className="d-flex align-items-center gap-2">
                                    <div style={{
                                        width: '8px', height: '8px', borderRadius: '50%',
                                        backgroundColor: connected ? '#198754' : '#dc3545'
                                    }}></div>
                                    <small className="text-muted">{connected ? 'Connected' : 'Connecting...'}</small>
                                </div>
                            </div>

                            <MapContainer
                                center={riderLocation ? [riderLocation.lat, riderLocation.lng] : defaultCenter}
                                zoom={13}
                                style={{ height: '450px', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='© OpenStreetMap contributors'
                                />

                                {/* Pickup marker */}
                                {order?.pickup_lat && (
                                    <Marker
                                        position={[parseFloat(order.pickup_lat), parseFloat(order.pickup_lng)]}
                                        icon={pickupIcon}
                                    >
                                        <Popup>📍 Pickup: {order.pickup_address}</Popup>
                                    </Marker>
                                )}

                                {/* Dropoff marker */}
                                {order?.dropoff_lat && (
                                    <Marker
                                        position={[parseFloat(order.dropoff_lat), parseFloat(order.dropoff_lng)]}
                                        icon={dropoffIcon}
                                    >
                                        <Popup>🏁 Dropoff: {order.dropoff_address}</Popup>
                                    </Marker>
                                )}

                                {/* Rider live location */}
                                {riderLocation && (
                                    <Marker
                                        position={[riderLocation.lat, riderLocation.lng]}
                                        icon={riderIcon}
                                    >
                                        <Popup>🏍️ Rider: {riderLocation.rider_name}</Popup>
                                    </Marker>
                                )}
                            </MapContainer>

                            <div className="p-3" style={{ backgroundColor: '#FFF7ED' }}>
                                <div className="row text-center">
                                    <div className="col">
                                        <small className="text-muted d-block">From</small>
                                        <small className="fw-semibold">{order?.pickup_address}</small>
                                    </div>
                                    <div className="col-1 d-flex align-items-center justify-content-center">
                                        <span>→</span>
                                    </div>
                                    <div className="col">
                                        <small className="text-muted d-block">To</small>
                                        <small className="fw-semibold">{order?.dropoff_address}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT — Order details */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm p-4 mb-3" style={{ borderRadius: '16px' }}>
                            <h6 className="fw-bold mb-3">Order Status</h6>

                            {currentStatus === 'cancelled' ? (
                                <div className="alert alert-danger">Order was cancelled</div>
                            ) : (
                                <div>
                                    {statusSteps.map((step, index) => (
                                        <div key={step} className="d-flex gap-3 mb-3">
                                            <div className="d-flex flex-column align-items-center">
                                                <div style={{
                                                    width: '28px', height: '28px',
                                                    borderRadius: '50%',
                                                    backgroundColor: index <= currentStepIndex ? '#F97316' : '#e9ecef',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0,
                                                }}>
                                                    {index <= currentStepIndex
                                                        ? <span style={{ color: 'white', fontSize: '12px' }}>✓</span>
                                                        : <span style={{ color: '#adb5bd', fontSize: '12px' }}>{index + 1}</span>
                                                    }
                                                </div>
                                                {index < statusSteps.length - 1 && (
                                                    <div style={{
                                                        width: '2px', height: '24px',
                                                        backgroundColor: index < currentStepIndex ? '#F97316' : '#e9ecef'
                                                    }}></div>
                                                )}
                                            </div>
                                            <div className="pt-1">
                                                <small className={`fw-semibold ${index <= currentStepIndex ? '' : 'text-muted'}`}>
                                                    {statusLabels[step]}
                                                </small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
                            <h6 className="fw-bold mb-3">Order Details</h6>
                            <p className="mb-2 small"><span className="fw-semibold">Package:</span> {order?.package_description}</p>
                            <p className="mb-2 small"><span className="fw-semibold">Size:</span> {order?.package_size}</p>
                            <p className="mb-2 small"><span className="fw-semibold">Receiver:</span> {order?.receiver_name}</p>
                            <p className="mb-2 small"><span className="fw-semibold">Phone:</span> {order?.receiver_phone}</p>
                            <p className="mb-2 small"><span className="fw-semibold">Distance:</span> {order?.distance_km} km</p>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-semibold">Total Price</span>
                                <span className="fw-bold fs-5" style={{ color: '#F97316' }}>
                                    ₦{Number(order?.price).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrackOrder