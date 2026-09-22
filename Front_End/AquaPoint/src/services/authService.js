import api from "./api"

export const authService = {
  authenticateUser: (data) => api.post('/auth', data)  
}