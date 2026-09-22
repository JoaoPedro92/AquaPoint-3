import api from './api'

export const reportsService = {
  getAll: () => api.get('/reports'),
  getById: (id) => api.get(`/reports/${id}`),
  getByUserId: (id) => api.get(`/reports/user/${id}`),
  getByPointId: (id) => api.get(`/reports/aquapoint/${id}`),
  create: (data) => api.post('/reports', data),
  delete: (data) => api.post('/reports', {data}),
}