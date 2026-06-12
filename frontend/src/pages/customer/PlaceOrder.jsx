import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../../store/slices/orderSlice'
import { orderAPI } from '../../services/api'
import toast from 'react-hot-toast'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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

function MapClickHandler({ onPickup, onDropoff, selectingFor }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      if (selectingFor === 'pickup') {
        onPickup({ lat, lng })
      } else {
        onDropoff({ lat, lng })
      }
    },
  })
  return null
}

function PlaceOrder() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.orders)

  const [selectingFor, setSelectingFor] = useState('pickup')
  const [pickupLocation, setPickupLocation] = useState(null)
  const [dropoffLocation, setDropoffLocation] = useState(null)
  const [priceEstimate, setPriceEstimate] = useState(null)
  const [estimating, setEstimating] = useState(false)

  const [formData, setFormData] = useState({
    pickup_address: '',
    dropoff_address: '',
    package_description: '',
    package_size: 'small',
    receiver_name: '',
    receiver_phone: '',
  })

  // Lagos center coordinates
  const defaultCenter = [6.5244, 3.3792]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Get price estimate whenever both locations are selected or package size changes
  useEffect(() => {
    if (pickupLocation && dropoffLocation) {
      getEstimate()
    }
  }, [pickupLocation, dropoffLocation, formData.package_size])

  const getEstimate = async () => {
    setEstimating(true)
    try {
      const response = await orderAPI.estimatePrice({
        pickup_lat: pickupLocation.lat,
        pickup_lng: pickupLocation.lng,
        dropoff_lat: dropoffLocation.lat,
        dropoff_lng: dropoffLocation.lng,
        package_size: formData.package_size,
      })
      setPriceEstimate(response.data)
    } catch (error) {
      console.error('Error estimating price')
    }
    setEstimating(false)
  }

const handleSubmit = async (e) => {
    e.preventDefault()

    if (!pickupLocation || !dropoffLocation) {
      toast.error('Please select both pickup and dropoff locations on the map')
      return
    }

 const orderData = {
  ...formData,
  pickup_lat: parseFloat(pickupLocation.lat),
  pickup_lng: parseFloat(pickupLocation.lng),
  dropoff_lat: parseFloat(dropoffLocation.lat),
  dropoff_lng: parseFloat(dropoffLocation.lng),
}

    console.log('Order data being sent:', orderData)

    const result = await dispatch(createOrder(orderData))
    if (createOrder.fulfilled.match(result)) {
      toast.success('Order placed successfully!')
      navigate('/customer/orders')
    } else {
      console.log('Error:', result.payload)
      toast.error('Failed to place order. Please try again.')
    }
  } 
  
  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar px-4 py-3" style={{ backgroundColor: '#F97316' }}>
        <span className="navbar-brand text-white fw-bold">🚚 Famhak Express</span>
        <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/customer/dashboard')}>
          ← Back to Dashboard
        </button>
      </nav>

      <div className="container py-4">
        <div className="row g-4">

          {/* LEFT — Map */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="p-3 border-bottom">
                <h6 className="fw-bold mb-2">📍 Select Locations on Map</h6>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm px-3 fw-semibold ${selectingFor === 'pickup' ? 'text-white' : 'btn-outline-secondary'}`}
                    style={selectingFor === 'pickup' ? { backgroundColor: '#198754', border: 'none' } : {}}
                    onClick={() => setSelectingFor('pickup')}
                  >
                    {pickupLocation ? '✅' : '📍'} Set Pickup
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm px-3 fw-semibold ${selectingFor === 'dropoff' ? 'text-white' : 'btn-outline-secondary'}`}
                    style={selectingFor === 'dropoff' ? { backgroundColor: '#dc3545', border: 'none' } : {}}
                    onClick={() => setSelectingFor('dropoff')}
                  >
                    {dropoffLocation ? '✅' : '🏁'} Set Dropoff
                  </button>
                </div>
                <small className="text-muted mt-2 d-block">
                  {selectingFor === 'pickup' ? '🟢 Click on the map to set pickup location' : '🔴 Click on the map to set dropoff location'}
                </small>
              </div>

              <MapContainer
                center={defaultCenter}
                zoom={12}
                style={{ height: '420px', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© OpenStreetMap contributors'
                />
                <MapClickHandler
                  onPickup={setPickupLocation}
                  onDropoff={setDropoffLocation}
                  selectingFor={selectingFor}
                />
                {pickupLocation && (
                  <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon} />
                )}
                {dropoffLocation && (
                  <Marker position={[dropoffLocation.lat, dropoffLocation.lng]} icon={dropoffIcon} />
                )}
              </MapContainer>

              {/* Price estimate box */}
              {priceEstimate && (
                <div className="p-3" style={{ backgroundColor: '#FFF7ED' }}>
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                      <small className="text-muted d-block">Estimated Distance</small>
                      <span className="fw-bold">{priceEstimate.breakdown.distance}</span>
                    </div>
                    <div>
                      <small className="text-muted d-block">Base Fare</small>
                      <span className="fw-bold">₦{priceEstimate.breakdown.base_fare.toLocaleString()}</span>
                    </div>
                    <div>
                      <small className="text-muted d-block">Estimated Price</small>
                      <span className="fw-bold fs-5" style={{ color: '#F97316' }}>
                        ₦{Number(priceEstimate.price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {estimating && (
                <div className="p-3 text-center">
                  <div className="spinner-border spinner-border-sm me-2" style={{ color: '#F97316' }}></div>
                  <small className="text-muted">Calculating price...</small>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
              <h5 className="fw-bold mb-4">Order Details</h5>

              <form onSubmit={handleSubmit}>
                <h6 className="fw-semibold mb-2" style={{ color: '#F97316' }}>📍 Addresses</h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Pickup Address</label>
                  <input
                    type="text"
                    name="pickup_address"
                    className="form-control"
                    placeholder="Describe pickup location"
                    value={formData.pickup_address}
                    onChange={handleChange}
                    required
                  />
                  {pickupLocation && (
                    <small className="text-success">
                      ✅ Pin set: {pickupLocation.lat.toFixed(4)}, {pickupLocation.lng.toFixed(4)}
                    </small>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Dropoff Address</label>
                  <input
                    type="text"
                    name="dropoff_address"
                    className="form-control"
                    placeholder="Describe dropoff location"
                    value={formData.dropoff_address}
                    onChange={handleChange}
                    required
                  />
                  {dropoffLocation && (
                    <small className="text-success">
                      ✅ Pin set: {dropoffLocation.lat.toFixed(4)}, {dropoffLocation.lng.toFixed(4)}
                    </small>
                  )}
                </div>

                <hr />
                <h6 className="fw-semibold mb-2" style={{ color: '#F97316' }}>📦 Package</h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Package Description</label>
                  <textarea
                    name="package_description"
                    className="form-control"
                    rows="2"
                    placeholder="What are you sending?"
                    value={formData.package_description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Package Size</label>
                  <select name="package_size" className="form-select" value={formData.package_size} onChange={handleChange}>
                    <option value="small">Small — Documents, phones (₦150/km)</option>
                    <option value="medium">Medium — Shoes, clothes (₦200/km)</option>
                    <option value="large">Large — Electronics (₦300/km)</option>
                  </select>
                </div>

                <hr />
                <h6 className="fw-semibold mb-2" style={{ color: '#F97316' }}>👤 Receiver</h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Receiver Name</label>
                  <input
                    type="text"
                    name="receiver_name"
                    className="form-control"
                    placeholder="Who is receiving?"
                    value={formData.receiver_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">Receiver Phone</label>
                  <input
                    type="text"
                    name="receiver_phone"
                    className="form-control"
                    placeholder="Receiver phone number"
                    value={formData.receiver_phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn w-100 text-white fw-bold py-3"
                  style={{ backgroundColor: '#F97316', border: 'none', borderRadius: '10px' }}
                  disabled={loading || !pickupLocation || !dropoffLocation}
                >
                  {loading ? 'Placing Order...' : priceEstimate ? `Place Order — ₦${Number(priceEstimate.price).toLocaleString()}` : 'Select locations on map first'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PlaceOrder