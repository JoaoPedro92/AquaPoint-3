import api from './api'

export const favoriteService = {
  getAll: () => api.get('/favorites'),
  getById: (id) => api.get(`/favorites/${id}`),
  getByUserId: (id) => api.get(`/favorites/user/${id}`),
  create: (data) => api.post('/favorites', data),
  delete: (data) => api.delete('/favorites', { data }),
}