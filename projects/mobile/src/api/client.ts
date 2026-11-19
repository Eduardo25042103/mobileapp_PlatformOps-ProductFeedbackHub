import axios from 'axios';
import { storage } from '../utils/storage';

// URL en AWS Lambda + Amazon API Gateway v2 HTTP API (Misma que Portal Web Angular)
export const API_BASE_URL = 'https://193b69gfya.execute-api.us-east-2.amazonaws.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Platform': 'REACT_NATIVE_ANDROID',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await storage.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignora errores de lectura de almacenamiento
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.warn('[Network Error] AWS Backend inalcanzable:', error.message);
    }
    return Promise.reject(error);
  }
);
