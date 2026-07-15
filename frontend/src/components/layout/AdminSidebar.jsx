import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

function AdminSidebar({ mobileOpen = false, isMobile = false, onClose = () => {} }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { logout } = useAuth()

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '⊙', path: '/admin/dashboard' },
        { id: 'orders', label: 'All Orders', icon: '📦', path: '/admin/orders' },
        { id: 'customers', label: 'Customers', icon: '👥', path: '/admin/customers' },
        { id: 'riders', label: 'Riders', icon: '🏍️', path: '/admin/riders' },
        { id: 'payments', label: 'Payments', icon: '💳', path: '/admin/payments' },
        { id: 'reviews', label: 'Reviews', icon: '⭐', path: '/admin/reviews' },
    ]

    return (
        <div className="d-flex flex-column" style={{
            width: '280px', minHeight: '100vh', backgroundColor: '#1C1C1E',
            padding: '32px 24px', flexShrink: 0, position: 'fixed',
            top: 0, left: 0, bottom: 0, zIndex: 1100,
            transform: isMobile ? (mobileOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
            transition: 'transform 0.25s ease-in-out',
        }}>
            {/* Logo */}
            <div className="mb-5 d-flex justify-content-between align-items-center gap-2">
                <div style={{ position: 'relative', width: '45px', height: '45px', flexShrink: 0 }}>
                    <div style={{ width: '45px', height: '45px', background: '#F97316', borderRadius: '4px' }} />
                    <span style={{ position: 'absolute', left: '-15px', top: '12px', width: '25px', height: '4px', background: '#F97316', borderRadius: '10px', display: 'block' }} />
                    <span style={{ position: 'absolute', left: '-15px', top: '20px', width: '18px', height: '4px', background: '#F97316', borderRadius: '10px', display: 'block' }} />
                    <span style={{ position: 'absolute', left: '-15px', top: '28px', width: '12px', height: '4px', background: '#F97316', borderRadius: '10px', display: 'block' }} />
                </div>
                <div style={{ marginLeft: '8px', flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: 'white', lineHeight: 1, letterSpacing: '1px' }}>FAMHAK</h3>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#F97316', letterSpacing: '1px', opacity: 0.9 }}>admin portal</p>
                </div>
                {isMobile && (
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-light d-md-none"
                        onClick={onClose}
                        style={{ minWidth: '40px', padding: '0.5rem 0.75rem' }}
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Nav items */}
            <div className="d-flex flex-column gap-1 flex-grow-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <button key={item.id} onClick={() => { navigate(item.path); onClose() }} style={{
                            background: isActive ? 'rgba(249,115,22,0.15)' : 'none',
                            border: isActive ? '1px solid rgba(249,115,22,0.3)' : '1px solid transparent',
                            borderRadius: '10px', padding: '14px 16px',
                            display: 'flex', alignItems: 'center', gap: '14px',
                            color: isActive ? '#F97316' : 'rgba(255,255,255,0.7)',
                            fontWeight: isActive ? 600 : 400, fontSize: '15px',
                            cursor: 'pointer', textAlign: 'left', width: '100%',
                        }}>
                            <span style={{ fontSize: '18px' }}>{item.icon}</span>
                            {item.label}
                        </button>
                    )
                })}
            </div>

            {/* Bottom */}
            <div className="d-flex flex-column gap-1">
                <button onClick={logout} style={{
                    background: 'none', border: '1px solid transparent', borderRadius: '10px',
                    padding: '14px 16px', display: 'flex', alignItems: 'center',
                    gap: '14px', color: 'rgba(255,255,255,0.7)', fontSize: '15px',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                }}>
                    <span style={{ fontSize: '18px' }}>⤷</span>Log Out
                </button>
            </div>
        </div>
    )
}

export default AdminSidebar