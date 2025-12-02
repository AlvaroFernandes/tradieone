import axios, {AxiosHeaders} from 'axios';
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
          config.headers = new AxiosHeaders();
        }
        (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
      }
    } catch (err) {
      // ignore localStorage errors
      console.log('Error accessing localStorage for auth token', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
