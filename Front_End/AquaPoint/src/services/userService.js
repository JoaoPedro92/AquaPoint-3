import api from "./api.js"

export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  getProfilePicture: (id) => api.get(`/users/${id}/profile-picture`),
  create: (data) => api.post('/users', data),
  comparePasswords: (inputPassword, userPassword) => api.post('/users/compare-passwords', { inputPassword, userPassword }),
  update: (id, data) => api.put(`/users/${id}`, data),
  changeIsAdmin: (id, data) => api.put(`/users/${id}/change-isadmin`, data),
  delete: (id) => api.delete(`/users/${id}`),
}