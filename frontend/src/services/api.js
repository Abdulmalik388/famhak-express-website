import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('refresh_token')
        const { data } = await axios.post('/api/auth/token/refresh/', { refresh })
        localStorage.setItem('access_token', data.access)
        original.headers.Authorization = 'Bearer ' + data.access
        return api(original)
      } catch {
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)


export const orderAPI = {
    createOrder: (data) => api.post('/orders/create/', data),
    getMyOrders: () => api.get('/orders/my-orders/'),
    getAvailableOrders: () => api.get('/orders/available/'),
    getOrderDetail: (id) => api.get(`/orders/${id}/`),
    updateOrderStatus: (id, data) => api.patch(`/orders/${id}/update-status/`, data),
    estimatePrice: (data) => api.post('/orders/estimate-price/', data),

}
export const trackingAPI = {
    getOrderForTracking: (id) => api.get(`/orders/${id}/`),
}

export const createWebSocket = (orderId) => {
    const token = localStorage.getItem('access_token')
    return new WebSocket(`ws://localhost:8000/ws/tracking/${orderId}/`)
}
export const paymentAPI = {
    initialize: (data) => api.post('/payments/initialize/', data),
    verify: (data) => api.post('/payments/verify/', data),
    getHistory: () => api.get('/payments/history/'),
}
export const contactAPI = {
  submit: (data) => api.post('/notifications/contact/', data),
}
export const notificationAPI = {
    getAll: () => api.get('/notifications/'),
    getUnreadCount: () => api.get('/notifications/unread-count/'),
    markRead: (id) => api.patch(`/notifications/mark-read/${id}/`),
    markAllRead: () => api.patch('/notifications/mark-all-read/'),
}
export const authAPI = {
    register: (data) => api.post('/auth/register/', data),
    login: (data) => api.post('/auth/login/', data),
    logout: (data) => api.post('/auth/logout/', data),
    getProfile: () => api.get('/auth/profile/'),
    updateProfile: (data) => api.patch('/auth/profile/update/', data),
    changePassword: (data) => api.post('/auth/change-password/', data),
}
export const reviewAPI = {
    create: (data) => api.post('/orders/reviews/create/', data),
    getRiderReviews: (riderId) => api.get(`/orders/reviews/rider/${riderId}/`),
}

export const adminAPI = {
    getOverview: () => api.get('/analytics/overview/'),
    getAllOrders: () => api.get('/analytics/orders/'),
    updateOrder: (id, data) => api.patch(`/analytics/orders/${id}/update/`, data),
    getAllUsers: (role) => api.get(`/analytics/users/${role ? `?role=${role}` : ''}`),
    deleteUser: (id) => api.delete(`/analytics/users/${id}/delete/`),
    getAllPayments: () => api.get('/analytics/payments/'),
    getAllReviews: () => api.get('/analytics/reviews/'),
    createRider: (data) => api.post('/auth/create-rider/', data),
}
export default api