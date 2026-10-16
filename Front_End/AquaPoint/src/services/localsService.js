import api from './api'

export const localsService = {
  getAll: () => api.get('/locals'),
  getById: (id) => api.get(`/locals/${id}`),
  getByName: (name) => api.get(`/locals/name/${name}`),
  create: (data) => api.post('/locals', data),
}