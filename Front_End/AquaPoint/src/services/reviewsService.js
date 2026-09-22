import api from './api'

export const reviewsService = {
  getAll: () => api.get('/reviews'),
  getById: (id) => api.get(`/reviews/${id}`),
  getByPointId: (id) => api.get(`/reviews/aquapoint/${id}`),
  getByUserId: (userId) => api.get(`/reviews/user/${userId}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete('/reviews/', { data: { id } })
}