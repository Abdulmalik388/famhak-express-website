import { useEffect, useRef, useState } from 'react'
import { createWebSocket } from '../services/api'

const useTracking = (orderId) => {
    const ws = useRef(null)
    const [riderLocation, setRiderLocation] = useState(null)
    const [orderStatus, setOrderStatus] = useState(null)
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        if (!orderId) return

        ws.current = createWebSocket(orderId)

        ws.current.onopen = () => {
            setConnected(true)
        }

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.type === 'location_update') {
                setRiderLocation({
                    lat: data.lat,
                    lng: data.lng,
                    rider_name: data.rider_name,
                })
            }

            if (data.type === 'status_update') {
                setOrderStatus(data.status)
            }
        }

        ws.current.onclose = () => {
            setConnected(false)
        }

        return () => {
            if (ws.current) ws.current.close()
        }
    }, [orderId])

    const sendLocation = (lat, lng, rider_name) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
                type: 'location_update',
                lat,
                lng,
                rider_name,
            }))
        }
    }

    const sendStatusUpdate = (status) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
                type: 'status_update',
                status,
            }))
        }
    }

    return {
        riderLocation,
        orderStatus,
        connected,
        sendLocation,
        sendStatusUpdate,
    }
}

export default useTracking