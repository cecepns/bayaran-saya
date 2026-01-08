import axios from 'axios'

const API_BASE_URL = 'https://api-inventory.isavralabel.com/bayaran-saya/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      // Redirect to login if not already there
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth endpoints
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
}

// User endpoints
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getBalance: () => api.get('/user/balance'),
  getTransactions: (page = 1, limit = 10) => api.get(`/user/transactions?page=${page}&limit=${limit}`),
  transfer: (data) => api.post('/user/transfer', data),
  scanQR: (qrData) => api.post('/user/scan', { qrData }),
  pay: (data) => api.post('/user/pay', data),
  cashout: (data) => api.post('/user/cashout', data),
}

// Admin endpoints
export const adminAPI = {
  getAllUsers: (page = 1, limit = 10, search = '') => api.get(`/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),
  getUserById: (userId) => api.get(`/admin/users/${userId}`),
  updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  updateBalance: (userId, data) => api.put(`/admin/balance/${userId}`, data),
  getAllTransactions: (page = 1, limit = 10) => api.get(`/admin/transactions?page=${page}&limit=${limit}`),
  getReloadRequests: () => api.get('/admin/reload-requests'),
  approveReloadRequest: (requestId) => api.post(`/admin/reload-requests/${requestId}/approve`),
  rejectReloadRequest: (requestId, data) => api.post(`/admin/reload-requests/${requestId}/reject`, data),
  getCashoutRequests: () => api.get('/admin/cashout-requests'),
  approveCashoutRequest: (requestId) => api.post(`/admin/cashout-requests/${requestId}/approve`),
  rejectCashoutRequest: (requestId, data) => api.post(`/admin/cashout-requests/${requestId}/reject`, data),
}

export default api
