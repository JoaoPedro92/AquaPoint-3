import api from './api'

export const aquapointService = {
  getAll: () => api.get('/aquapoints'),
  getById: (id) => api.get(`/aquapoints/${id}`),
  getPendingPoints: () => api.get(`/aquapoints/pending-points`),
  getPendingCount: () => api.get(`/aquapoints/pending-points-count`),
  getUserFavoritePoints: (id) => api.get(`/aquapoints/user/${id}/favorites`),
  create: (data) => api.post('/aquapoints', data),
  update: (id, data) => api.put(`/aquapoints/${id}`, data),
  changeTrustLevel: (id, trustLevel) => api.put(`/aquapoints/${id}/change-trust-level`, trustLevel),
  delete: (id) => api.delete(`/aquapoints/${id}`),
}