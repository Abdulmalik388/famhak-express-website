import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import useAuth from '../../hooks/useAuth'
import NotificationBell from '../../components/NotificationBell'
import RiderSidebar from '../../components/layout/RiderSidebar'
import { authAPI } from '../../services/api'
import { setCredentials } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

function RiderSettings() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const [profileData, setProfileData] = useState({ full_name: '', phone: '' })
  const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '', confirm_password: '' })

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (user) setProfileData({ full_name: user.full_name || '', phone: user.phone || '' })
  }, [user])

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await authAPI.updateProfile(profileData)
      dispatch(setCredentials({
        user: response.data,
        access: localStorage.getItem('access_token'),
        refresh: localStorage.getItem('refresh_token'),
      }))
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile')
    }
    setSaving(false)
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Passwords do not match')
      return
    }
    setSaving(true)
    try {
      await authAPI.changePassword({ old_password: passwordData.old_password, new_password: passwordData.new_password })
      toast.success('Password changed successfully!')
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' })
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to change password')
    }
    setSaving(false)
  }

  return (
    <div className="min-vh-100 d-flex" style={{ backgroundColor: '#f8f9fa' }}>

      <RiderSidebar mobileOpen={sidebarOpen} isMobile={isMobile} onClose={() => setSidebarOpen(false)} />
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)', zIndex: 1050 }}
        />
      )}

      {/* MAIN CONTENT */}
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
            <h5 className="fw-bold mb-0">Settings</h5>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="fw-semibold" style={{ fontSize: '15px' }}>Hi, {user?.full_name?.split(' ')[0]} 👋</span>
            <NotificationBell />
          </div>
        </div>

        <div className="p-4">
          <div className="row justify-content-center">
            <div className="col-lg-8">

              {/* Account info card */}
              <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '16px' }}>
                <div className="d-flex align-items-center gap-3">
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    backgroundColor: '#1C1C1E', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', fontWeight: 700, color: 'white', flexShrink: 0,
                  }}>
                    {user?.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">{user?.full_name}</h5>
                    <p className="text-muted mb-0 small">{user?.email}</p>
                    <span className="badge mt-1" style={{ backgroundColor: '#1C1C1E', color: '#F97316' }}>Rider</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="d-flex gap-2 mb-4">
                {['profile', 'password', 'account'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className="btn btn-sm px-4 fw-semibold"
                    style={{
                      borderRadius: '20px',
                      backgroundColor: activeTab === tab ? '#1C1C1E' : 'white',
                      color: activeTab === tab ? 'white' : '#666',
                      border: activeTab === tab ? 'none' : '1px solid #dee2e6',
                    }}>
                    {tab === 'profile' ? '👤 Profile' : tab === 'password' ? '🔒 Password' : 'ℹ️ Account'}
                  </button>
                ))}
              </div>

              {activeTab === 'profile' && (
                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
                  <h6 className="fw-bold mb-4">Update Profile</h6>
                  <form onSubmit={handleProfileSave}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Full Name</label>
                      <input type="text" className="form-control" value={profileData.full_name}
                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Phone Number</label>
                      <input type="text" className="form-control" value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-semibold small">Email Address</label>
                      <input type="email" className="form-control" value={user?.email} disabled style={{ backgroundColor: '#f8f9fa' }} />
                      <small className="text-muted">Email cannot be changed</small>
                    </div>
                    <button type="submit" className="btn text-white fw-semibold px-4"
                      style={{ backgroundColor: '#1C1C1E', border: 'none', borderRadius: '8px' }} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
                  <h6 className="fw-bold mb-4">Change Password</h6>
                  <form onSubmit={handlePasswordSave}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Current Password</label>
                      <input type="password" className="form-control" value={passwordData.old_password}
                        onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">New Password</label>
                      <input type="password" className="form-control" placeholder="Minimum 8 characters"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} required />
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-semibold small">Confirm New Password</label>
                      <input type="password" className="form-control" value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn text-white fw-semibold px-4"
                      style={{ backgroundColor: '#1C1C1E', border: 'none', borderRadius: '8px' }} disabled={saving}>
                      {saving ? 'Changing...' : 'Change Password'}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
                  <h6 className="fw-bold mb-4">Account Information</h6>
                  <div className="row g-3">
                    {[
                      { label: 'Full Name', value: user?.full_name },
                      { label: 'Email', value: user?.email },
                      { label: 'Phone', value: user?.phone || 'Not set' },
                      { label: 'Role', value: 'Rider' },
                      { label: 'Account Status', value: user?.is_verified ? '✅ Verified' : '⏳ Not Verified' },
                      { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A' },
                    ].map((item) => (
                      <div key={item.label} className="col-md-6">
                        <div className="p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                          <small className="text-muted d-block">{item.label}</small>
                          <span className="fw-semibold">{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <hr className="my-4" />
                  <h6 className="fw-bold mb-3 text-danger">Danger Zone</h6>
                  <button className="btn btn-outline-danger fw-semibold"
                    onClick={() => { if (window.confirm('Are you sure you want to logout?')) logout() }}>
                    🚪 Logout from all devices
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RiderSettings