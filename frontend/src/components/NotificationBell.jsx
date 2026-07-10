import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    fetchNotifications,
    fetchUnreadCount,
    markNotificationRead,
    markAllNotificationsRead,
} from '../store/slices/notificationSlice'

function NotificationBell() {
    const dispatch = useDispatch()
    const { notifications, unreadCount } = useSelector((state) => state.notifications)
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        dispatch(fetchUnreadCount())
        const interval = setInterval(() => {
            dispatch(fetchUnreadCount())
        }, 30000)
        return () => clearInterval(interval)
    }, [dispatch])

    useEffect(() => {
        if (open) dispatch(fetchNotifications())
    }, [open, dispatch])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleMarkRead = (id) => {
        dispatch(markNotificationRead(id))
    }

    const handleMarkAllRead = () => {
        dispatch(markAllNotificationsRead())
    }

    const typeIcon = (type) => {
        const icons = {
            order_placed: '📦',
            order_assigned: '🏍️',
            order_picked_up: '✅',
            order_in_transit: '🚚',
            order_delivered: '🎉',
            order_cancelled: '❌',
            payment_success: '💳',
            general: '🔔',
        }
        return icons[type] || '🔔'
    }

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '4px',
                }}
            >
                <span style={{ fontSize: '22px' }}>🔔</span>
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        background: '#dc3545',
                        color: 'white',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '36px',
                    width: '320px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>
                            Notifications {unreadCount > 0 && `(${unreadCount})`}
                        </span>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#F97316',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                }}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div style={{ padding: '24px', textAlign: 'center', color: '#aaa', fontSize: '13px' }}>
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => !notif.is_read && handleMarkRead(notif.id)}
                                    style={{
                                        padding: '12px 16px',
                                        borderBottom: '1px solid #f8f8f8',
                                        backgroundColor: notif.is_read ? 'white' : '#FFF7ED',
                                        cursor: notif.is_read ? 'default' : 'pointer',
                                        display: 'flex',
                                        gap: '10px',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <span style={{ fontSize: '18px', flexShrink: 0 }}>
                                        {typeIcon(notif.notification_type)}
                                    </span>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '13px', fontWeight: notif.is_read ? 400 : 600 }}>
                                            {notif.title}
                                        </p>
                                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#888' }}>
                                            {new Date(notif.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    {!notif.is_read && (
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: '#F97316',
                                            flexShrink: 0,
                                            marginTop: '4px',
                                            marginLeft: 'auto',
                                        }} />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default NotificationBell