import axios from 'axios';
import { storage } from '../utils/storage';

// Nota: en desarrollo local en emulador Android usa 10.0.2.2; en dispositivo físico usa tu IP local
export const API_BASE_URL = 'http://10.0.2.2:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si la API no está disponible o da error de red, registramos el log
    if (!error.response) {
      console.warn('Network error or server unreachable:', error.message);
    }
    return Promise.reject(error);
  }
);
