import api from './api'

export const typesService = {
  getAll: () => api.get('/types'),
  getById: (id) => api.get(`/types/${id}`),
}