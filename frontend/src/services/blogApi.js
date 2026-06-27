import api from './api'

export const blogAPI = {
  list: () => api.get('/blog/'),
  featured: () => api.get('/blog/featured/'),
  detail: (slug) => api.get(`/blog/${slug}/`),
}
