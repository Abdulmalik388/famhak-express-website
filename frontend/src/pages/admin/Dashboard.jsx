import useAuth from '../../hooks/useAuth'

function AdminDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar px-4 py-3 text-white" style={{ backgroundColor: '#dc3545' }}>
        <span className="navbar-brand text-white fw-bold">🚚 Famhak Express — Admin</span>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white">Welcome, {user?.full_name}</span>
          <button className="btn btn-light btn-sm fw-semibold" onClick={logout}>Logout</button>
        </div>
      </nav>
      <div className="container mt-5 text-center">
        <h2 className="fw-bold text-danger">Admin Dashboard</h2>
        <p className="text-muted mt-2">Phase 2 complete — you are logged in as admin!</p>
      </div>
    </div>
  )
}

export default AdminDashboard