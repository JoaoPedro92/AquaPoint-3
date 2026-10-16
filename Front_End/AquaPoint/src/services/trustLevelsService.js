import api from './api'

export const trustLevelService = {
  getAll: () => api.get('/trustLevels'),
  getById: (id) => api.get(`/trustLevels/${id}`),
}