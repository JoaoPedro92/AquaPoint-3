import api from './api'

export const statesService = {
  getAll: () => api.get('/states'),
  getById: (id) => api.get(`/states/${id}`),
}