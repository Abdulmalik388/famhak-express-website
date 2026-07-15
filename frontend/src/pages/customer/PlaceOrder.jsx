import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../../store/slices/orderSlice'
import { orderAPI } from '../../services/api'
import useAuth from '../../hooks/useAuth'
import NotificationBell from '../../components/NotificationBell'
import CustomerSidebar from '../../components/layout/CustomerSidebar'
import toast from 'react-hot-toast'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41],
})

const dropoffIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41],
})

function MapClickHandler({ onPickup, onDropoff, selectingFor }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      if (selectingFor === 'pickup') onPickup({ lat, lng })
      else onDropoff({ lat, lng })
    },
  })
  return null
}

function PlaceOrder() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { loading } = useSelector((state) => state.orders)
  const [selectingFor, setSelectingFor] = useState('pickup')
  const [pickupLocation, setPickupLocation] = useState(null)
  const [dropoffLocation, setDropoffLocation] = useState(null)
  const [priceEstimate, setPriceEstimate] = useState(null)
  const [estimating, setEstimating] = useState(false)
  const [searching, setSearching] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [pickupSearch, setPickupSearch] = useState('')
  const [dropoffSearch, setDropoffSearch] = useState('')
  const [mapCenter, setMapCenter] = useState([6.5244, 3.3792])
  const [formData, setFormData] = useState({
    pickup_address: '',
    dropoff_address: '',
    package_description: '',
    package_size: 'small',
    receiver_name: '',
    receiver_phone: '',
  })

  const defaultCenter = [6.5244, 3.3792]

  const geocodeLocation = async (query) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`
    )
    const results = await response.json()
    if (!results || results.length === 0) {
      throw new Error('Location not found')
    }
    return {
      lat: parseFloat(results[0].lat),
      lng: parseFloat(results[0].lon),
      display_name: results[0].display_name,
      address: results[0].address || {},
    }
  }

  const getStateFromAddress = (address = {}) => {
    if (!address) return ''
    const state = address.state || address.region || address.county || ''
    return state.toString().toLowerCase()
  }

  const isWithinLagosOgun = (location) => {
    if (!location) return false
    const state = getStateFromAddress(location.address)
    const inState = state.includes('lagos') || state.includes('ogun')
    if (inState) return true

    if (!location.lat || !location.lng) return false
    const lagosBounds = { minLat: 5.0, maxLat: 7.0, minLng: 2.5, maxLng: 4.1 }
    const ogunBounds = { minLat: 6.0, maxLat: 7.8, minLng: 2.5, maxLng: 4.8 }
    const inLagos = location.lat >= lagosBounds.minLat && location.lat <= lagosBounds.maxLat && location.lng >= lagosBounds.minLng && location.lng <= lagosBounds.maxLng
    const inOgun = location.lat >= ogunBounds.minLat && location.lat <= ogunBounds.maxLat && location.lng >= ogunBounds.minLng && location.lng <= ogunBounds.maxLng
    return inLagos || inOgun
  }

  const pickupOutsideServiceArea = pickupLocation && !isWithinLagosOgun(pickupLocation)
  const dropoffOutsideServiceArea = dropoffLocation && !isWithinLagosOgun(dropoffLocation)
  const routeOutsideServiceArea = Boolean(pickupOutsideServiceArea || dropoffOutsideServiceArea)
  const priceTooHigh = priceEstimate && Number(priceEstimate.price) > 12000
  const needsWhatsApp = Boolean(routeOutsideServiceArea || priceTooHigh)
  const whatsappMessage = routeOutsideServiceArea
    ? 'Hello Famhak Express, I need delivery service outside Lagos/Ogun. Please assist.'
    : 'Hello Famhak Express, I need delivery service and the estimated fee is above ₦12,000. Please assist.'
  const whatsappUrl = `https://wa.me/2348177318070?text=${encodeURIComponent(whatsappMessage)}`

  const handleLocationSearch = async (type) => {
    const query = type === 'pickup' ? pickupSearch : dropoffSearch
    if (!query.trim()) {
      toast.error('Please enter a location search term')
      return
    }

    setSearching(true)
    try {
      const location = await geocodeLocation(query)
      const updatedData = {
        lat: location.lat,
        lng: location.lng,
        display_name: location.display_name,
        address: location.address,
      }

      if (type === 'pickup') {
        setPickupLocation(updatedData)
        setFormData((prev) => ({ ...prev, pickup_address: location.display_name }))
      } else {
        setDropoffLocation(updatedData)
        setFormData((prev) => ({ ...prev, dropoff_address: location.display_name }))
      }

      setMapCenter([location.lat, location.lng])
      toast.success('Location found on the map')
    } catch (error) {
      console.error(error)
      toast.error('Unable to find location. Try a different search.')
    }
    setSearching(false)
  }

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function MapCenterSetter({ center }) {
    const map = useMap()
    useEffect(() => {
      if (center) {
        map.setView(center, 12)
      }
    }, [center, map])
    return null
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    if (pickupLocation && dropoffLocation) getEstimate()
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
    if (needsWhatsApp) {
      toast.error('Please contact us via WhatsApp for this delivery.')
      return
    }
    const orderData = {
      ...formData,
      pickup_lat: parseFloat(pickupLocation.lat),
      pickup_lng: parseFloat(pickupLocation.lng),
      dropoff_lat: parseFloat(dropoffLocation.lat),
      dropoff_lng: parseFloat(dropoffLocation.lng),
    }
    const result = await dispatch(createOrder(orderData))
    if (createOrder.fulfilled.match(result)) {
      toast.success('Order placed successfully!')
      navigate('/customer/orders')
    } else {
      toast.error('Failed to place order. Please try again.')
    }
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

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: isMobile ? 0 : '280px', flex: 1 }}>

        {/* Top bar */}
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
            <h5 className="fw-bold mb-0">Place New Order</h5>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="fw-semibold" style={{ fontSize: '15px' }}>Hi, {user?.full_name?.split(' ')[0]} 👋</span>
            <NotificationBell />
          </div>
        </div>

        <div className="p-4">
          <div className="row g-4">

            {/* LEFT — Map */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                <div className="p-3 border-bottom">
                  <h6 className="fw-bold mb-2">📍 Select Locations on Map</h6>

                  <div className="row g-2 mb-3">
                    <div className="col-12 col-md-6">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search pickup location"
                          value={pickupSearch}
                          onChange={(e) => setPickupSearch(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={() => handleLocationSearch('pickup')}
                          disabled={searching}
                        >
                          {searching ? 'Searching…' : 'Search'}
                        </button>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search dropoff location"
                          value={dropoffSearch}
                          onChange={(e) => setDropoffSearch(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleLocationSearch('dropoff')}
                          disabled={searching}
                        >
                          {searching ? 'Searching…' : 'Search'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2 mb-2">
                    <button type="button"
                      className={`btn btn-sm px-3 fw-semibold ${selectingFor === 'pickup' ? 'text-white' : 'btn-outline-secondary'}`}
                      style={selectingFor === 'pickup' ? { backgroundColor: '#198754', border: 'none' } : {}}
                      onClick={() => setSelectingFor('pickup')}>
                      {pickupLocation ? '✅' : '📍'} Set Pickup
                    </button>
                    <button type="button"
                      className={`btn btn-sm px-3 fw-semibold ${selectingFor === 'dropoff' ? 'text-white' : 'btn-outline-secondary'}`}
                      style={selectingFor === 'dropoff' ? { backgroundColor: '#dc3545', border: 'none' } : {}}
                      onClick={() => setSelectingFor('dropoff')}>
                      {dropoffLocation ? '✅' : '🏁'} Set Dropoff
                    </button>
                  </div>
                  <small className="text-muted mt-2 d-block">
                    {selectingFor === 'pickup' ? '🟢 Click on the map to set pickup location or search above' : '🔴 Click on the map to set dropoff location or search above'}
                  </small>
                </div>

                <MapContainer center={mapCenter} zoom={12} style={{ height: '420px', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© OpenStreetMap contributors'
                  />
                  <MapCenterSetter center={mapCenter} />
                  <MapClickHandler onPickup={setPickupLocation} onDropoff={setDropoffLocation} selectingFor={selectingFor} />
                  {pickupLocation && <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon} />}
                  {dropoffLocation && <Marker position={[dropoffLocation.lat, dropoffLocation.lng]} icon={dropoffIcon} />}
                </MapContainer>

                        {needsWhatsApp && (
                  <div className="p-3 mt-3 rounded-3" style={{ backgroundColor: '#fff4e5', border: '1px solid #ffd8a8' }}>
                    <p className="mb-2 fw-semibold" style={{ color: '#b45309' }}>
                      {routeOutsideServiceArea
                        ? 'Delivery outside Lagos/Ogun service area.'
                        : 'Estimated delivery fee exceeds ₦12,000.'}
                    </p>
                    {routeOutsideServiceArea && (
                      <p className="mb-2 text-muted small">
                        {pickupOutsideServiceArea && 'Pickup location is outside Lagos/Ogun.'}
                        {dropoffOutsideServiceArea && pickupOutsideServiceArea ? ' ' : ''}
                        {dropoffOutsideServiceArea && 'Dropoff location is outside Lagos/Ogun.'}
                      </p>
                    )}
                    <p className="mb-3 text-muted small">
                      {routeOutsideServiceArea
                        ? 'Please contact our team on WhatsApp for deliveries outside Lagos and Ogun.'
                        : 'Please contact our team on WhatsApp for high-fee deliveries above ₦12,000.'}
                    </p>
                    <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-success btn-sm">
                      Contact via WhatsApp
                    </a>
                  </div>
                )}

                {priceEstimate && !needsWhatsApp && (
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
                    <input type="text" name="pickup_address" className="form-control"
                      placeholder="Describe pickup location" value={formData.pickup_address}
                      onChange={handleChange} required />
                    {pickupLocation && <small className="text-success">✅ Pin set: {pickupLocation.lat.toFixed(4)}, {pickupLocation.lng.toFixed(4)}</small>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Dropoff Address</label>
                    <input type="text" name="dropoff_address" className="form-control"
                      placeholder="Describe dropoff location" value={formData.dropoff_address}
                      onChange={handleChange} required />
                    {dropoffLocation && <small className="text-success">✅ Pin set: {dropoffLocation.lat.toFixed(4)}, {dropoffLocation.lng.toFixed(4)}</small>}
                  </div>

                  <hr />
                  <h6 className="fw-semibold mb-2" style={{ color: '#F97316' }}>📦 Package</h6>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Package Description</label>
                    <textarea name="package_description" className="form-control" rows="2"
                      placeholder="What are you sending?" value={formData.package_description}
                      onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Package Size</label>
                    <select name="package_size" className="form-select" value={formData.package_size} onChange={handleChange}>
                      <option value="small">Small — Documents, phones (₦300/km)</option>
                      <option value="medium">Medium — Shoes, clothes (₦400/km)</option>
                      <option value="large">Large — Electronics (₦600/km)</option>
                    </select>
                  </div>

                  <hr />
                  <h6 className="fw-semibold mb-2" style={{ color: '#F97316' }}>👤 Receiver</h6>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Receiver Name</label>
                    <input type="text" name="receiver_name" className="form-control"
                      placeholder="Who is receiving?" value={formData.receiver_name}
                      onChange={handleChange} required />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold small">Receiver Phone</label>
                    <input type="text" name="receiver_phone" className="form-control"
                      placeholder="Receiver phone number" value={formData.receiver_phone}
                      onChange={handleChange} required />
                  </div>

                  <button type="submit" className="btn w-100 text-white fw-bold py-3"
                    style={{ backgroundColor: '#F97316', border: 'none', borderRadius: '10px' }}
                    disabled={loading || !pickupLocation || !dropoffLocation || needsWhatsApp}>
                    {loading ? 'Placing Order...' : needsWhatsApp ? 'Contact via WhatsApp' : priceEstimate ? `Place Order — ₦${Number(priceEstimate.price).toLocaleString()}` : 'Select locations on map first'}
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

export default PlaceOrder