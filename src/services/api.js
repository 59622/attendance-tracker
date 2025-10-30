import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const attendanceAPI = {
  // Get all attendance records
  getAll: () => api.get('/attendance'),
  
  // Get filtered attendance records
  getFiltered: (filters) => api.get('/attendance', { params: filters }),
  
  // Add new attendance record
  create: (attendanceData) => api.post('/attendance', attendanceData),
  
  // Delete attendance record
  delete: (id) => api.delete(`/attendance/${id}`),
  
  // Health check
  health: () => api.get('/health')
};

export default api;