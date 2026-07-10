import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊙', path: '/rider/dashboard' },
  { id: 'available', label: 'Available Orders', icon: '📦', path: '/rider/available-orders' },
  { id: 'my-orders', label: 'My Deliveries', icon: '▤', path: '/rider/my-orders' },
]

function RiderSidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const activePath = location.pathname

  return (
    <div className="d-flex flex-column" style={{
      width: '280px',
      minHeight: '100vh',
      backgroundColor: '#F97316',
      padding: '32px 24px',
      flexShrink: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
    }}>
      <div className="mb-5 d-flex align-items-center gap-2">
        <div style={{ position: 'relative', width: '45px', height: '45px', flexShrink: 0 }}>
          <div style={{ width: '45px', height: '45px', background: 'white', borderRadius: '4px' }} />
          <span style={{ position: 'absolute', left: '-15px', top: '12px', width: '25px', height: '4px', background: 'white', borderRadius: '10px', display: 'block' }} />
          <span style={{ position: 'absolute', left: '-15px', top: '20px', width: '18px', height: '4px', background: 'white', borderRadius: '10px', display: 'block' }} />
          <span style={{ position: 'absolute', left: '-15px', top: '28px', width: '12px', height: '4px', background: 'white', borderRadius: '10px', display: 'block' }} />
        </div>
        <div style={{ marginLeft: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: 'white', lineHeight: 1, letterSpacing: '1px' }}>FAMHAK</h3>
          <p style={{ margin: 0, fontSize: '0.7rem', color: 'white', letterSpacing: '1px', opacity: 0.9 }}>rider portal</p>
        </div>
      </div>

      <div className="d-flex flex-column gap-1 flex-grow-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            style={{
              background: activePath === item.path ? 'rgba(255,255,255,0.2)' : 'none',
              border: 'none',
              borderRadius: '10px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              color: 'white',
              fontWeight: activePath === item.path ? 600 : 400,
              fontSize: '15px',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background 0.15s',
            }}
          >
            <span style={{ fontSize: '18px', opacity: 0.9 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="d-flex flex-column gap-1">
        <button
          onClick={() => navigate('/rider/profile')}
          style={{
            background: 'none',
            border: 'none',
            borderRadius: '10px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            color: 'white',
            fontSize: '15px',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <span style={{ fontSize: '18px', opacity: 0.9 }}>⚙</span>
          Settings
        </button>
        <button
          onClick={logout}
          style={{
            background: 'none',
            border: 'none',
            borderRadius: '10px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            color: 'white',
            fontSize: '15px',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <span style={{ fontSize: '18px', opacity: 0.9 }}>⤷</span>
          Log Out
        </button>
      </div>
    </div>
  )
}

export default RiderSidebar
