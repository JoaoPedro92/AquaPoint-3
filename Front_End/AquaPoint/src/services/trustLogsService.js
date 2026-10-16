import api from './api'

export const trustLogsService = {
  getAll: () => api.get('/trustlogs'),
  getById: (id) => api.get(`/trustlogs/${id}`),
  getByPointId: (id) => api.get(`/trustlogs/aquapoint/${id}`),
  getByUserId: (userId) => api.get(`/trustlogs/user/${userId}`),
  getByUserAndAquapointId: (userId, pointId) => api.get(`/trustlogs/user/${userId}/aquapoint/${pointId}`),
  getMostRecentTrustLogByUserAndAquapointId: (userId, pointId) => api.get(`/trustlogs/user/${userId}/aquapoint/${pointId}/most-recent`),
  isVoteEnableByUserAndAquapointId: (userId, pointId) => api.get(`/trustlogs/user/${userId}/aquapoint/${pointId}/is-vote-enable`),
  create: (data) => api.post('/trustlogs', data),
  delete: (id) => api.delete('/trustlogs/', { data: { id } })
}