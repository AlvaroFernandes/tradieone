import axios from 'axios';
import { API_BASE_URL } from '@/config/config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from localStorage to each request if present
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        if (!config.headers) {
          config.headers = {};
        }
        (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }
    } catch (err) {
      // ignore localStorage errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
