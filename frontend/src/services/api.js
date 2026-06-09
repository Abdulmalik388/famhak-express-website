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

export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: (data) => api.post('/auth/logout/', data),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/update/', data),
}
export const orderAPI = {
    createOrder: (data) => api.post('/orders/create/', data),
    getMyOrders: () => api.get('/orders/my-orders/'),
    getAvailableOrders: () => api.get('/orders/available/'),
    getOrderDetail: (id) => api.get(`/orders/${id}/`),
    updateOrderStatus: (id, data) => api.patch(`/orders/${id}/update-status/`, data),
    estimatePrice: (data) => api.post('/orders/estimate-price/', data),

}
export default api