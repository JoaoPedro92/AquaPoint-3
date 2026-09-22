import api from './api'

export const zonesService = {
  getAll: () => api.get('/zones'),
  getById: (id) => api.get(`/zones/${id}`),
  getByName: (name) => api.get(`/zones/name/${name}`),
  create: (data) => api.post('/zones', data),
}