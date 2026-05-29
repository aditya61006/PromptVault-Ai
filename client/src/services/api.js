import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pv_token');
  if (token && token !== 'demo-token') config.headers.Authorization = `Bearer ${token}`;
  if (token === 'demo-token') {
    localStorage.removeItem('pv_user');
    localStorage.removeItem('pv_token');
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest?._retry && !originalRequest?.url?.includes('/auth/')) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post('/auth/refresh');
        localStorage.setItem('pv_token', data.token);
        localStorage.setItem('pv_user', JSON.stringify(data.user));
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('pv_user');
        localStorage.removeItem('pv_token');
      }
    }
    if (error.response?.status === 401) {
      const message = error.response?.data?.message || '';
      if (/token|log in|jwt/i.test(message)) {
        localStorage.removeItem('pv_user');
        localStorage.removeItem('pv_token');
      }
    }
    return Promise.reject(error);
  }
);

export const promptService = {
  list: (params) => api.get('/prompts', { params }).then((res) => res.data),
  get: (id) => api.get(`/prompts/${id}`).then((res) => res.data),
  create: (data) => api.post('/prompts', data).then((res) => res.data),
  update: (id, data) => api.patch(`/prompts/${id}`, data).then((res) => res.data),
  remove: (id) => api.delete(`/prompts/${id}`).then((res) => res.data),
  like: (id) => api.post(`/prompts/${id}/like`).then((res) => res.data),
  bookmark: (id) => api.post(`/prompts/${id}/bookmark`).then((res) => res.data)
};

export const creatorService = {
  dashboard: () => api.get('/creator/dashboard').then((res) => res.data)
};

export const adminService = {
  stats: () => api.get('/admin/stats').then((res) => res.data),
  prompts: (params) => api.get('/admin/prompts', { params }).then((res) => res.data),
  moderatePrompt: (id, data) => api.patch(`/admin/prompts/${id}/moderate`, data).then((res) => res.data),
  hardDeletePrompt: (id) => api.delete(`/admin/prompts/${id}/hard-delete`).then((res) => res.data),
  auditLogs: () => api.get('/admin/audit-logs').then((res) => res.data),
  users: () => api.get('/users').then((res) => res.data)
};

export const categoryService = {
  list: () => api.get('/categories').then((res) => res.data)
};

export const reviewService = {
  list: (promptId) => api.get(`/reviews/${promptId}`).then((res) => res.data),
  create: (promptId, data) => api.post(`/reviews/${promptId}`, data).then((res) => res.data)
};

export const authService = {
  login: (data) => api.post('/auth/login', data).then((res) => res.data),
  register: (data) => api.post('/auth/register', data).then((res) => res.data),
  me: () => api.get('/auth/me').then((res) => res.data),
  logout: () => api.post('/auth/logout').then((res) => res.data)
};

export const paymentService = {
  createOrder: (promptId) => api.post('/payments/create-order', { promptId }).then((res) => res.data),
  verify: (data) => api.post('/payments/verify', data).then((res) => res.data),
  history: () => api.get('/payments/history').then((res) => res.data)
};

export const uploadService = {
  media: (files) => {
    const form = new FormData();
    files.forEach((file) => form.append('media', file));
    return api.post('/uploads/media', form, { headers: { 'content-type': 'multipart/form-data' } }).then((res) => res.data);
  }
};
