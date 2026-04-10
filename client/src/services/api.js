import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ====== AUTH ======
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgotpassword', { email }),
  resetPassword: (token, password) => api.put(`/auth/resetpassword/${token}`, { password }),
};

// ====== USER ======
export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
};

// ====== TUTORS ======
export const tutorAPI = {
  getAll: (params) => api.get('/tutors', { params }),
  getById: (id) => api.get(`/tutors/${id}`),
  getRecommended: () => api.get('/tutors/recommended'),
};

// ====== BOOKINGS ======
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMine: (params) => api.get('/bookings/mine', { params }),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  delete: (id) => api.delete(`/bookings/${id}`),
};

// ====== REVIEWS ======
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByTutor: (tutorId) => api.get(`/reviews/tutor/${tutorId}`),
};

// ====== ADMIN ======
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  approveTutor: (id, isApproved) => api.put(`/admin/tutors/${id}/approve`, { isApproved }),
  getAnalytics: () => api.get('/admin/analytics'),
};

export default api;
