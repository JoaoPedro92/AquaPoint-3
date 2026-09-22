import api from './api'

export const favoritesService = {
  getAll: () => api.get('/favorites'),
  getById: (id) => api.get(`/favorites/${id}`),
  create: (data) => api.post('/favorites', data),
  deleteByUserAndPointId: (data) => api.delete('/favorites', {data})
}